'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.download = exports.array2string = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

require('pdfjs-dist');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var array2string = function array2string(array) {
  var text = '';
  for (var i = 0; i < array.length; i++) {
    var str = array[i];
    if (!str) {
      continue;
    }
    var len = str.length;

    if (str[len - 1] === '-') {
      str = str.substring(0, len - 1);
      text = text + str;
    } else {
      text = text + str + ' ';
    }
  }
  return text.trim().replace(/\s{2,}/g, ' ');
};

var download = function download(pdfUrl, outFilePath) {
  return new Promise(function (resolve, reject) {
    var stream = _fs2.default.createWriteStream(outFilePath);
    stream.on('finish', resolve);
    stream.on('error', reject);
    (0, _request2.default)({
      method: 'GET',
      url: pdfUrl,
      headers: {
        'User-Agent': 'request'
      }
    }, function (err) {
      if (err) {
        reject(err);
      }
    }).pipe(stream);
  });
};

// TODO
var _proccessPdf = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(paper, debug) {
    var arxivId, ver, pdf, arxivIdCopy, pdfPath, pdfJsdata, doc, pages, stringArrays, pageTexts, text;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            arxivId = paper.arxivId, ver = paper.ver, pdf = paper.pdf;


            try {
              _fs2.default.mkdirSync('./tmp');
            } catch (err) {}
            // request
            // const promises = papers.map(async ({ver,pdf,arxivId}, i)=>{
            arxivIdCopy = arxivId + '';
            pdfPath = './tmp/' + arxivIdCopy.replace('/', '.') + '.pdf';

            // const pdfPath = './tmp/hello.pdf';

            if (debug) {
              console.log('');
            }
            _context2.next = 7;
            return _downloadPdf(pdf, pdfPath);

          case 7:
            // const pdfFile = new pdftotext(pdfPath);
            // console.log('pdf dled', arxivId);
            // var text = pdfFile.getTextSync().toString('utf8');
            // fs.unlinkSync(pdfPath);

            // https://github.com/mozilla/pdf.js/blob/master/examples/node/getinfo.js
            pdfJsdata = new Uint8Array(_fs2.default.readFileSync(pdfPath));
            _context2.next = 10;
            return PDFJS.getDocument(pdfJsdata);

          case 10:
            doc = _context2.sent;


            // doc.numPages.map()
            pages = _.range(1, doc.numPages + 1);
            // const pages = [1];

            stringArrays = pages.map(function () {
              var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(pageNum) {
                var page, content;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return doc.getPage(pageNum);

                      case 2:
                        page = _context.sent;
                        _context.next = 5;
                        return page.getTextContent();

                      case 5:
                        content = _context.sent;
                        return _context.abrupt('return', content.items.map(function (item) {
                          return item.str;
                        }));

                      case 7:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }());
            _context2.t0 = _;
            _context2.next = 16;
            return Promise.all(stringArrays);

          case 16:
            _context2.t1 = _context2.sent;
            pageTexts = _context2.t0.flatten.call(_context2.t0, _context2.t1);
            text = _array2string(pageTexts);
            return _context2.abrupt('return', {
              text: text,
              pages: doc.numPages,
              toolVer: 1,
              ver: ver
            });

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function _proccessPdf(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.array2string = array2string;
exports.download = download;