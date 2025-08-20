
class Token {
    constructor(type, value) {
        this.type = type
        this.value = value
    }
    toString() {
        return `Token(${ this.type }, ${ this.value })`
    }
    __repr__() {
        return this.toString()
    }
}
module.exports = Token