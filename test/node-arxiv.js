
import chai from 'chai';
const should = chai.should();
import fs from 'fs';

import nodeArxiv from '../src/node-arxiv';


describe('nodeArxiv', function(){
  it('should succeed', async function(){
    await nodeArxiv({categories:['cs.CV', 'cs.CL'], max_results:1})
  })
})
