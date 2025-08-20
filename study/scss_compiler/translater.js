
const {log} = require('./utils')
const Lexer = require('./lexer.js')
const Parser = require('./parser.js')
const Interpreter = require('./transform.js')
const CodeGen = require('./code-gen-css.js')
const TokenType = require('./token-type.js')
const logTranslater = function (...args) {
    log(...args)
}
const logLexerToken = function (text) {
    logTranslater('log lexer tokens -------------------------')
    let lexer = new Lexer(text)
    while (1) {
        let t = lexer.get_next_token()
        if (t.type === TokenType.eof) {
            break
        } else {
            logTranslater('token:', t)
        }
    }
}
const translater = function (text) {
    let lexer = new Lexer(text)
    logLexerToken(text)
    let parser = new Parser(lexer)
    let transform = new Interpreter(parser)
    let astCss = transform.interpret()
    let result = CodeGen(astCss)
    return result
}
module.exports = { translater }