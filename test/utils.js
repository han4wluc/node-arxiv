
import chai from 'chai';
const should = chai.should();
import fs from 'fs';

import * as utils from '../src/utils';


describe('getIdVerFromUrl', function(){
  it('sould return correct version', async function(){

    var actual;

    // https
    actual = utils._getIdVerFromUrl('https://arxiv.org/abs/cs/0212041v1');
    actual.should.deep.equal({ id: 'cs/0212041', ver: 1 });

    // http
    actual = utils._getIdVerFromUrl('http://arxiv.org/abs/cs/0212041v2');
    actual.should.deep.equal({ id: 'cs/0212041', ver: 2 });

    // two digit version
    actual = utils._getIdVerFromUrl('https://arxiv.org/abs/cs/0212041v15');
    actual.should.deep.equal({ id: 'cs/0212041', ver: 15 });

    // old version format
    actual = utils._getIdVerFromUrl('https://arxiv.org/abs/1205.3915v1');
    actual.should.deep.equal({ id: '1205.3915', ver: 1 });

  });
});


describe('entryToPaper', function(){
  const dateTimeReviver = function (key, value) {
    var a;
    if (typeof value === 'string') {
      a = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/.exec(value);
      if (a) {
        return new Date(value);
      }
    }
    return value;
  }
  const entryXml = fs.readFileSync(__dirname + '/entry.xml', 'utf8');
  const entryJson = JSON.parse(fs.readFileSync(__dirname + '/entry.json', 'utf8'), dateTimeReviver);

  it('should', async function(){
    const actual = await utils.entryToPaper(entryXml)
    actual.should.deep.equal(entryJson)
  })
})

describe('xml2entries', function(){
  const xml = fs.readFileSync(__dirname + '/arxiv_query_result.xml', 'utf8');
  const entryXml = fs.readFileSync(__dirname + '/entry.xml', 'utf8');
  it('should', function(){
    const entries = utils.xml2entries(xml);
    entries.length.should.equal(5);
    entries[0].should.equal(entryXml);
  });
});




