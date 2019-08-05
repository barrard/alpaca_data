require('dotenv').config()
const Alpaca = require("@alpacahq/alpaca-trade-api");
const { bars_to_csv, csv_to_json, decend_timestamps } = require("./utils/transform.js");
require("./utils/logger.js");
const fs = require("fs-extra");
const high_vol_symbols = require('./utils/symbols.js')
const {
  save_data,
  write_access_token,
  make_path_exist,
  get_file_stats,
  make_dir,
  read_file,
  save_fd,
  open_file, 
} = require("./utils/files.js");
let {get_xbrl_docs_for_ticker} = require('./utils/gather_xbrl_files.js')

//https://github.com/alpacahq/alpaca-trade-api-js
// https://github.com/alpacahq/marketstore
const alpaca = new Alpaca({
  keyId: process.env.KEY_ID,
  secretKey: process.env.SECRET_KEY,
  paper: true
});
const DATA_DIR = "./data";

// get_sccount()
async function get_sccount() {
  let account = await alpaca.getAccount();
  console.log("Current Account:", account);
}

// gather_all_xbrl()//Get all symbols in the symbols.js   ile and get 10-q, 10-k
function gather_all_xbrl(){
  high_vol_symbols.map((symbol, index)=>{
    setTimeout(()=>{
      get_xbrl_docs_for_ticker(symbol, '10-q')
      setTimeout(()=> get_xbrl_docs_for_ticker(symbol, '10-k'), 10000)
    }, index*1000*90)
  })
}

//Get all symbols in the symbols.js file
// gather_all_symbols()
function gather_all_symbols(){
  high_vol_symbols.map((symbol, index)=>{
    setTimeout(()=>{
      get_data(symbol)
    }, index*1000*90)
  })
}

// get_data("OXY");
async function get_data(symbol) {
  logger.log(`getting data for ${symbol}`)
  let iterations = 0
  let data_path = `${DATA_DIR}/${symbol}`;
  let filename = `15MIN_${symbol}.csv`;
  let file_path = `${data_path}/${filename}`;
  await make_path_exist(data_path);

  /* ensure files exists */
  let {csv_file_data, appendable_fd} = await open_file(file_path);
  // console.log(data);//file data....
  if (!csv_file_data.length) {

    logger.log("File is empty!");
    let start = 0
    let end = new Date("2019", "6", "27", "0", "0");
    let bars = await get_minutely(symbol,start, end)
    let csv_data = await bars_to_csv(bars[symbol], true);

    /* write the data */
    save_fd(appendable_fd, csv_data);
    iterations++
    setTimeout(()=> get_data(symbol) , 2500)
  } else {
    logger.log("read the data and add to it".yellow);
    let json_data = await csv_to_json(csv_file_data);
    /* check clean data */
    let time_ordered_json = await decend_timestamps(json_data)

    let data_len = time_ordered_json.length
    let newest = (time_ordered_json[data_len-1].t*1000)
    let oldest = time_ordered_json[0].t*1000
    console.log({oldest:new Date(oldest), newest:new Date(newest)})
    let month = 1000*60*60*24*30

    let bars = await get_minutely(symbol,new Date(oldest-(month)), new Date(oldest))
    // logger.log(bars)

    /* decend bars */
    let time_ordered_bars = await decend_timestamps(bars[symbol])

    logger.log(time_ordered_bars.length)
    let csv_data = await bars_to_csv(time_ordered_bars);
    
    /* write the data */
    save_fd(appendable_fd, csv_data);
    if(time_ordered_bars.length == 1) return
    setTimeout(()=> get_data(symbol), 2500)
  }

}
async function get_minutely(symbol, start, end){
  let bars = await alpaca.getBars('1Min', symbol, {start:start, end: end})
  return bars

}

let symbols = ["FB", "AAPL", "AMNZ", "INTC", "MSFT", "GOLD"];
// get_data(symbols[0])

function date(d) {
  return new Date(d);
}

// getBars(
//   'minute' | '1Min' | '5Min' | '15Min' | 'day' | '1D',
//   symbol | symbol[], // which ticker symbols to get bars for
//   {
//     limit: number,
//     start: Date,
//     end: Date,
//     after: Date,
//     until: Date
//   }
// )
