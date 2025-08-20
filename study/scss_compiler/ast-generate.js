
class SelectorGroup {
    constructor(list) {
        this.type = 'SelectorGroup'
        this.list = list
    }
}
class Block {
    constructor(list) {
        this.type = 'Block'
        this.list = list
    }
}
class SelectorChild {
    constructor(list) {
        this.type = 'SelectorChild'
        this.list = list
    }
}
class Selector {
    constructor(content) {
        this.type = 'Selector'
        this.content = content
    }
}
class SelectorExpression {
    constructor(content, children) {
        this.type = 'SelectorExpression'
        this.content = content
        this.children = children
    }
}
class SelectorWithFather {
    constructor(list) {
        this.type = 'SelectorWithFather'
        this.list = list
    }
}
class SelectorFather {
    constructor() {
        this.type = 'SelectorFather'
        this.text = '&'
    }
}
class Symbol {
    constructor(text) {
        this.type = 'Symbol'
        this.text = text
    }
}
class Property {
    constructor(key, value) {
        this.type = 'Property'
        this.key = key
        this.value = value
    }
}
class BinOp {
    constructor(left, op, right) {
        this.left = left
        this.token = op
        this.op = op
        this.right = right
    }
}
class Num {
    constructor(token) {
        this.token = token
        this.value = token.value
    }
}
class UnaryOp {
    constructor(op, expr) {
        this.token = op
        this.op = op
        this.expr = expr
    }
}
class Program {
    constructor() {
        this.type = 'Program'
        this.children = []
    }
}
class Assign {
    constructor(key, value) {
        this.type = 'Assign'
        this.key = key
        this.value = value
    }
}
class Var {
    constructor(name) {
        this.type = 'Var'
        this.name = name
    }
}
class NoOp {
    constructor() {
    }
}
class ListExpression {
    constructor(list) {
        this.type = 'ListExpression'
        this.list = list
    }
}
class PropertyValue {
    constructor(content) {
        this.type = 'PropertyValue'
        this.content = content
    }
}
class MixinExpression {
    constructor(head, paramList, block) {
        this.type = 'MixinExpression'
        this.head = head
        this.paramList = paramList
        this.block = block
    }
}
class IncludeExpression {
    constructor(content) {
        this.type = 'IncludeExpression'
        this.content = content
    }
}
class IfExpreesion {
    constructor(condition, block, elseIfList = [], eles = null) {
        this.type = 'IfExpreesion'
        this.condition = condition
        this.block = block
        this.elseIfList = elseIfList
        this.eles = eles
    }
}
class ElseExpreesion {
    constructor(block) {
        this.type = 'ElseExpreesion'
        this.block = block
    }
}
class ParamList {
    constructor(list) {
        this.type = 'ParamList'
        this.list = list
    }
}
class CallFunction {
    constructor(funName, paramList) {
        this.type = 'CallFunction'
        this.funName = funName
        this.paramList = paramList
    }
}
class ParamDeclaration {
    constructor(content) {
        this.type = 'ParamDeclaration'
        this.content = content
    }
}
class DollarExpression {
    constructor(name) {
        this.type = 'DollarExpression'
        this.name = name
    }
}
class UseExpression {
    constructor(path) {
        this.type = 'UseExpression'
        this.path = path
    }
}
class StringStatement {
    constructor(content) {
        this.type = 'StringStatement'
        this.content = content
    }
}
class PointExpression {
    constructor(left, right) {
        this.type = 'PointExpression'
        this.left = left
        this.right = right
    }
}
module.exports = {
    BinOp,
    Num,
    UnaryOp,
    Program,
    Assign,
    NoOp,
    SelectorExpression,
    Property,
    Var,
    Symbol,
    SelectorGroup,
    SelectorChild,
    Selector,
    Block,
    ListExpression,
    PropertyValue,
    MixinExpression,
    IncludeExpression,
    ParamList,
    CallFunction,
    ParamDeclaration,
    DollarExpression,
    SelectorWithFather,
    SelectorFather,
    IfExpreesion,
    UseExpression,
    StringStatement,
    PointExpression,
    ElseExpreesion
}