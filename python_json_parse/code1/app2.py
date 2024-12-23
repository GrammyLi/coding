def log(*args):
    print(*args)


def json_tokens(json_string):
    """
    JSON 格式中我们目前只关注以下 8 种基本元素
    {
    }
    字符串（字符串中不包含特殊符号，不用支持转义符）
    :
    ,
    整数
    [
    ]
   json_string 是只包含以上元素的 JSON 格式字符串（也包括空白符号）
    返回 token 的列表
    例如对于以下字符串
    {
        "name": "grammyli",
        "height": 169
    }
    将返回以下数据
    ["{", "name", ":", "grammyli", ",", "height", ":", "169", "}"]

   提示：
    用循环去读取字符串
    用下标来标注当前读取的位置
    根据不同的情况来读取不同的数据并存储
    """
    results = []
    keywords = '{}:,[]'
    ints = '1234567890'
    length = len(json_string)

    # for i in range(length):
    i = 0
    while i < length:
        # 是标点
        if json_string[i] in keywords:
            results.append(json_string[i])
            i += 1
        # 是空格
        elif json_string[i] == ' ':
            i += 1
        # 是字符串
        elif json_string[i] == '"':
            s = json_string[i:]
            end = s.find('"', 1)
            word = s[1:end]
            results.append(word)
            i += end + 1
        # 是整数
        elif json_string[i] in ints:
            new_string = json_string[i:]
            count = 0
            while count < len(new_string) and new_string[count] in ints:
                count += 1
            num = new_string[:count]
            results.append(num)
            i = i + count
    return results


def test_json_tokens():
    string1 = '{"name": "grammyli","height": 169}'
    num1 = ["{", "name", ":", "grammyli", ",", "height", ":", "169", "}"]
    # log(num1)
    # log(json_tokens(string1))
    ensure(json_tokens(string1) == num1, 'testJsonTokens1')

    string2 = '[{"student": 1}, {"student": 2}]'
    num2 = ["[", "{", "student", ":", "1", "}",
            ",", "{", "student", ":", "2", "}", "]"]
    ensure(json_tokens(string2) == num2, 'testJsonTokens2')

    string3 = '{}'
    num3 = ["{", "}"]
    ensure(json_tokens(string3) == num3, 'testJsonTokens3')


def ensure(condition, message):
    if not condition:
        log('*** 测试失败:', message)


def main():
    log('*** 测试失败:')
    test_json_tokens()


if __name__ == '__main__':
    main()
