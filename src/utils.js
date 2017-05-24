
import xml2js from 'xml2js';

const _parser = new xml2js.Parser({
  xmlns: false,
  // explicitArray: true,
  // ignoreAttrs: true,
  // async: true,
  mergeAttrs: true,
});

const xmlParseString = function(string){
  return new Promise(function(resolve, reject){
    _parser.parseString(string, function(err, result){
      if(err){
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const _getIdVerFromUrl = function(url){
  const idRes = url.match(/https?:\/\/arxiv\.org\/abs\/(.*)v(\d+)$/);
  return {
    id: idRes[1],
    ver: parseInt(idRes[2], 10),
  };
};

const _mapPaper = function(entry){
  const { id:arxivId, ver } = _getIdVerFromUrl(entry.id[0]);
  return {
    arxivId: arxivId,
    ver: ver,
    abs: 'https://arxiv.org/abs/' + arxivId,
    pdf: 'https://arxiv.org/pdf/' + arxivId,
    title: entry.title[0],
    published: new Date(entry.published[0]),
    updated: new Date(entry.updated[0]),
    summary: entry.summary[0].replace(/\n/g, ' ').trim(),
    authors: entry.author.map((author)=>{
      return author.name[0];
    }),
    categories: entry.category.map((category)=>{
      return `arxiv.${category.term[0]}`;
    })
  };
};

const entryToPaper = async function(entry){
  const entryJson = await xmlParseString(entry);
  return _mapPaper(entryJson.entry);
};

const xml2entries = function(xml){
  const regex = /\s\s(<entry>\n((.|\n)*?)\s\s<\/entry>)\n/g;
  return xml.match(regex);
};


export {
  _getIdVerFromUrl,
  entryToPaper,
  xml2entries,
  xmlParseString,
}
