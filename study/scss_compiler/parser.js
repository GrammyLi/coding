
const TokenType = require('./token-type.js')
const {strEscape, log, readFile} = require('./utils')
const Lexer = require('./lexer.js')
const {BinOp, Num, UnaryOp, Program, Assign, NoOp, SelectorExpression, Property, Var, Symbol, SelectorGroup, SelectorChild, Selector, Block, ListExpression, PropertyValue, MixinExpression, IncludeExpression, ParamDeclaration, ParamList, CallFunction, DollarExpression, SelectorWithFather, SelectorFather, IfExpreesion, UseExpression, StringStatement, PointExpression, ElseExpreesion} = require('./ast-generate.js')
const {ReservedKeyword} = require('./reserved-keyword')
const logPaser = function (...args) {
}
const paserFromText = function (text) {
    let lexer = new Lexer(text)
    let parser = new Parser(lexer)
    return parser.parser()
}
class Parser {
    constructor(lexer) {
        this.lexer = lexer
        this.current_token = null
        this.current_token = this.lexer.get_next_token()
    }
    eat(token_type) {
        if (this.current_token.type === token_type) {
            this.current_token = this.lexer.get_next_token()
        } else {
            console.trace()
            throw new Error(`eat error: ${ this.current_token }, expect token type ${ token_type }`)
        }
    }
    program() {
        let node = this.compound_statement()
        return node
    }
    compound_statement() {
        let nodes = this.statement_list()
        let root = new Program()
        for (let n of nodes) {
            root.children.push(n)
        }
        return root
    }
    statement_list() {
        let result = []
        let node = this.statement_by_token()
        if (node) {
            result.push(node)
        }
        let results = [node]
        while (this.current_token.type === TokenType.id || this.current_token.type === TokenType.dot || this.current_token.type === TokenType.mail) {
            let node = this.statement_by_token()
            if (node) {
                results.push(node)
            }
        }
        return results
    }
    statement_by_token() {
        if (this.current_token.type === TokenType.dot || this.current_token.type === TokenType.and) {
            return this.selector_expression_statement()
        } else if (this.current_token.type === TokenType.id) {
            return this.property_statement()
        } else if (this.current_token.type === TokenType.dollar) {
            return this.variable_statement()
        } else if (this.current_token.type === TokenType.mail) {
            return this.expression_statement()
        } else {
            return undefined
        }
    }
    id_statement() {
        if (this.current_token.type !== TokenType.id && this.current_token.type !== TokenType.integer && this.current_token.type !== TokenType.middleLine) {
            throw `id_statement error, type ${ this.current_token.type } is not type id/num/middle line`
        }
        let value = ''
        while (1) {
            if (this.current_token.type === TokenType.id || this.current_token.type === TokenType.middleLine || this.current_token.type === TokenType.integer) {
                value += this.current_token.value
                this.eat(this.current_token.type)
            } else {
                break
            }
        }
        if (value === '') {
            throw 'id_statement error result is null'
        }
        let idAst = new Symbol(value)
        if (this.current_token.type === TokenType.dot) {
            this.eat(TokenType.dot)
            return new PointExpression(idAst, this.id_statement())
        }
        return idAst
    }
    param_list_statement() {
        let list = []
        if (this.current_token.type === TokenType.lparen) {
            this.eat(TokenType.lparen)
            while (this.current_token.type !== TokenType.rparen) {
                if (this.current_token.type === TokenType.comma) {
                    this.eat(TokenType.comma)
                }
                let param = this.param_declaration()
                list.push(param)
            }
            this.eat(TokenType.rparen)
        }
        return new ParamList(list)
    }
    param_declaration() {
        let content
        if (this.current_token.type === TokenType.dollar) {
            this.eat(TokenType.dollar)
            content = new DollarExpression(this.current_token.value)
            this.eat(TokenType.id)
        } else {
            content = this.id_statement()
        }
        let node = new ParamDeclaration(content)
        return node
    }
    string_statemnt() {
        let r = ''
        this.eat(TokenType.quotationSingle)
        while (this.current_token.type !== TokenType.quotationSingle) {
            r += this.current_token.value
            this.eat(this.current_token.type)
        }
        this.eat(TokenType.quotationSingle)
        return new StringStatement(r)
    }
    expression_statement() {
        this.eat(TokenType.mail)
        if (this.current_token.type !== TokenType.id) {
            throw 'expression_statement error, the @ next token is not id'
        }
        if (this.current_token.value === ReservedKeyword.mixin) {
            this.eat(TokenType.id)
            this.eat(TokenType.space)
            let headAst = this.id_statement()
            let paramList = this.param_list_statement()
            this.eat(TokenType.lcurly)
            let block = this.statement_list()
            let blockAst = new Block(block)
            let node = new MixinExpression(headAst, paramList, blockAst)
            this.eat(TokenType.rcurly)
            return node
        } else if (this.current_token.value === ReservedKeyword.include) {
            this.eat(TokenType.id)
            this.eat(TokenType.space)
            let idAst = this.id_statement()
            let paramList = this.param_list_statement()
            let nodeCall = new CallFunction(idAst, paramList)
            let node = new IncludeExpression(nodeCall)
            this.eat(TokenType.semi)
            return node
        } else if (this.current_token.value === ReservedKeyword.if) {
            this.eat(TokenType.id)
            this.eat(TokenType.space)
            let idAst = this.id_statement()
            this.eat(TokenType.lcurly)
            let block = this.statement_list()
            let blockAst = new Block(block)
            this.eat(TokenType.rcurly)
            let node = new IfExpreesion(idAst, blockAst)
            return node
        } else if (this.current_token.value === ReservedKeyword.use) {
            this.eat(TokenType.id)
            let nodePath = this.string_statemnt()
            this.eat(TokenType.semi)
            let node = new UseExpression(nodePath)
            return node
            path = `./${ path.replace(/\//g, '/_') }.scss`
            let contentScss = readFile(path)
            let acssAst = paserFromText(contentScss)
            logPaser('acssAst in use:', acssAst)
        } else if (this.current_token.value === ReservedKeyword.else) {
            this.eat(TokenType.id)
            this.eat(TokenType.lcurly)
            let block = this.statement_list()
            let blockAst = new Block(block)
            let node = new ElseExpreesion(blockAst)
            this.eat(TokenType.rcurly)
            return node
        } else {
            console.log(`expression_statement error: the @ expression ${ this.current_token.value } is no handle`)
        }
    }
    variable_statement() {
        this.eat(TokenType.dollar)
        let key = this.current_token.value
        this.eat(TokenType.id)
        this.eat(TokenType.colon)
        let value = this.current_token.value
        this.eat(TokenType.id)
        let node = new Assign(key, value)
        this.eat(TokenType.semi)
        return node
    }
    selector() {
        let token = this.current_token
        if (token.type === TokenType.dot) {
            this.eat(TokenType.dot)
            let id = this.id_statement()
            id.text = `.${ id.text }`
            return new Selector(id)
        } else if (token.type === TokenType.and) {
            this.eat(TokenType.and)
            let f = new SelectorFather()
            let selector = new SelectorWithFather([f])
            let id = this.id_statement()
            selector.list.push(id)
            return selector
        } else {
            console.trace()
            throw new Error(`selector error, no dot/and, is ${ token.type }`)
        }
    }
    selector_head_single_son_group() {
        let firstStatement = this.selector()
        if (this.current_token.type === TokenType.space) {
            let l = [firstStatement]
            while (1) {
                if (this.current_token.type === TokenType.space) {
                    this.eat(TokenType.space)
                    l.push(this.selector())
                } else if (this.current_token.type === TokenType.lcurly) {
                    this.eat(TokenType.lcurly)
                    break
                } else {
                    throw 'selector_head_single_son_group error, is no lcurly end'
                }
            }
            let node = new SelectorChild(l)
            return node
        } else if (this.current_token.type === TokenType.comma) {
            let l = [firstStatement]
            while (1) {
                if (this.current_token.type === TokenType.comma) {
                    this.eat(TokenType.comma)
                    l.push(this.selector())
                } else if (this.current_token.type === TokenType.lcurly) {
                    this.eat(TokenType.lcurly)
                    break
                } else {
                    throw 'selector_head_single_son_group error, is no lcurly end'
                }
            }
            let node = new SelectorGroup(l)
            return node
        }
        this.eat(TokenType.lcurly)
        return firstStatement
    }
    selector_expression_statement() {
        let content = this.selector_head_single_son_group()
        let children = this.statement_list()
        let block = new Block(children)
        let node = new SelectorExpression(content, block)
        if (this.current_token.type === TokenType.rcurly) {
            this.eat(this.current_token.type)
        }
        return node
    }
    property_value() {
        let l = []
        while (this.current_token.type !== TokenType.semi) {
            if (this.current_token.type === TokenType.id || this.current_token.type === TokenType.integer || this.current_token.type === TokenType.middleLine) {
                let ast = this.id_statement()
                l.push(ast)
            } else if (this.current_token.type === TokenType.dollar) {
                this.eat(TokenType.dollar)
                let ast = new Var(this.current_token.value)
                this.eat(TokenType.id)
                l.push(ast)
            } else if (this.current_token.type === TokenType.space) {
                logPaser('eat space')
                this.eat(TokenType.space)
            } else {
                break
            }
        }
        let content
        if (l.length === 1) {
            content = l[0]
        } else {
            content = new ListExpression(l)
        }
        return new PropertyValue(content)
    }
    property_statement() {
        let key = this.id_statement()
        this.eat(TokenType.colon)
        let node = new Property(key, this.property_value())
        this.eat(TokenType.semi)
        return node
    }
    parser() {
        let node = this.program()
        if (this.current_token.type !== TokenType.eof) {
            logPaser('ast scss error:', node)
            throw `parser no eat all token, cur token is:${ strEscape(this.current_token.value) }`
        }
        return node
    }
}
module.exports = Parser