
const SelectorExpressionCss = function (expression, block) {
    return {
        type: 'SelectorExpressionCss',
        expression: expression,
        block: block
    }
}
const SelectorCss = function (content) {
    return {
        type: 'SelectorCss',
        content: content
    }
}
const BlockCss = function (list) {
    return {
        type: 'BlockCss',
        list: list
    }
}
const PropertyCss = function (key, value) {
    return {
        type: 'PropertyCss',
        key: key,
        value: value
    }
}
const TextCss = function (value) {
    return {
        type: 'TextCss',
        value: value
    }
}
const ProgramCss = function (list) {
    return {
        type: 'ProgramCss',
        list: list
    }
}
const SelectorChildCss = function (list) {
    return {
        type: 'SelectorChildCss',
        list: list
    }
}
const SelectorGroupCss = function (list) {
    return {
        type: 'SelectorGroupCss',
        list: list
    }
}
module.exports = {
    SelectorExpressionCss,
    SelectorCss,
    BlockCss,
    PropertyCss,
    TextCss,
    ProgramCss,
    SelectorChildCss,
    SelectorGroupCss
}