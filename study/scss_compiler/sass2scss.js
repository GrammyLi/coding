
const {log} = require('./utils')
class SassToScss {
    constructor(text) {
        this.text = text
        if (!this.text.endsWith('\n')) {
            this.text += '\n'
        }
        this.pos = 0
        this.tabSize = 4
        this.curTabCount = 0
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
    getWrapNextSpaceCount() {
        let pos = this.pos
        let spaceCount = 0
        while (1) {
            pos++
            let value = this.text[pos]
            if (value === ' ') {
                spaceCount++
            } else {
                break
            }
        }
        return spaceCount
    }
    getWrapNextTadCount() {
        let c = this.getWrapNextSpaceCount() / this.tabSize
        return c
    }
    getSpacesByTabCount(count) {
        let s = ''
        for (let i = 0; i < count; i++) {
            s += '    '
        }
        return s
    }
    toScss() {
        let result = ''
        while (this.current_char !== null) {
            if (this.current_char === '\n') {
                let count = this.getWrapNextTadCount()
                if (count > this.curTabCount) {
                    result += '{\n'
                } else if (count < this.curTabCount) {
                    result += ';'
                    let diff = this.curTabCount - count
                    for (let tabLen = 1; tabLen <= diff; tabLen++) {
                        result += `\n${ this.getSpacesByTabCount(this.curTabCount - tabLen) }}`
                    }
                    if (diff === 1) {
                        result += '\n'
                    }
                } else {
                    result += ';\n'
                }
                this.curTabCount = count
                this.advance()
            } else {
                result += this.current_char
                this.advance()
            }
        }
        if (result.endsWith('\n')) {
            result = result.substring(0, result.length - 1)
        }
        return result
    }
}
const sassToScss = function (text) {
    return new SassToScss(text).toScss()
}
module.exports = sassToScss