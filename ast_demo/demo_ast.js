// 除了常规浏览器用到的 js 引擎, 还有一些其他引擎, 比如
// http://esprima.org/index.html
// https://github.com/acornjs/acorn
// https://babeljs.io/docs/en/next/babel-parser.html
// https://bellard.org/quickjs/

const fs = require('fs')
const parser = require('@babel/parser')
// AST 是一棵树, 可以对这棵树进行遍历和更新, 类似 DOM 树, @babel/traverse 是遍历和更新这棵树的库
const traverse = require('@babel/traverse').default
// babel6 使用的是 transformFromAst 方法, babel7 建议使用 transformFromAstSync 方法
// https://babeljs.io/docs/en/babel-core#transformfromast
const { transformFromAstSync } = require('@babel/core')

const astForCode = (code) => {
    let ast = parser.parse(code, {
        sourceType: 'module',
    })
    return ast
}

const traverseAst = (ast) => {
    // traverse 第二个参数是 visitor, 遍历 ast 用的是 visitor pattern
    // 也就是定义一系列 visitor, 如果 ast 节点的 type === visitor, 那么进入对应的函数
    // ast node type 列表：https://github.com/babel/babel/blob/a2e6d8e96807b15908ef3640239b5421457807f7/packages/babel-parser/ast/spec.md
    traverse(ast, {
        // 除了上面列表列出来的 type, 还有 enter, exit 之类的 hook
        // enter 表示要处理 node 时, exit 表示处理完 node 要离开时
        enter(path) {
            console.log('enter visit', path.node.type)
        },
        VariableDeclarator(path) {
            console.log('declaration visit', path.node.type)
        }
    })
    // traverse(ast, {
    //     enter: function(path) {
    //     },
    // })
}

const transformedAst = (ast) => {
    traverse(ast, {
        // 假设想把 let a = 2 修改成 let b = 2, 那么就不适合通过 Identifier 判断
        // 使用 enter 判断会方便很多
        enter(path) {
            let { type, name } = path.node
            // type 是 string 类型, 这里实际上应该用枚举, 但是 js 并没有枚举
            // 如果节点是变量并且变量的名称是 name, 那么把变量的名称改为 username
            if (type === 'Identifier' && name === 'name') {
                path.node.name = 'username'
            }
        }
    })
    return ast
}

const codeFromAst = (ast, sourceCode) => {
    let r = transformFromAstSync(ast, sourceCode)
    return r.code
}

const __main = () => {
    let source = fs.readFileSync('code.js', 'utf8')
    // console.log(source, typeof source)
    let ast = astForCode(source)
    traverseAst(ast)
    let newAst = transformedAst(ast)
    let code = codeFromAst(newAst, source)
    console.log('code', code)
}

if (require.main === module) {
    __main()
}
