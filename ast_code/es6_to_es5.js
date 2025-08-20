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

const transformArrowFunction = function(node) {
    return {
        type: 'FunctionExpression',
        id: null,
        params: node.params,
        body: node.body,
        generator: false,
        expression: false,
        async: node.async
    }
}

const transformClass = function(node) {
    // 将类转换为构造函数
    let constructor = node.body.body.find(m => m.kind === 'constructor') || {
        value: {
            params: [],
            body: {
                type: 'BlockStatement',
                body: []
            }
        }
    }

    let methods = node.body.body.filter(m => m.kind !== 'constructor')
    
    let constructorFunction = {
        type: 'FunctionDeclaration',
        id: node.id,
        params: constructor.value.params,
        body: constructor.value.body,
    }

    // 将方法添加到原型上
    let prototypeAssignments = methods.map(method => ({
        type: 'ExpressionStatement',
        expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
                type: 'MemberExpression',
                object: {
                    type: 'MemberExpression',
                    object: node.id,
                    property: {
                        type: 'Identifier',
                        name: 'prototype'
                    }
                },
                property: method.key
            },
            right: {
                type: 'FunctionExpression',
                id: null,
                params: method.value.params,
                body: method.value.body
            }
        }
    }))

    return [constructorFunction, ...prototypeAssignments]
}

const transformLetConst = function(node) {
    // 将 let/const 转换为 var
    return {
        ...node,
        kind: 'var'
    }
}

const transformTemplateString = function(node) {
    // 将模板字符串转换为字符串拼接
    if (node.expressions.length === 0) {
        return {
            type: 'Literal',
            value: node.quasis[0].value.raw
        }
    }

    let result = {
        type: 'BinaryExpression',
        operator: '+',
        left: null,
        right: null
    }

    let current = result
    for (let i = 0; i < node.expressions.length; i++) {
        current.left = {
            type: 'Literal',
            value: node.quasis[i].value.raw
        }
        current.right = node.expressions[i]

        if (i < node.expressions.length - 1) {
            current.right = {
                type: 'BinaryExpression',
                operator: '+',
                left: current.right,
                right: null
            }
            current = current.right
        }
    }

    if (node.quasis[node.quasis.length - 1].value.raw) {
        current.right = {
            type: 'BinaryExpression',
            operator: '+',
            left: current.right,
            right: {
                type: 'Literal',
                value: node.quasis[node.quasis.length - 1].value.raw
            }
        }
    }

    return result
}

const transformNode = function(node) {
    if (!node) {
        return node
    }

    // 递归处理所有子节点
    Object.keys(node).forEach(key => {
        if (Array.isArray(node[key])) {
            node[key] = node[key].map(n => transformNode(n))
        } else if (typeof node[key] === 'object' && node[key] !== null) {
            node[key] = transformNode(node[key])
        }
    })

    // 转换特定的节点类型
    switch (node.type) {
        case 'ArrowFunctionExpression':
            return transformArrowFunction(node)
        case 'ClassDeclaration':
            return transformClass(node)
        case 'VariableDeclaration':
            if (node.kind === 'let' || node.kind === 'const') {
                return transformLetConst(node)
            }
            return node
        case 'TemplateLiteral':
            return transformTemplateString(node)
        default:
            return node
    }
}

const es6ToEs5 = function(code) {
    let ast = astForCode(code)
    let transformedAst = transformNode(ast)
    return transformedAst
}

const __main = function() {
    let code = fs.readFileSync('./test.js', 'utf8')
    let ast = es6ToEs5(code)
    log('transformed ast:', JSON.stringify(ast, null, 2))
}

__main()