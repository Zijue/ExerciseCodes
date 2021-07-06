"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw); // 报错就会执行_throw函数
        /**
        try {
            var info = gen[key](arg); // it.throw(err)，这样async中可以try...catch
            var value = info.value;
        } catch (error) {
            reject(error);
            return;
        }
         */
    }
}

function _asyncToGenerator(fn) {
    return function () {
        var self = this, args = arguments;
        return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

var fs = require('fs').promises;

function read() {
    return _read.apply(this, arguments);
}

function _read() {
    _read = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var a, b;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return fs.readFile('a.txt', 'utf8');

                    case 3:
                        a = _context.sent;
                        _context.next = 6;
                        return fs.readFile(a, 'utf8');

                    case 6:
                        b = _context.sent;
                        return _context.abrupt("return", b);

                    case 10:
                        _context.prev = 10;
                        _context.t0 = _context["catch"](0);
                        console.log(_context.t0);

                    case 13:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, null, [[0, 10]]);
    }));
    return _read.apply(this, arguments);
}

read().then(data => {
    console.log('success', data);
}, err => {
    console.log(err);
})