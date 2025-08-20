 包含了各种 ES6 特性的测试用例：
   - 箭头函数
   - 类声明和方法
   - let/const 变量声明
   - 模板字符串
   - 类中的箭头函数方法

转换器的工作流程：
1. 使用 espree 解析器将 ES6 代码解析成 AST
2. 递归遍历 AST，对特定节点类型进行转换：
   - ArrowFunctionExpression => FunctionExpression
   - ClassDeclaration => FunctionDeclaration + 原型方法
   - VariableDeclaration(let/const) => VariableDeclaration(var)
   - TemplateLiteral => BinaryExpression(字符串拼接)
3. 返回转换后的 AST

你可以通过运行 es6_to_es5.js 来测试转换效果，它会读取 test.js 文件并输出转换后的 AST。
        