const fs = require('fs')
const path = require('path')

const espree = require('espree')

const log = console.log.bind(console)

const astForCode = function(code) {
    let ast = espree.parse(code, {
        ecmaVersion: 'latest',
        sourceType: 'module',
    })
    return ast
}

const codeGen = function(node) {
    let type = node.type
    if (type === 'Program') {
        let body = node.body
        let s = body.map(b => codeGen(b)).join('\n')
        return s
    } else if (type === 'VariableDeclaration') {
        // node.declarations 是数组
        // let a = 2, b = 3 这样的代码数组有两个元素
        // let a = 2 数组有一个元素
        // declare a variable named ds and assign node.declarations to it
        let ds = node.declarations
        let s1 = ds.map(d => codeGen(d)).join(', ')
        let kind = node.kind
        let r = `${kind} ${s1}`
        return r
    } else if (type === 'VariableDeclarator') {
        let id = node.id
        let init = node.init

        id = codeGen(id)
        init = codeGen(init)
        let s = `${id} = ${init}`
        return s
    } else if (type === 'Identifier') {
        return node.name
    } else if (type === 'Literal') {
        return node.value
    } else if (type === 'BinaryExpression') {
        let op = node.operator
        let left = node.left
        let right = node.right

        left = codeGen(left)
        right = codeGen(right)
        let s = `${left} ${op} ${right}`
        return s
    } else if (type === 'FunctionExpression') {
        let params = node.params.map(p => codeGen(p)).join(', ')
        let body = codeGen(node.body)
        let s = `function(${params}) { ${body} }`
        return s
    } else if (type === 'BlockStatement') {
        let s = node.body.map(b => codeGen(b)).join('\n')
        return s
    }
}


// https://github.com/sumNerGL/FakeLispInterpreter
// https://github.com/rspivak/lsbasi

const CodeGen2 = class {
    constructor(ast) {
        this.visit(ast)
    }
    visit(node) {
        let type = node.type
        let method = 'visit' + type
        log('method', method)
        let s = this[method](node)
        return s
    }
    visitProgram(node) {
        let body = node.body
        let s = body.map(b => this.visit(b)).join('\n')
        return s
    }
    visitVariableDeclaration(node) {
        let ds = node.declarations
        let s1 = ds.map(d => this.visit(d)).join(', ')
        let kind = node.kind
        let r = `${kind} ${s1}`
        return r
    }
    visitVariableDeclarator(node) {
        let id = node.id
        let init = node.init

        id = this.visit(id)
        init = this.visit(init)
        let s = `${id} = ${init}`
        return s
    }
    visitIdentifier(node) {
        return node.name
    }
    visitFunctionExpression(node) {
        let params = node.params.map(p => this.visit(p)).join(', ')
        let body = this.visit(node.body)
        let s = `function(${params}) { ${body} }`
        return s
    }
    visitCallExpression(node) {
        let callee = this.visit(node.callee)
        let args = node.arguments.map(a => this.visit(a)).join('\n')
        let s = `${callee}(${args})`
        return s
    }
    visitBlockStatement(node) {
        let s = node.body.map(b => this.visit(b)).join('\n')
        return s
    }
    visitExpressionStatement(node) {

    }
    visitLiteral(node) {
        return node.value
    }
}

const __main = function() {
    let s = fs.readFileSync('./a.js', 'utf8')
    let ast = astForCode(s)
    let c = codeGen(ast)
    // let code = c.visit(ast)
    log('code', c)
}

__main()