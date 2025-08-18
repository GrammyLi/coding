const espree = require('espree');
const escodegen = require('escodegen');

let code = `
let tips = [
    "hello",
    "world",
]
function fn2() {
    tips.forEach((tip, i) => {
        console.log(tip + i, o.name)
    })
}

let o = {
    name: "xx"
}
console.log(o.name)    
`;

let ast = espree.parse(code, { ecmaVersion: "latest" });



// 用户混淆的变量
let mapper = {}
let mapperType = {}

const choice = function (arr) {
    let a = Math.random();
    a = a * arr.length;
    return arr[Math.floor(a)]
}
const transformVariableDeclarator = function (node) {
    let init = node.init;
    let id = node.id
    if (init.type === "ArrayExpression") {
        mapperType[id.name] = {
            type: "array",
        }
    } else if (init.type === "ObjectExpression") {
        mapperType[id.name] = {
            type: "object",
        }
    } else {
        // TODO, 其他情况， 函数等
    }
    transform(node.id)
}

const builtInMember = [
    "console",
    "window",
    "document",
]

// xx.yy
// xx.yy.zz
// const transformMember = function (node) {
//     let object = node.object;
//     console.log("object", object)
//     let property = node.property;
//     console.log("property", property)

//     // 1. xx 不能转
//     // console.xxx
//     // window.xxx
//     // 2. yy 不能转  list.map
//     if (builtInMember.includes(object.name)) {
//         return;
//     }
//     transform(node.object);


//     // object.name 是拿到混淆之后的name
//     let key = object.rawName
//     if (mapperType[key] && mapperType[key].type === "array") {
//         if (property.name === "forEach") {
//             return;
//         }
//     }

//     // a.b.c
//     transform(node.property);
// }

const transformMember = function (node) {
    let object = node.object;
    let property = node.property;

    // 1. xx 不能转
    // console.xxx
    // window.xxx
    if (builtInMember.includes(object.name)) {
        return;
    }
    transform(node.object);

    // object.name 是拿到混淆之后的name
    let key = object.rawName
    if (mapperType[key] && mapperType[key].type === "array") {
        // 2. yy 不能转  list.forEach/map etc.
        if (["forEach", "map", "filter", "reduce"].includes(property.name)) {
            return;
        }
    }

    // Always transform property names unless they're special cases above
    transform(node.property);
}

const hx = function (key) {
    let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let digits = "1234567890"
    let s = choice(letters)
    for (let i = 0; i < 15; i++) {
        s += choice(letters + digits)
    }
    // 如果是内置方法不能混淆
    if (mapper[key] === undefined) {
        mapper[key] = s;
        return s
    } else {
        return mapper[key];
    }
}

const transform = function (node) {
    let type = node.type
    console.log("type", type)
    if (type === 'Program') {
        // 程序最外层 ast
        for (let b of node.body) {
            transform(b);
        }
    } else if (type === "VariableDeclaration") {
        // let a = 1, b = 2;
        for (let b of node.declarations) {
            transform(b);
        }
    } else if (type === "VariableDeclarator") {
        transformVariableDeclarator(node)
    } else if (type === "Identifier") {
        let name = node.name;
        // if (mapper[name]) {
        //     node.name = mapper[name];
        // } else {
        //     // 没有被映射过
        //     mapper[name] = 'x_' + name;
        //     node.name = mapper[name];
        // }
        node.name = hx(name)
        node.rawName = name
    } else if (type === "ExpressionStatement") {
        transform(node.expression);
    } else if (type === "CallExpression") {
        transform(node.callee) // 函数名称
        // 参数
        for (let arg of node.arguments) {
            transform(arg);
        }
    } else if (type === "FunctionExpression") {
        transform(node.id) // 函数名
        for (let p of node.params) {
            transform(p)
        }
        transform(node.body); // 函数 body
    } else if (type === "BlockStatement") {
        for (let b of node.body) {
            transform(b)
        }
    } else if (type === "MemberExpression") {
        transformMember(node)
    } else if (type === "ArrowFunctionExpression") {
        for (let p of node.params) {
            transform(p)
        }
        transform(node.body);
    } else if (type === "BinaryExpression") {
        transform(node.left)
        transform(node.right)
    } else if (type === "ObjectExpression") {
        for (let p of node.properties) {
            transform(p)
        }
    } else if (type === "Property") {
        // 修改这里：确保属性名也被混淆
        if (node.key.type === "Identifier") {
            transform(node.key);
        }
        transform(node.value)
        // let key = node.key
        // let value = node.value
        // transform(key)
        // transform(value)
    } else if (type === "FunctionDeclaration") {
        transform(node.id) // 函数名
        for (let p of node.params) {
            transform(p)
        }
        transform(node.body); // 函数 body
    } else if (type === "Literal") {
    }
}

transform(ast)

let s = escodegen.generate(ast, {});
console.log(`<${s}>`);