const fs = require("fs-extra");
const { csv_to_json } = require("./transform.js");
const rp = require('request-promise')
const cheerio = require('cheerio')
var ParseXbrl = require("parse-xbrl");

require("./logger.js");
require('../db.js')
let Listing_model = require("../models/filing_model.js");

/* cache */
let JSON_CIK = null;
/* functions to scrape xbrl xml files form Edgar */

// get_xbrl_docs_for_ticker("INTC", '10-k');
async function get_xbrl_docs_for_ticker(ticker, type) {
  /* find cik number */
  let ticker_cik = await get_cik_nmber_for_ticker(ticker, type);
  logger.log({ticker_cik})
  let  = await query_cik(ticker_cik, type)

}

async function get_cik_nmber_for_ticker(ticker) {
  if (!JSON_CIK) {
/***** **** **** **** 
    CIK: '1043533',
    Ticker: 'ABVT',
    Name: 'Abovenet Inc',
    Exchange: 'NYSE',
    SIC: '4899',
    Business: 'NY',
    Incorporated: 'DE',
    IRS: '113168327' 
***********************/
    let cik = await fs.readFile("./utils/cik_ticker.csv", "utf8");
    JSON_CIK = await csv_to_json(cik);
  }
  let index = JSON_CIK.findIndex(civ => civ.Ticker == ticker);
  return JSON_CIK[index].CIK;
}

async function query_cik(cik_number, type) {
  var query_url = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik_number}&type=${type}&dateb=&owner=exclude&count=40`
  
  let resp = await rp(query_url);
//   let write = await fs.writeFile('./filing_list_table.htm', resp)
  // let resp = await fs.readFile('./filing_list_table.htm')

// return
  // logger.log(resp)
  const $ = cheerio.load(resp);
  /* data filing table */
  let table = $("tbody", ".tableFile2");
  // logger.log($(table));
  Array.from(table.children()).forEach((row) => {
    // logger.log(row)
    /* get second td child */
    let data = $(row).children();
    // logger.log(data.children().length)
    // logger.log(data.length)
    let second_col = data[1];
    /* see how many children, if only 1, */
    // logger.log(second_col)
    let second_col_children = $(second_col).children();
    if (second_col_children.length == 2) {
      // logger.log("this should be our data");
      /* get the date */
      let date = $(data[3]).text();
      let links = $(data[1]).children();
      // logger.log({ date });
      let link = $(links[0]).attr("href");

      /* new function, Follow link, and get the instance document */
      load_link_and_get_instance_document(`https://www.sec.gov${link}`, date);
    }
  });
}

// load_link_and_get_instance_document(`https://www.sec.gov/Archives/edgar/data/50863/000095012309028975/0000950123-09-028975-index.htm`)
async function load_link_and_get_instance_document(link, date){
  // logger.log(link)
  let resp = await rp(link)
  // let write = await fs.writeFile('./archive_tables.htm', resp)
// return
  // let resp = await fs.readFile('./archive_tables.htm')
  const $ = cheerio.load(resp)
  let tables = $('table')
  /* Get second table, and look for the instance document */
  let data_table = $(tables[1]).children()
  Array.from($(data_table).children()).forEach(row=>{
    let td = $(row).children()
    if($(td[1]).text().includes('XBRL INSTANCE DOCUMENT')){
      /* get hrref of the td link href */
      let link = $(td[2]).children()
      let href = $(link).attr('href')
      /* fetch the link and download? */
      fetch_save_xbrl_instance(`https://www.sec.gov${href}`)
    }
  })


}

/* fetch and save xbrl link form web scrape query */
async function fetch_save_xbrl_instance(link){
  let body =await rp(link)

  let file = link.split('/')
  let filename = file[file.length-1]
  logger.log({filename})
  fs.writeFile(`./xbrl_files/${filename}`, body)
  /* OR....   Just parse and save in db?   */
  // let body = await fs.readFile(`./xbrl_files/${filename}`, 'utf8')
  let parsed_doc = await ParseXbrl.parseStr(body);
  parsed_doc.xml_filename = `${filename}`

  let res = await Listing_model.add_listing({
    ...parsed_doc
  });


}


module.exports = {
  get_xbrl_docs_for_ticker
}