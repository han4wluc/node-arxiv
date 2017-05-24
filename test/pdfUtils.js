
import chai from 'chai';
const should = chai.should();
import fs from 'fs';
import md5 from 'md5';
import * as pdfUtils from '../src/pdfUtils';

describe('array2string', function(){
  
  it('should return correct string', function(){
    const arrays = [
      'hello how are you doing',
      'im doing o-',
      'k wow that  is great',
      '',
      '',
      'how about yo-',
      'u',
      'im fine thank you.'
    ];
    const expected = 'hello how are you doing im doing ok wow that is great how about you im fine thank you.';
    const actual = pdfUtils.array2string(arrays);

    actual.should.equal(expected);
  })

})        

describe('download', function(){
  it('should download correct pdf file', async function(){
    const pdfOutFile = __dirname + '/fixture.pdf';
    await pdfUtils.download('https://mypaperlist.oss-cn-hongkong.aliyuncs.com/test/fixture.pdf', pdfOutFile)
    const pdfContent = fs.readFileSync(pdfOutFile);
    fs.unlink(pdfOutFile)
    const actual = md5(pdfContent);
    const expected = '187dea0e3dee9aaa983451d8b3aa68c4';
    actual.should.equal(expected)
  })

  it('should not download unexisting file', async function(){
    const pdfOutFile = __dirname + '/fixture2.pdf';
    try {
      await pdfUtils.download('https://localhost:9999', pdfOutFile)
      throw new Error('9999');
    } catch (error){
      fs.unlink(pdfOutFile)
      error.message.should.not.equal('9999');
    }
  })
})

describe('TODO _proccessPdf', function(){
  //stuff
})

