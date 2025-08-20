
const {exec} = require('child_process')
const fs = require('fs')
const isArray = function (o) {
    return Array.isArray(o)
}
const isObject = function (o) {
    return Object.prototype.toString.call(o) === '[object Object]'
}
const isSpace = function (char) {
    return ' \t\n\x0B\f\r'.includes(char)
}
const log = (...args) => {
    let t = ''
    for (let i = 0; i < args.length; i++) {
        let e = args[i]
        if (isObject(e) || isArray(e)) {
            let s = JSON.stringify(e, null, 2)
            t += s
        } else {
            t += e
        }
    }
    console.log(t)
}
const ensureEqual = function (expect, result, message) {
    if (JSON.stringify(expect) != JSON.stringify(result)) {
        throw `${ message } fail:\nexpect:\n${ expect }\nresult:\n${ result }`
    } else {
        log(message + ' ok')
    }
}
const isNumber = function (text) {
    return '0123456789'.includes(text)
}
const isChar = function (char) {
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(char)
}
const isNumberOrChar = function (char) {
    return isNumber(char) || isChar(char)
}
const runCommand = function (command) {
    let p = new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(stderr)
            } else {
                resolve(stdout)
            }
        })
    })
    return p
}
const strEscape = function (s) {
    if (s === undefined) {
        return 'undefined'
    }
    return s.replace(/\n/g, '换行').replace(/ /g, '空格')
}
const readFile = function (path) {
    return fs.readFileSync(path, 'utf8')
}
module.exports = {
    log,
    ensureEqual,
    isNumber,
    isChar,
    runCommand,
    isNumberOrChar,
    isSpace,
    strEscape,
    readFile
}