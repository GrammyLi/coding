def log(*args):
    print(*args)


def tokens(code):
    """
    code 是 str, 例子如下
    code = '+ - [ ] 123 grammyli'
    返回 ['+', '-', '[', ']', '123', 'grammyli']
    """
    l = []
    start = 0
    for index, i in enumerate(code):
        char = code[index:index + 1]
        if char == ' ':
            l.append(code[start:index])
            start = index + 1
    # 最后一个元素
    l.append(code[start:])
    # l = code.split(' ')
    return l


# reduce 使用
## reduce(caball, arr)Ï

# lambda 匿名函数的使用
## lambda 参数1, 参数2: 有返回值的函数

def apply(tokens):
    """
    tokens 是一个数组
    第一个元素是 '+' '-' '*' '/'
    剩下的元素都是数字
    返回计算结果
    """
    from functools import reduce
    a = tokens[0]
    if a == '+':
        return sum(tokens[1:])
    elif a == '-':
        return tokens[1] - sum(tokens[2:])
    elif a == '*':
        return reduce(lambda x, y: x * y, tokens[1:])
    elif a == '/':
        return reduce(lambda x, y: x / y, tokens[1:])
    else:
        log('tokens不合法')


def testTokens():
    code1 = '+ - [ ] 123 grammyli'
    tokens1 = ['+', '-', '[', ']', '123', 'grammyli']
    ensure(tokens(code1) == tokens1, 'tokens 1 fail')
    code2 = 'sdf 342 2344'
    tokens2 = ['sdf', '342', '2344']
    ensure(tokens(code2) == tokens2, 'tokens 2 fail')
    code3 = ''
    tokens3 = ['']
    ensure(tokens(code3) == tokens3, 'tokens 3 fail')


def testApply():
    tokens1 = ['+', 3, 3, 3, 3]
    ensure(apply(tokens1) == 12, 'apply 1 fail')
    tokens2 = ['-', 4, 4, 3, 4]
    ensure(apply(tokens2) == -7, 'apply 2 fail')
    tokens3 = ['*', 4, 4, 3, 4]
    ensure(apply(tokens3) == 192, 'apply 3 fail')
    tokens4 = ['/', 4, 4, 2]
    ensure(apply(tokens4) == 0.5, 'apply 4 fail')


def ensure(condition, message):
    if not condition:
        log('*** 测试失败:', message)
    else:
        log("成功")


def main():
    testTokens()
    testApply()


if __name__ == '__main__':
    main()
