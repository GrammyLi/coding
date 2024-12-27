/**
 * 检查给定的字符是否是数字字符。
 *
 * @param {string} char - 要检查的字符。
 * @returns {boolean} - 如果字符是数字字符，则返回 true；否则返回 false。
 */
const isDigit = (char) => {
  // 定义包含数字字符的字符串
  const digits = "0123456789";

  // 使用字符串的 includes 方法检查给定字符是否在数字字符字符串中
  return digits.includes(char);
};

/**
 * 解析字符串的结束，并处理转义字符。
 *
 * @param {string} s - 要解析的字符串。
 * @param {number} index - 开始解析的索引。
 * @param {string} quote - 字符串的引号类型（单引号或双引号）。
 * @returns {Array} - 返回一个数组，第一个元素为解析出的字符串，第二个元素为解析的字符数。
 * @throws {Error} - 如果字符串没有正确结束，抛出错误。
 */
const quoteStringEnd = function (s, index, quote) {
  let result = ""; // 存储最终的字符串内容
  let length = 0; // 记录解析的字符数
  let escape = {
    b: "\b", // 后退
    f: "\f", // 换页符
    n: "\n", // 换行符
    r: "\r", // 回车符
    v: "\v", // 垂直制表符
    t: "\t", // 制表符
    "'": "'", // 单引号
    '"': '"', // 双引号
    "\\": "\\", // 反斜杠
    "/": "/", // 正斜杠
  };

  // 遍历字符串中的每个字符
  for (let i = index; i < s.length; i++) {
    let c = s[i]; // 当前字符

    if (c === "\\") {
      // 如果是反斜杠，则可能是转义字符
      let next = s[i + 1]; // 获取下一个字符
      if (escape.hasOwnProperty(next)) {
        // 如果是有效的转义字符，则将其替换
        result += escape[next];
        i += 1; // 跳过下一个字符
        length += 2; // 累加已解析字符数
      } else {
        result += c; // 如果不是转义字符，保留反斜杠
        length += 1;
      }
    } else if (c === quote) {
      // 如果遇到结束引号，则返回当前字符串
      return [result, length];
    } else {
      result += c; // 否则，直接将字符添加到结果中
      length += 1;
    }
  }

  // 如果没有遇到结束引号，抛出错误
  throw new Error("字符串字面量未结束");
};

/**
 * 解析并提取数字字符串的结束位置。
 *
 * @param {string} s - 要解析的字符串。
 * @param {number} begin - 解析开始的索引。
 * @returns {Array} - 返回一个数组，第一个元素为解析出的数字字符串，第二个元素为解析的字符数。
 */
const numberEnd = (s, begin) => {
  let digit = "-.0123456789xbABCDEF";
  let result = "";
  let index = 0;

  // 遍历字符，直到遇到非数字字符
  for (let i = begin; i < s.length; i++) {
    let c = s[i];
    if (!digit.includes(c)) {
      return [result, index];
    }
    result += c;
    index += 1;
  }
  return [result, index];
};

/**
 * 解析并提取变量名或关键字字符串的结束位置。
 *
 * @param {string} s - 要解析的字符串。
 * @param {number} begin - 解析开始的索引。
 * @returns {Array} - 返回一个数组，第一个元素为解析出的变量名或关键字字符串，第二个元素为解析的字符数。
 */
const stringEnd = (s, begin) => {
  let letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  let index = 0;

  // 遍历字符，直到遇到非字母数字字符
  for (let i = begin; i < s.length; i++) {
    let c = s[i];
    if (!letter.includes(c)) {
      return [result, index];
    }
    result += c;
    index += 1;
  }
  return [result, index];
};

/**
 * 解析关键字（如 true, false, null）或变量名。
 *
 * @param {string} s - 要解析的字符串。
 * @param {number} begin - 解析开始的索引。
 * @returns {Array} - 返回一个数组，第一个元素为解析出的关键字或变量名，第二个元素为解析的字符数。
 */
const keywordEnd = (s, begin) => {
  let t = "true";
  let f = "false";
  let n = "null";
  let v = "var";
  let c = "const";

  // 处理 true, false, null, var, const 等关键字
  if (s.slice(begin, begin + t.length) === t) {
    return [true, t.length];
  } else if (s.slice(begin, begin + f.length) === f) {
    return [false, f.length];
  } else if (s.slice(begin, begin + n.length) === n) {
    return [null, n.length];
  } else if (s.slice(begin, begin + v.length) === v) {
    let [vn, length] = stringEnd(s, begin + v.length + 1);
    return [[v, vn], v.length + length + 1];
  } else if (s.slice(begin, begin + c.length) === c) {
    let [vn, length] = stringEnd(s, begin + c.length + 1);
    return [[c, vn], c.length + length + 1];
  } else {
    let [k, length] = stringEnd(s, begin);
    return [k, length];
  }
};

/**
 * 解析逻辑运算符（如 =, <, >, !=, +, -, *, /, %）的结束位置。
 *
 * @param {string} s - 要解析的字符串。
 * @param {number} begin - 解析开始的索引。
 * @returns {Array} - 返回一个数组，第一个元素为解析出的符号字符串，第二个元素为解析的字符数。
 */
const logicSymbolEnd = (s, begin) => {
  let symbol = "=><!+-/*%";
  let result = "";
  let index = 0;

  // 遍历字符，直到遇到非符号字符
  for (let i = begin; i < s.length; i++) {
    let c = s[i];
    if (!symbol.includes(c)) {
      return [result, index];
    }
    result += c;
    index += 1;
  }
  return [result, index];
};

/**
 * 将输入字符串转换为 tokens（标记）。
 *
 * @param {string} s - 要转换的字符串。
 * @returns {Array} - 返回一个包含所有标记的数组。
 */
const toTokens = (s) => {
  let a = s.split("\n"); // 按行分割
  a = a.filter((item) => item.trim()); // 去掉空行
  s = a.join("\n"); // 重新组合字符串

  console.log("s", s); // 调试输出

  let letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let symbol = "=><!+/*%";

  let tokens = []; // 存储 token 的数组
  let index = 0; // 当前字符的索引

  // 遍历整个字符串
  while (index < s.length) {
    let c = s[index];

    if (c === " ") {
      index += 1; // 跳过空格
    } else if (c === "\n") {
      tokens.push(";"); // 行结束时添加分号
      index += 1;
    } else if (c === "-" || c === "+" || c === "*" || c === "/" || c === "%") {
      // 处理负号和符号
      let next = s[index + 1];
      if (isDigit(next)) {
        // 如果下一个字符是数字，处理为数字（可能是负数或带符号的数字）
        let [num, length] = numberEnd(s, index);
        num = Number(num);
        tokens.push(num);
        index += length;
      } else {
        // 否则，处理为逻辑符号
        let [sym, length] = logicSymbolEnd(s, index);
        tokens.push(sym);
        index += length;
      }
    } else if (isDigit(c)) {
      // 处理数字
      let [num, length] = numberEnd(s, index);
      num = Number(num);
      tokens.push(num);
      index += length;
    } else if (c === '"' || c === "'") {
      // 处理字符串
      let [str, length] = quoteStringEnd(s, index + 1, c);
      tokens.push(str);
      index += length + 2; // 跳过引号
    } else if (letter.includes(c)) {
      // 处理关键字或变量
      let [keyword, length] = keywordEnd(s, index);
      if (Array.isArray(keyword)) {
        tokens = tokens.concat(keyword);
      } else {
        tokens.push(keyword);
      }
      index += length;
    } else if (symbol.includes(c)) {
      // 处理符号
      let [sym, length] = logicSymbolEnd(s, index);
      tokens.push(sym);
      index += length;
    } else {
      tokens.push(c); // 其他字符
      index += 1;
    }
  }

  tokens.push(";"); // 添加结尾的分号
  console.log("tokens", tokens); // 输出 token 列表
  return tokens;
};
