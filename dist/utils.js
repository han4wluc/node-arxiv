'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xmlParseString = exports.xml2entries = exports.entryToPaper = exports._getIdVerFromUrl = undefined;

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _parser = new _xml2js2.default.Parser({
  xmlns: false,
  // explicitArray: true,
  // ignoreAttrs: true,
  // async: true,
  mergeAttrs: true
});

var xmlParseString = function xmlParseString(string) {
  return new Promise(function (resolve, reject) {
    _parser.parseString(string, function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

var _getIdVerFromUrl = function _getIdVerFromUrl(url) {
  var idRes = url.match(/https?:\/\/arxiv\.org\/abs\/(.*)v(\d+)$/);
  return {
    id: idRes[1],
    ver: parseInt(idRes[2], 10)
  };
};

var _mapPaper = function _mapPaper(entry) {
  var _getIdVerFromUrl2 = _getIdVerFromUrl(entry.id[0]),
      arxivId = _getIdVerFromUrl2.id,
      ver = _getIdVerFromUrl2.ver;

  return {
    arxivId: arxivId,
    ver: ver,
    abs: 'https://arxiv.org/abs/' + arxivId,
    pdf: 'https://arxiv.org/pdf/' + arxivId,
    title: entry.title[0],
    published: new Date(entry.published[0]),
    updated: new Date(entry.updated[0]),
    summary: entry.summary[0].replace(/\n/g, ' ').trim(),
    authors: entry.author.map(function (author) {
      return author.name[0];
    }),
    categories: entry.category.map(function (category) {
      return 'arxiv.' + category.term[0];
    })
  };
};

var entryToPaper = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(entry) {
    var entryJson;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return xmlParseString(entry);

          case 2:
            entryJson = _context.sent;
            return _context.abrupt('return', _mapPaper(entryJson.entry));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function entryToPaper(_x) {
    return _ref.apply(this, arguments);
  };
}();

var xml2entries = function xml2entries(xml) {
  var regex = /\s\s(<entry>\n((.|\n)*?)\s\s<\/entry>)\n/g;
  return xml.match(regex);
};

exports._getIdVerFromUrl = _getIdVerFromUrl;
exports.entryToPaper = entryToPaper;
exports.xml2entries = xml2entries;
exports.xmlParseString = xmlParseString;