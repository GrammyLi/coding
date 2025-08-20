const espree = require('espree');
const escodegen = require('escodegen');

let code = `
let a = {
    name: 1
}
console.log(a.name)
`;

let ast = espree.parse(code, { ecmaVersion: "latest" });

// 变量名映射表
let mapper = {};

// 生成随机变量名
const generateName = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    let result = letters[Math.floor(Math.random() * letters.length)];
    for (let i = 0; i < 5; i++) {
        const chars = letters + digits;
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
};

// 转换 AST 节点
const transform = (node) => {
    if (!node) return;

    switch (node.type) {
        case 'Program':
            // 程序入口，例如：
            // let a = 1;
            // console.log(a);
            node.body.forEach(transform);
            break;

        case 'VariableDeclaration':
            // 变量声明，例如：
            // let a = 1, b = 2;
            node.declarations.forEach(transform);
            break;

        case 'VariableDeclarator':
            // 单个变量声明，例如：
            // a = 1
            transform(node.id);
            transform(node.init);
            break;

        case 'Identifier':
            // 标识符，例如：
            // a, name, console
            if (node.name === 'console') return;
            if (!mapper[node.name]) {
                mapper[node.name] = generateName();
            }
            node.name = mapper[node.name];
            break;

        case 'ObjectExpression':
            // 对象表达式，例如：
            // { name: 1, age: 2 }
            node.properties.forEach(transform);
            break;

        case 'Property':
            // 对象的属性，例如：
            // { name: 1 } 中的 name: 1
            transform(node.key);
            transform(node.value);
            break;

        case 'MemberExpression':
            // 成员表达式，例如：
            // a.name, console.log
            transform(node.object);
            if (node.object.name !== 'console') {
                transform(node.property);
            }
            break;

        case 'ExpressionStatement':
            // 表达式语句，例如：
            // console.log(a);
            transform(node.expression);
            break;

        case 'CallExpression':
            // 函数调用，例如：
            // console.log(a)
            transform(node.callee);
            node.arguments.forEach(transform);
            break;
    }
};

transform(ast);
let result = escodegen.generate(ast);
console.log('混淆后的代码：');
console.log(result);