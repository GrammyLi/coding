
const fs = require('fs')
const {log, runCommand} = require('./utils.js')
const runTest = function () {
    return runCommand('node test.js').then(stdout => {
        log('stdout:', stdout)
    })
}
let count = 0
const __main = function () {
    fs.watch(`./`, () => {
        count++
        log(`----------------------------run test start ${ count }---------------------------`)
        runTest().then(() => {
            log(`----------------------------run test end ${ count }---------------------------`)
        })
    })
}
__main()