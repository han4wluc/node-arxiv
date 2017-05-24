'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref2) {
    var _ref2$start = _ref2.start,
        start = _ref2$start === undefined ? 0 : _ref2$start,
        _ref2$max_results = _ref2.max_results,
        max_results = _ref2$max_results === undefined ? 10 : _ref2$max_results,
        _ref2$categories = _ref2.categories,
        categories = _ref2$categories === undefined ? [] : _ref2$categories,
        _ref2$sortBy = _ref2.sortBy,
        sortBy = _ref2$sortBy === undefined ? 'lastUpdatedDate' : _ref2$sortBy,
        _ref2$sortOrder = _ref2.sortOrder,
        sortOrder = _ref2$sortOrder === undefined ? 'descending' : _ref2$sortOrder;

    var categoriesQuery, _ref3, data, resData, totalResults, entries, papers;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            categoriesQuery = categories.map(function (c) {
              return 'cat:' + c;
            }).join('%20OR%20'); //+OR+

            _context.next = 4;
            return _axios2.default.get('https://export.arxiv.org/api/query', {
              params: {
                search_query: categoriesQuery,
                start: start,
                max_results: max_results,
                sortBy: sortBy,
                sortOrder: sortOrder
              },
              timeout: 30000
            });

          case 4:
            _ref3 = _context.sent;
            data = _ref3.data;
            _context.next = 8;
            return utils.xmlParseString(data);

          case 8:
            resData = _context.sent;
            totalResults = parseInt(resData.feed['opensearch:totalResults'][0]._, 10);

            if (!(start >= totalResults)) {
              _context.next = 12;
              break;
            }

            return _context.abrupt('return', {
              totalResults: totalResults,
              papers: []
            });

          case 12:
            entries = utils.xml2entries(data);

            if (entries) {
              _context.next = 15;
              break;
            }

            throw new Error('Unexpected Error, entries was null: \n' + data);

          case 15:
            _context.next = 17;
            return Promise.all(entries.map(utils.entryToPaper));

          case 17:
            papers = _context.sent;
            return _context.abrupt('return', { papers: papers, totalResults: totalResults });

          case 21:
            _context.prev = 21;
            _context.t0 = _context['catch'](0);
            throw _context.t0;

          case 24:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 21]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();