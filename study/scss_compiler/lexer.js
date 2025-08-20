
const {isNumber, isChar, log} = require('./utils.js')
const Token = require('./token')
const TokenType = require('./token-type.js')
const logLexer = function (...args) {
    log(...args)
}
class Lexer {
    constructor(text) {
        this.text = text
        this.pos = 0
        this.current_char = this.text[this.pos] || null
        this.peekTokenList = []
    }
    advance() {
        this.pos += 1
        if (this.pos > this.text.length - 1) {
            this.current_char = null
        } else {
            this.current_char = this.text[this.pos]
        }
    }
    peek(posAdd = 1) {
        let peek_pos = this.pos + posAdd
        if (peek_pos > this.text.length - 1) {
            return null
        } else {
            return this.text[peek_pos]
        }
    }
    hasCharBefore(char) {
        let cur_pos = this.pos
        while (cur_pos > 0) {
            cur_pos--
            let v = this.text[cur_pos]
            if (v === char) {
                return true
            }
        }
        return false
    }
    hasCharWithSpaceBefore() {
        let cur_pos = this.pos
        while (cur_pos > 0) {
            cur_pos--
            let v = this.text[cur_pos]
            if (isChar(v)) {
                return true
            }
            if (v !== ' ') {
                break
            }
        }
        return false
    }
    _id() {
        let result = ''
        while (this.current_char !== null && isChar(this.current_char)) {
            result += this.current_char
            this.advance()
        }
        return new Token(TokenType.id, result)
    }
    integer() {
        let result = ''
        while (isNumber(this.current_char)) {
            result += this.current_char
            this.advance()
        }
        return Number(result)
    }
    canSaveSpace() {
        if (this.current_char !== ' ') {
            throw 'lexer canSaveSpace error current_char is not space'
        }
        let next = this.peek()
        /**
         * TODO: 重构优化这里的判断
         * !this.hasCharBefore('\n')是为了去除.a{\n%space.b {}}的空格
         * this.hasCharWithSpaceBefore()是为了防止!this.hasCharBefore('\n')去掉.a { .b%space.c {}}这种空格
         * !this.hasCharBefore(',')是为了去除群组选择器，a,%space.b{}这种空格
         */
        let isSpaceChildSelector = next === '.' && (!this.hasCharBefore('\n') || this.hasCharWithSpaceBefore()) && !this.hasCharBefore(',')
        let isSpaceProperty = isChar(next) && this.hasCharWithSpaceBefore()
        return isSpaceChildSelector || isSpaceProperty
    }
    _get_next_token() {
        while (this.current_char !== null) {
            if (this.current_char === ' ') {
                if (this.canSaveSpace()) {
                    this.advance()
                    return new Token(TokenType.space, ' ')
                } else {
                    this.advance()
                    continue
                }
            }
            if (this.current_char === '\n') {
                this.advance()
                continue
            }
            if (this.current_char === '@') {
                this.advance()
                return new Token(TokenType.mail, '@')
            }
            if (isChar(this.current_char)) {
                return this._id()
            }
            if (this.current_char === '$') {
                this.advance()
                return new Token(TokenType.dollar, '$')
            }
            if (this.current_char === ':' && this.peek() === '=') {
                this.advance()
                this.advance()
                return new Token(TokenType.assign, ':=')
            }
            if (this.current_char === ':') {
                this.advance()
                return new Token(TokenType.colon, ':')
            }
            if (this.current_char === ';') {
                this.advance()
                return new Token(TokenType.semi, ';')
            }
            if (isNumber(this.current_char)) {
                return new Token(TokenType.integer, this.integer())
            }
            if (this.current_char === '+') {
                this.advance()
                return new Token(TokenType.plus, '+')
            }
            if (this.current_char === '/') {
                this.advance()
                return new Token(TokenType.div, '/')
            }
            if (this.current_char === '*') {
                this.advance()
                return new Token(TokenType.mul, '*')
            }
            if (this.current_char === '(') {
                this.advance()
                return new Token(TokenType.lparen, '(')
            }
            if (this.current_char === ')') {
                this.advance()
                return new Token(TokenType.rparen, ')')
            }
            if (this.current_char === '{') {
                this.advance()
                return new Token(TokenType.lcurly, '{')
            }
            if (this.current_char === '}') {
                this.advance()
                return new Token(TokenType.rcurly, '}')
            }
            if (this.current_char === '.') {
                this.advance()
                return new Token(TokenType.dot, '.')
            }
            if (this.current_char === ',') {
                this.advance()
                return new Token(TokenType.comma, ',')
            }
            if (this.current_char === '-') {
                this.advance()
                return new Token(TokenType.middleLine, '-')
            }
            if (this.current_char === '&') {
                this.advance()
                return new Token(TokenType.and, '&')
            }
            if (this.current_char === '\'') {
                this.advance()
                return new Token(TokenType.quotationSingle, '\'')
            }
            throw new Error(`get next token: the char is illege: ${ this.current_char }`)
        }
        return new Token(TokenType.eof, null)
    }
    get_next_token() {
        if (this.peekTokenList.length > 0) {
            let t = this.peekTokenList.shift()
            return t
        } else {
            return this._get_next_token()
        }
    }
    peekToken(forward = 1) {
        if (forward <= this.peekTokenList.length) {
            return this.peekTokenList[forward - 1]
        } else {
            let diff = forward - this.peekTokenList.length
            let lastToken
            for (let i = 0; i < diff; i++) {
                lastToken = this._get_next_token()
                this.peekTokenList.push(lastToken)
            }
            return lastToken
        }
    }
}
module.exports = Lexer