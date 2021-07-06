"use strict";

const regeneratorRuntime = {
    mark(genFn) {
        return genFn
    },
    wrap(iterFn) {
        let ctx = {
            next: 0,
            done: false, // 表示迭代器没有执行完毕
            stop() {
                ctx.done = true;
            },
            sent: null, // 用于接收用户传递的值
            abrupt(next, val) {
                ctx.next = next;
                return val
            }
        }
        let it = {};
        it.next = function (val) {
            ctx.sent = val;
            let value = iterFn(ctx);
            return {
                value: value,
                done: ctx.done
            }
        }
        return it;
    }
}

var _marked = /*#__PURE__*/regeneratorRuntime.mark(gen);

function gen() {
    var a, b;
    return regeneratorRuntime.wrap(function gen$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return 1;

                case 2:
                    a = _context.sent;
                    _context.next = 5;
                    return 2;

                case 5:
                    b = _context.sent;
                    return _context.abrupt("return", b);

                case 7:
                case "end":
                    return _context.stop();
            }
        }
    }, _marked);
}

let it = gen(1);
console.log(it.next());
console.log(it.next());
console.log(it.next('输入值'));
