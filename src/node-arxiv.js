
import axios from 'axios';
import fs from 'fs';
import _ from 'lodash';
import request from 'request-promise';

import * as utils from './utils';

export default async function({
  start = 0, max_results = 10, categories=[],
  sortBy='lastUpdatedDate', sortOrder='descending'}){

  try {
    const categoriesQuery = categories.map(c=>`cat:${c}`).join('%20OR%20'); //+OR+

    const { data } = await axios.get('https://export.arxiv.org/api/query', {
      params: {
        search_query: categoriesQuery,
        start,
        max_results,
        sortBy,
        sortOrder,
      },
      timeout: 30000,
    });

    const resData = await utils.xmlParseString(data);
    const totalResults = parseInt(resData.feed['opensearch:totalResults'][0]._,10);
    if(start >= totalResults){
      return {
        totalResults,
        papers: [],
      };
    }

    const entries = utils.xml2entries(data);
    if(!entries){
      throw new Error('Unexpected Error, entries was null: \n' + data);
    }

    const papers = await Promise.all(entries.map(utils.entryToPaper));
    return { papers, totalResults };
  } catch (error){
    throw error;
  }

};
