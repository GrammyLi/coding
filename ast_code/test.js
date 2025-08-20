// 箭头函数测试
const add = (a, b) => a + b

// 类声明测试
class Animal {
    constructor(name) {
        this.name = name
    }

    speak() {
        return `${this.name} makes a sound`
    }
}

// let/const 测试
let x = 1
const y = 2

// 模板字符串测试
const greeting = `Hello ${name}!`

// 综合测试
class Calculator {
    constructor() {
        this.value = 0
    }

    add = (x) => {
        this.value += x
        return this
    }

    subtract = (x) => {
        this.value -= x
        return this
    }

    getValue() {
        return this.value
    }
}