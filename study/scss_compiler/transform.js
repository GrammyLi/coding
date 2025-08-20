
const {log} = require('./utils.js')
const {SelectorExpressionCss, SelectorCss, BlockCss, PropertyCss, TextCss, ProgramCss, SelectorChildCss, SelectorGroupCss} = require('./ast-generate-css.js')
const logTansform = (...args) => {
    log(...args)
}
const MixinScopeDeclarationTran = (paramList, body) => {
    return {
        type: 'MixinScopeDeclarationTran',
        paramList: paramList,
        body: body
    }
}
const MixinVarReadTran = name => {
    return {
        type: 'MixinVarReadTran',
        name: name
    }
}
class Scope {
    constructor() {
        this.stack = []
    }
    get last() {
        return this.stack[this.stack.length - 1]
    }
    define(key, value) {
        this.last[key] = value
    }
    pop() {
        this.stack.pop()
    }
    add() {
        this.stack.push({})
    }
    valueFromScope(key) {
        let i = this.stack.length - 1
        while (i >= 0) {
            let value = this.stack[i][key]
            if (value !== undefined) {
                return value
            }
            i--
        }
        return undefined
    }
}
class visitHistory {
    constructor() {
        this.stack = []
    }
    pre(preIndex = 1) {
        let last = this.stack.length - 1
        let index = last - preIndex
        return this.stack[index]
    }
    get now() {
        let last = this.stack.length - 1
        return this.stack[last]
    }
    pop() {
        this.stack.pop()
    }
    push(visit) {
        this.stack.push(visit)
        if (this.stack.length > 1000) {
            this.stack.shift()
        }
    }
    hasValueBefore(value) {
        let i = this.stack.length - 1
        while (i >= 0) {
            if (value === this.stack[i]) {
                return true
            }
            i--
        }
        return false
    }
    is_visit_ing(visit_func_name) {
        return this.hasValueBefore(visit_func_name)
    }
}
class Transform {
    constructor(parser) {
        this.parser = parser
        this.scope = new Scope()
        this.scope.add()
        this.scopeMixin = new Scope()
        this.scopeMixin.add()
        this.history = new visitHistory()
    }
    visit(node) {
        let funcName = `visit_${ node.type }`
        if (!this[funcName]) {
            throw new Error(`${ funcName } no define in transform`)
        }
        logTansform(funcName)
        this.history.push(funcName)
        let r = this[funcName](node)
        this.history.pop()
        return r
    }
    visit_ElseExpreesion(node) {
    }
    visit_IfExpreesion(node) {
        let condition = this.visit(node.condition)
        let block = this.visit(node.block)
        if (condition === 'true') {
            return block.list
        } else {
            return []
        }
    }
    visit_SelectorFather(node) {
        return node.text
    }
    visit_SelectorWithFather(node) {
        let l = []
        node.list.forEach(e => {
            l.push(this.visit(e))
        })
        let content = l.join('')
        return SelectorCss(TextCss(content))
    }
    visit_Symbol(node) {
        return node.text
    }
    visit_Property(node) {
        let key = TextCss(this.visit(node.key))
        let value = this.visit(node.value)
        let valueAst
        if (value.type === 'MixinVarReadTran') {
            valueAst = value
        } else {
            valueAst = TextCss(value)
        }
        return PropertyCss(key, valueAst)
    }
    visit_ListExpression(node) {
        let l = node.list.map(e => {
            return this.visit(e)
        })
        return l.join(' ')
    }
    visit_Selector(node) {
        let content = this.visit(node.content)
        return SelectorCss(TextCss(content))
    }
    visit_SelectorChild(node) {
        let l = node.list.map(e => this.visit(e))
        return SelectorChildCss(l)
    }
    visit_PropertyValue(node) {
        return this.visit(node.content)
    }
    visit_Block(node) {
        let l = []
        this.scope.add()
        node.list.forEach(e => {
            let r = this.visit(e)
            if (Array.isArray(r)) {
                l.push(...r)
            } else {
                l.push(r)
            }
        })
        this.scope.pop()
        let result = BlockCss(l)
        return result
    }
    visit_ParamList(node) {
        let r = node.list.map(e => this.visit(e))
        return r
    }
    visit_ParamDeclaration(node) {
        let r = this.visit(node.content)
        return r
    }
    visit_DollarExpression(node) {
        return node.name
    }
    visit_MixinExpression(node) {
        let head = this.visit(node.head)
        let paramsList = this.visit(node.paramList)
        let block = this.visit(node.block)
        this.scopeMixin.last[head] = MixinScopeDeclarationTran(paramsList, block)
    }
    visit_IncludeExpression(node) {
        let block = this.visit(node.content)
        if (!block) {
            throw `visit_IncludeExpression error ${ mixinKey } no define in mixin scope`
        }
        return block.list
    }
    // TODO: 重构优化这个函数，太长了
    visit_SelectorExpression(node) {
        let result = []
        let head = this.visit(node.content)
        let block = this.visit(node.children)
        let listSelectorExpressionCss = []
        let listPropertyCss = []
        block.list.forEach(item => {
            if (!item) {
                return
            }
            if (item.type === 'SelectorExpressionCss') {
                listSelectorExpressionCss.push(item)
            } else if (item.type === 'PropertyCss') {
                listPropertyCss.push(item)
            }
        })
        if (listPropertyCss.length > 0) {
            result.push(SelectorExpressionCss(head, BlockCss(listPropertyCss)))
        }
        if (listSelectorExpressionCss.length > 0) {
            let selectorExpressionCssList = listSelectorExpressionCss.map(e => {
                let isFartherSelector = e.expression.type === 'SelectorCss' && e.expression.content.value.includes('&')
                if (isFartherSelector) {
                    let farther = null
                    if (head.type === 'SelectorChildCss') {
                        farther = head.list[head.list.length - 1].content.value
                    } else if (head.type === 'SelectorCss') {
                        farther = head.content.value
                    } else if (head.type === 'SelectorGroupCss') {
                        farther = '&'
                    } else {
                        throw `visit_SelectorExpression handle farther selector error, head type ${ head.type } is no handle`
                    }
                    e.expression.content.value = e.expression.content.value.replace(/&/g, farther)
                }
                let headCss
                if (head.type === 'SelectorGroupCss') {
                    if (isFartherSelector) {
                        let l = head.list.map(headE => {
                            let expression = Object.assign({}, e.expression)
                            expression.content = Object.assign({}, e.expression.content)
                            expression.content.value = expression.content.value.replace(/&/g, headE.content.value)
                            return expression
                        })
                        headCss = SelectorGroupCss(l)
                    } else {
                        let l = head.list.map(headE => SelectorChildCss([
                            headE,
                            e.expression
                        ]))
                        headCss = SelectorGroupCss(l)
                    }
                } else if (head.type === 'SelectorCss') {
                    if (isFartherSelector) {
                        return e
                    } else {
                        headCss = SelectorChildCss([
                            head,
                            e.expression
                        ])
                    }
                } else if (head.type === 'SelectorChildCss') {
                    if (isFartherSelector) {
                        let l = head.list.filter((e, i) => i !== head.list.length - 1)
                        headCss = SelectorChildCss([
                            ...l,
                            e.expression
                        ])
                    } else {
                        headCss = SelectorChildCss([
                            head,
                            e.expression
                        ])
                    }
                } else {
                    throw 'visit_SelectorExpression no handle'
                }
                return SelectorExpressionCss(headCss, e.block)
            })
            result.push(...selectorExpressionCssList)
        }
        return result
    }
    visit_SelectorGroup(node) {
        let l = node.list.map(e => this.visit(e))
        return SelectorGroupCss(l)
    }
    visit_Assign(node) {
        let var_name = node.key
        this.scope.define(var_name, node.value)
    }
    visit_Var(node) {
        let var_name = node.name
        if (this.history.is_visit_ing('visit_MixinExpression')) {
            return MixinVarReadTran(var_name)
        }
        let val = this.scope.valueFromScope(var_name)
        if (val === undefined) {
            throw new Error(`visit_Var error: ${ var_name } is undefined`)
        } else {
            return val
        }
    }
    visit_CallFunction(node) {
        let name = this.visit(node.funName)
        let paramList = this.visit(node.paramList)
        let mixin = this.scopeMixin.valueFromScope(name)
        if (!mixin) {
            throw `visit_CallFunction error, can not get mixin by name ${ name }`
        }
        this.scope.add()
        paramList.forEach((e, i) => {
            this.scope.define(i, e)
        })
        let b = this.visit(mixin)
        this.scope.pop()
        return b
    }
    visit_MixinScopeDeclarationTran(node) {
        node.paramList.forEach((e, i) => {
            let v = this.scope.valueFromScope(i)
            if (v === undefined) {
                throw `visit_MixinScopeDeclarationTran error, can not read ${ i }`
            } else {
                this.scope.define(e, v)
            }
        })
        return this.visit(node.body)
    }
    visit_BlockCss(node) {
        let l = node.list.map(e => this.visit(e))
        return BlockCss(l)
    }
    visit_PropertyCss(node) {
        return PropertyCss(this.visit(node.key), this.visit(node.value))
    }
    visit_TextCss(node) {
        return node
    }
    visit_MixinVarReadTran(node) {
        let v = this.scope.valueFromScope(node.name)
        return TextCss(v)
    }
    visit_Program(node) {
        let astCss = ProgramCss([])
        for (let child of node.children) {
            let l = this.visit(child)
            if (l) {
                astCss.list.push(...l)
            }
        }
        return astCss
    }
    interpret() {
        let astScss = this.parser.parser()
        logTansform('ast scss:', astScss)
        let astCss = this.visit(astScss)
        logTansform('ast css:', astCss)
        return astCss
    }
}
module.exports = Transform