const {
    log,
    ensureEqual,
} = require('./utils.js')
const sass2scss = require('./sass2scss.js')

const logTest = (...args) => {
    return log(...args)
}

const test0 = function () {
    logTest('-------------------test0-----------------')
    let text = `.a
    color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    color: red;
}`
    ensureEqual(expect, result, 'test0')
}

const test1 = function () {
    logTest('-------------------test1-----------------')
    let text = `.a
    .b
        color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    .b{
        color: red;
    }
}`
    ensureEqual(expect, result, 'test1')
}

const test2 = function () {
    logTest('-------------------test2-----------------')
    let text = `.a
    display: block
    .b
        color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    display: block;
    .b{
        color: red;
    }
}`
    ensureEqual(expect, result, 'test2')
}

const test3 = function () {
    logTest('-------------------test3-----------------')
    let text = `.a
    .b
        .c
            color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    .b{
        .c{
            color: red;
        }
    }
}`
    ensureEqual(expect, result, 'test3')
}

const test4 = function () {
    logTest('-------------------test4-----------------')
    let text = `$myColor: red
.a
    color: $myColor`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `$myColor: red;
.a{
    color: $myColor;
}`
    ensureEqual(expect, result, 'test4')
}

const test5 = function () {
    logTest('-------------------test5-----------------')
    let text = `.a
    $myColor: red
    color: $myColor`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    $myColor: red;
    color: $myColor;
}`
    ensureEqual(expect, result, 'test5')
}

const test6 = function () {
    logTest('-------------------test6-----------------')
    let text = `$myColor: red
.a
    $myColor: blue
    color: $myColor`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `$myColor: red;
.a{
    $myColor: blue;
    color: $myColor;
}`
    ensureEqual(expect, result, 'test6')
}

const test7 = function () {
    logTest('-------------------test7-----------------')
    let text = `.a .b
    color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a .b{
    color: red;
}`
    ensureEqual(expect, result, 'test7')
}

const test8 = function () {
    logTest('-------------------test8-----------------')
    let text = `.a, .b
    color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a, .b{
    color: red;
}`
    ensureEqual(expect, result, 'test8')
}

const test9 = function () {
    logTest('-------------------test9-----------------')
    let text = `.a .b
    .c
        color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a .b{
    .c{
        color: red;
    }
}`
    ensureEqual(expect, result, 'test9')
}

const test10 = function () {
    logTest('-------------------test10-----------------')
    let text = `.a, .b
    .c
        color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a, .b{
    .c{
        color: red;
    }
}`
    ensureEqual(expect, result, 'test10')
}

const test11 = function () {
    logTest('-------------------test11-----------------')
    let text = `.a
    .b
        color: blue
    .c
        color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    .b{
        color: blue;
    }
    .c{
        color: red;
    }
}`
    ensureEqual(expect, result, 'test11')
}

const test12 = function () {
    logTest('-------------------test12-----------------')
    let text = `.a
    width: 1px`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    width: 1px;
}`
    ensureEqual(expect, result, 'test12')
}

// 测试属性带空格
const test13 = function () {
    logTest('-------------------test13-----------------')
    let text = `.a
    border: 1px soild`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    border: 1px soild;
}`
    ensureEqual(expect, result, 'test13')
}


const test14 = function () {
    logTest('-------------------test14-----------------')
    let text = `.a
    border: 1px soild red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    border: 1px soild red;
}`
    ensureEqual(expect, result, 'test14')
}

const test15 = function () {
    logTest('-------------------test15-----------------')
    let text = `$myColor: red
.a
    border: 1px soild $myColor`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `$myColor: red;
.a{
    border: 1px soild $myColor;
}`
    ensureEqual(expect, result, 'test15')
}

const test16 = function () {
    logTest('-------------------test16-----------------')
    let text = `.a
    .b
        .c
            color: blue
        .d
            color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    .b{
        .c{
            color: blue;
        }
        .d{
            color: red;
        }
    }
}`
    ensureEqual(expect, result, 'test16')
}

const test17 = function () {
    logTest('-------------------test17-----------------')
    let text = `.a
    .b
        .c
            color: blue
        .d
            color: red
        .e
            color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    .b{
        .c{
            color: blue;
        }
        .d{
            color: red;
        }
        .e{
            color: red;
        }
    }
}`
    ensureEqual(expect, result, 'test17')
}

const test18 = function () {
    logTest('-------------------test18-----------------')
    let text = `@mixin m
    color: red
.a
    @include m`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `@mixin m{
    color: red;
}
.a{
    @include m;
}`
    ensureEqual(expect, result, 'test18')
}

const test19 = function () {
    logTest('-------------------test19-----------------')
    let text = `@mixin m ($c)
    color: $c
.a
    @include m(red)`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `@mixin m ($c){
    color: $c;
}
.a{
    @include m(red);
}`
    ensureEqual(expect, result, 'test19')
}

const test20 = function () {
    logTest('-------------------test20-----------------')
    let text = `.a
    display: block
    color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    display: block;
    color: red;
}`
    ensureEqual(expect, result, 'test20')
}

const test21 = function () {
    logTest('-------------------test21-----------------')
    let text = `@mixin m ($a, $b)
    display: $a
    color: $b
.a
    @include m(block, red)`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `@mixin m ($a, $b){
    display: $a;
    color: $b;
}
.a{
    @include m(block, red);
}`
    ensureEqual(expect, result, 'test21')
}

const test22 = function () {
    logTest('-------------------test22-----------------')
    let text = `@mixin m ($a, $b, $c)
    display: $a
    color: $b
    resize: $c
.a
    @include m(block, red, none)`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `@mixin m ($a, $b, $c){
    display: $a;
    color: $b;
    resize: $c;
}
.a{
    @include m(block, red, none);
}`
    ensureEqual(expect, result, 'test22')
}

const test23 = function () {
    logTest('-------------------test23-----------------')
    let text = `.a
    display: inline-block`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    display: inline-block;
}`
    ensureEqual(expect, result, 'test23')
}

const test24 = function () {
    logTest('-------------------test24-----------------')
    let text = `.a
    z-index: 1`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    z-index: 1;
}`
    ensureEqual(expect, result, 'test24')
}

const test25 = function () {
    logTest('-------------------test25-----------------')
    let text = `.a-b
    color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a-b{
    color: red;
}`
    ensureEqual(expect, result, 'test25')
}

const test26 = function () {
    logTest('-------------------test26-----------------')
    let text = `.a
    width: -1px`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    width: -1px;
}`
    ensureEqual(expect, result, 'test26')
}

const test27 = function () {
    logTest('-------------------test27-----------------')
    let text = `.a
    width: 36px`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    width: 36px;
}`
    ensureEqual(expect, result, 'test27')
}

const test28 = function () {
    logTest('-------------------test28-----------------')
    let text = `.a
    width: -36px`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    width: -36px;
}`
    ensureEqual(expect, result, 'test28')
}

const test29 = function () {
    logTest('-------------------test29-----------------')
    let text = `.a
    &-b
        color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    &-b{
        color: red;
    }
}`
    ensureEqual(expect, result, 'test29')
}

const test30 = function () {
    logTest('-------------------test30-----------------')
    let text = `.a
    .b
        &-c
            color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    .b{
        &-c{
            color: red;
        }
    }
}`
    ensureEqual(expect, result, 'test30')
}

const test31 = function () {
    logTest('-------------------test31-----------------')
    let text = `.a .b
    &-c
        color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a .b{
    &-c{
        color: red;
    }
}`
    ensureEqual(expect, result, 'test31')
}

const test32 = function () {
    logTest('-------------------test32-----------------')
    let text = `.a, .b
    &-c
        color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a, .b{
    &-c{
        color: red;
    }
}`
    ensureEqual(expect, result, 'test32')
}

const test33 = function () {
    logTest('-------------------test33-----------------')
    let text = `.a
    &-b
        &-c
            color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    &-b{
        &-c{
            color: red;
        }
    }
}`
    ensureEqual(expect, result, 'test33')
}

const test34 = function () {
    logTest('-------------------test34-----------------')
    let text = `.a, .b, .c
    color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a, .b, .c{
    color: red;
}`
    ensureEqual(expect, result, 'test34')
}

const test35 = function () {
    logTest('-------------------test35-----------------')
    let text = `.a .b .c
    color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a .b .c{
    color: red;
}`
    ensureEqual(expect, result, 'test35')
}

const test36 = function () {
    logTest('-------------------test36-----------------')
    let text = `.a .b .c
    &-d
        color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a .b .c{
    &-d{
        color: red;
    }
}`
    ensureEqual(expect, result, 'test36')
}

const test37 = function () {
    logTest('-------------------test37-----------------')
    let text = `.a, .b, .c
    &-d
        color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a, .b, .c{
    &-d{
        color: red;
    }
}`
    ensureEqual(expect, result, 'test37')
}

const test38 = function () {
    logTest('-------------------test38-----------------')
    let text = `.a
    color: red
.b
    color: blue`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    color: red;
}
.b{
    color: blue;
}`
    ensureEqual(expect, result, 'test38')
}

const test39 = function () {
    logTest('-------------------test39-----------------')
    let text = `.a
    color: red
.b
    color: blue
.c
    color: green`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    color: red;
}
.b{
    color: blue;
}
.c{
    color: green;
}`
    ensureEqual(expect, result, 'test39')
}

const test40 = function () {
    logTest('-------------------test40-----------------')
    let text = `.a
    .b
        color: blue
        .c
            color: green
    color: red`
    logTest('input:\n', text)
    let result = sass2scss(text)
    logTest('result:\n', result)
    let expect = `.a{
    .b{
        color: blue;
        .c{
            color: green;
        }
    }    color: red;
}`
    ensureEqual(expect, result, 'test40')
}


const test = function () {
    test0()
    test1()
    test2()
    test3()
    test4()
    test5()
    test6()
    test7()
    test8()
    test9()
    test10()
    test11()
    test12()
    test13()
    test14()
    test15()
    test16()
    test17()
    test18()
    test19()
    test20()
    test21()
    test22()
    test23()
    test24()
    test25()
    test26()
    test27()
    test28()
    test29()
    test30()
    test31()
    test32()
    test33()
    test34()
    test35()
    test36()
    test37()
    test38()
    test39()
    test40()
}

const __main = function () {
    test()
}

__main()