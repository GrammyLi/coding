from token_list import token_list
from token_parser import parse


def main():
    t0 = 'pass0.json'
    ts = token_list(t0)
    o = parse(ts)

    for k, v in o.items():
        print('{} : {}'.format(k, v))
    # print('main', type(o), o.keys(), o.values())
    # print(json.dumps(o, indent=2))


if __name__ == '__main__':
    main()
