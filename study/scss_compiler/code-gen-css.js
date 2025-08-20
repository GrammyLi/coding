
const {log} = require('./utils')
const tab = '    '
const logCodeGen = function (...args) {
    log(...args)
}
const codeGen = function (node) {
    if (node.type === 'ProgramCss') {
        let list = []
        for (let e of node.list) {
            list.push(codeGen(e))
        }
        return list.join('\n')
    }
    if (node.type === 'SelectorExpressionCss') {
        let selector = codeGen(node.expression)
        let block = codeGen(node.block)
        return `${ selector } ${ block }`
    }
    if (node.type === 'SelectorCss') {
        return codeGen(node.content)
    }
    if (node.type === 'TextCss') {
        return node.value
    }
    if (node.type === 'BlockCss') {
        let codesOfBlock = node.list.map(e => codeGen(e))
        let codesWithTab = codesOfBlock.map(e => `${ tab }${ e }`)
        let codeJoinWrap = codesWithTab.join('\n')
        return `{\n${ codeJoinWrap }\n}`
    }
    if (node.type === 'PropertyCss') {
        let key = codeGen(node.key)
        let value = codeGen(node.value)
        return `${ key }: ${ value };`
    }
    if (node.type === 'SelectorChildCss') {
        let l = node.list.map(e => codeGen(e))
        return l.join(' ')
    }
    if (node.type === 'SelectorGroupCss') {
        let l = node.list.map(e => codeGen(e))
        return l.join(', ')
    }
    throw new Error(`code error, node type ${ node.type } no handle if statement, node is ${ node }`)
}
module.exports = codeGen