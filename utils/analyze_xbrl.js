require("./logger.js");
const fs = require("fs-extra");
const { read_file, open_file } = require('./files.js')
var ParseXbrl = require("parse-xbrl");
require('../db.js')
let Listing_model = require("../models/filing_model.js");
let express = require('express')
let app = express()

app.use(express.static('../public'));

app.listen('3400')

app.get('/', (req, res)=>{
  logger.log(`/get ${__dirname}`)
  res.sendFile(`${__dirname}/index.html`)
})

app.get('/company_list',async (req, res)=>{
  logger.log(`/get company list`)
  let company_list = await Listing_model.get_company_list()
  res.send({company_list})
})

app.get('/get_all_company_fillings/:name', async (req, res)=>{
  let {name} = req.params
  logger.log(name)
  let all_company_fillings = await Listing_model.get_all_company_fillings(name)
  res.send({all_company_fillings})
})


module.exports = {
  read_xbrl_file
}


//read all from db?
// load_all_from_db()
async function load_all_from_db() {
  let all_filings = await Listing_model.read_all_listings()
  // logger.log(all_filings)
  let data_obj = []

  all_filings.forEach(listing => {
    // logger.log(listing.EntityRegistrantName)
    if (listing.EntityRegistrantName == 'PFIZER INC') {
      let data = {
        BalanceSheetDate: listing.BalanceSheetDate,
        // Assets: listing.Assets,
        ComprehensiveIncome:listing.ComprehensiveIncome,
        CostsAndExpenses:listing.CostsAndExpenses,
        // GrossProfit:listing.GrossProfit
      }
      data_obj.push(data)
      // data_obj[listing.BalanceSheetDate] = listing.Assets
    }
  })

  logger.log(data_obj.sort((a, b) => high_to_low(a, b, "BalanceSheetDate"))
  )


}

// read_all_xbrl_file('../xbrl_files')
async function read_all_xbrl_file(xbrl_dir) {
  let dir_obj = await fs.readdir(xbrl_dir);
  // return logger.log(dir_obj.length)

  dir_obj.map((xbrl_file, index) => {

    setTimeout(async () =>
      await save_xbrl_to_db(xbrl_dir, xbrl_file),
      // await save_xbrl_to_db(`${xbrl_dir}/${xbrl_file}`), 
      index * 1000)
  })

}
// read_xbrl_file('../xbrl_files','bac-20160331.xml')
async function read_xbrl_file(xbrl_dir, xbrl_file) {
  let xbrl_data = await fs.readFile(`${xbrl_dir}/${xbrl_file}`, "utf8");
  let parsed_doc = await ParseXbrl.parseStr(xbrl_data);
  parsed_doc.xml_filename = xbrl_file

  // logger.log(parsed_doc.TradingSymbol)
  return parsed_doc
  // logger.log(parsed_doc.BalanceSheetDate)
  // logger.log(parsed_doc.EntityRegistrantName)

}

async function save_xbrl_to_db(xbrl_dir, xbrl_file) {

  let parsed_doc = await read_xbrl_file(xbrl_dir, xbrl_file)

  let res = await Listing_model.add_listing({
    ...parsed_doc
  });
  logger.log(!!res)
}

function high_to_low(a, b, prop) {
  if (a[prop] > b[prop]) return -1;
  if (a[prop] < b[prop]) return 1;
  return 0;
}
function low_to_high(a, b, prop) {
  if (a[prop] > b[prop]) return 1;
  if (a[prop] < b[prop]) return -1;
  return 0;
}
