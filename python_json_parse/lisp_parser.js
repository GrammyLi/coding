/**
 * 2 个函数
 * 分别用递归和栈的方式从 token 列表解析为 ast
 */

function parsedAst(tokenList) {
    /**
     * 递归解析 ast
     */
    const ts = tokenList;
    const token = ts[0];
    ts.shift();
    
    if (token === '[') {
        const exp = [];
        while (ts[0] !== ']') {
            const t = parsedAst(ts);
            exp.push(t);
        }
        // 循环结束, 删除末尾的 ']'
        ts.shift();
        return exp;
    } else {
        // token 需要 process_token / parsed_token
        return token;
    }
}

function popList(stack) {
    const l = [];
    while (stack[stack.length - 1] !== '[') {
        l.push(stack.pop());
    }
    stack.pop();
    l.reverse();
    return l;
}

function parsedAstStack(tokenList) {
    /**
     * 用栈解析 ast
     */
    const l = [];
    let i = 0;
    while (i < tokenList.length) {
        const token = tokenList[i];
        i++;
        if (token === ']') {
            const listToken = popList(l);
            l.push(listToken);
        } else {
            l.push(token);
        }
    }
    return l;
}

function main() {
    const tokens1 = ['[', '+', 12, '[', '-', 23, 45, ']', ']'];
    const tokens2 = ['[', '+', 12, '[', '-', 23, 45, ']', ']'];
    console.log('stack parse', parsedAstStack([...tokens1, ...tokens2]));

    const tokens = ['[', '+', 12, '[', '-', 23, 45, ']', ']'];
    const expectedAst = ['+', 12, ['-', 23, 45]];
    const ast = parsedAst([...tokens]);
    console.log('recursive parse', ast);
    console.assert(JSON.stringify(ast) === JSON.stringify(expectedAst), 'AST does not match expected output');
}

main()
// Node.js 环境下运行
// if (require.main === module) {
//     main();
// }

// // 导出函数供其他模块使用
// module.exports = {
//     parsedAst,
//     parsedAstStack,
//     popList
// };