
const {isNumber, isChar} = require('./utils.js')
class ColorLog {
    constructor(text) {
        this.text = text
        this.pos = 0
        this.current_char = this.text[this.pos] || null
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
    _id() {
        let result = ''
        while (this.current_char !== null && isChar(this.current_char)) {
            result += this.current_char
            this.advance()
        }
        return result
    }
    log() {
        while (this.current_char !== null) {
            if (this.current_char === '.') {
                this.advance()
                process.stdout.write('\x1B[33m.\x1B[0m')
            } else if (isChar(this.current_char)) {
                let id = this._id()
                if (id === 'color') {
                    process.stdout.write(`\x1b[32m${ id }\x1b[0m`)
                } else if (id === 'red') {
                    process.stdout.write(`\x1b[31m${ id }\x1b[0m`)
                } else {
                    process.stdout.write(`\x1b[33m${ id }\x1b[0m`)
                }
            } else if (this.current_char === '{' || this.current_char === '}') {
                process.stdout.write(`\x1b[93m${ this.current_char }\x1b[0m`)
                this.advance()
            } else {
                process.stdout.write(this.current_char)
                this.advance()
            }
        }
        process.stdout.write('\n')
    }
}
const __main = function () {
    let input = `.a {
    color: red
}`
    let colorLog = new ColorLog(input)
    colorLog.log()
}
__main()