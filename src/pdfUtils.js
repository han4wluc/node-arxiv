
import fs from 'fs';
import 'pdfjs-dist';
import request from 'request';

const array2string = function(array){
  var text = '';
  for(var i=0; i<array.length;i++){
    var str = array[i];
    if(!str) { continue; }
    var len = str.length;

    if(str[len-1] === '-'){
      str = str.substring(0,len-1);
      text = text + str;
    } else {
      text = text + str + ' ';
    }
  }
  return text.trim().replace(/\s{2,}/g, ' ');
};

const download = function(pdfUrl, outFilePath){
  return new Promise(function(resolve, reject){
    const stream = fs.createWriteStream(outFilePath);
    stream.on('finish', resolve);
    stream.on('error', reject);
    request({
      method: 'GET',
      url: pdfUrl,
      headers: {
        'User-Agent': 'request'
      },
    }, function(err){
      if(err){
        reject(err);
      }
    }).pipe(stream);      
  });
};

// TODO
const _proccessPdf = async function(paper, debug){

  const { arxivId, ver, pdf } = paper;

  try {
    fs.mkdirSync('./tmp');
  } catch (err) {
  }
  // request
  // const promises = papers.map(async ({ver,pdf,arxivId}, i)=>{
  const arxivIdCopy = arxivId + '';
  const pdfPath = './tmp/' + arxivIdCopy.replace('/','.') + '.pdf';

  // const pdfPath = './tmp/hello.pdf';
  if(debug){
    console.log('');
  }
  await _downloadPdf(pdf, pdfPath);
  // const pdfFile = new pdftotext(pdfPath);
  // console.log('pdf dled', arxivId);
  // var text = pdfFile.getTextSync().toString('utf8');
  // fs.unlinkSync(pdfPath);

  // https://github.com/mozilla/pdf.js/blob/master/examples/node/getinfo.js
  var pdfJsdata = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await PDFJS.getDocument(pdfJsdata);

  // doc.numPages.map()
  const pages = _.range(1,doc.numPages+1);
  // const pages = [1];
  const stringArrays = pages.map(async function(pageNum){
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    return content.items.map(function (item) {
      return item.str;
    });
  });

  const pageTexts = _.flatten(await Promise.all(stringArrays));

  const text = _array2string(pageTexts);

  return {
    text: text,
    pages: doc.numPages,
    toolVer: 1,
    ver: ver,
  };
    // return Promise.resolve(data);
  // });

  // return Promise.all(promises);

};


export {
  array2string,
  download
}

