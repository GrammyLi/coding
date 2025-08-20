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

// 存储变量名和属性名的映射关系
const nameMapper = {};

// 内置对象和方法，不混淆
const BUILTIN_OBJECTS = new Set(['console', 'window', 'document']);
const BUILTIN_METHODS = new Set(['forEach', 'map', 'filter', 'reduce']);

const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomName = () => {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "1234567890";
    let name = choice(letters);
    for (let i = 0; i < 15; i++) {
        name += choice(letters + digits);
    }
    return name;
};

const hx = (key) => {
    if (!nameMapper[key]) {
        nameMapper[key] = generateRandomName();
    }
    return nameMapper[key];
};

const transform = (node) => {
    if (!node) return;

    switch (node.type) {
        case 'Program':
            node.body.forEach(transform);
            break;

        case 'VariableDeclaration':
            node.declarations.forEach(transform);
            break;

        case 'VariableDeclarator':
            if (node.id) transform(node.id);
            if (node.init) transform(node.init);
            break;

        case 'Identifier':
            // 不混淆内置对象（如 console、window）
            if (!BUILTIN_OBJECTS.has(node.name)) {
                node.name = hx(node.name);
            }
            break;

        case 'Property':
            // 处理对象属性名（如 `name: "xx"`）
            if (node.key.type === 'Identifier' || node.key.type === 'Literal') {
                const originalKey = node.key.type === 'Identifier' ? node.key.name : node.key.value;
                // 不混淆内置方法（如 forEach）
                if (!BUILTIN_METHODS.has(originalKey)) {
                    const hashedKey = hx(originalKey);
                    if (node.key.type === 'Identifier') {
                        node.key.name = hashedKey;
                    } else {
                        node.key.value = hashedKey;
                    }
                }
            }
            transform(node.value);
            break;

        case 'MemberExpression':
            // 处理属性访问（如 `o.name` 或 `tips.forEach`）
            transform(node.object);
            if (
                node.property.type === 'Identifier' &&
                !BUILTIN_METHODS.has(node.property.name) && // 不混淆内置方法
                !(node.object.type === 'Identifier' && BUILTIN_OBJECTS.has(node.object.name)) // 不混淆 console.log
            ) {
                const originalKey = node.property.name;
                if (nameMapper[originalKey]) {
                    node.property.name = nameMapper[originalKey];
                }
            }
            break;

        case 'FunctionDeclaration':
        case 'FunctionExpression':
        case 'ArrowFunctionExpression':
            if (node.id) transform(node.id);
            if (node.params) node.params.forEach(transform);
            if (node.body) transform(node.body);
            break;

        case 'CallExpression':
            transform(node.callee);
            if (node.arguments) node.arguments.forEach(transform);
            break;

        default:
            // 递归处理其他节点
            for (const key in node) {
                if (node[key] && typeof node[key] === 'object') {
                    transform(node[key]);
                }
            }
    }
};

transform(ast);

const obfuscatedCode = escodegen.generate(ast);
console.log(obfuscatedCode);