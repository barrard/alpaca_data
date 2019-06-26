require('dotenv').config()
const Alpaca = require("@alpacahq/alpaca-trade-api");
const { bars_to_csv, csv_to_json, decend_timestamps } = require("./utils/transform.js");
require("./utils/logger.js");
const fs = require("fs-extra");

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

get_data("MSFT");
async function get_data(symbol) {
  logger.log(`getting data for ${symbol}`)
  let iterations = 0
  let data_path = `${DATA_DIR}/${symbol}`;
  let filename = `minutely_${symbol}.csv`;
  let file_path = `${data_path}/${filename}`;
  await make_path_exist(data_path);

  /* ensure files exists */
  let {csv_file_data, fd} = await open_file(file_path);
  // console.log(data);//file data....
  if (!csv_file_data.length) {

    logger.log("File is empty!");
    let start = new Date("2019", "5", "24", "0", "0");
    let end = new Date("2019", "5", "25", "0", "0");
    let bars = await get_minutely(symbol,start, end)
    let csv_data = await bars_to_csv(bars[symbol], true);

    /* write the data */
    save_fd(fd, csv_data);
    iterations++
    setTimeout(()=> get_data(symbol) , 1000)
  } else {
    logger.log("read the data and add to it".yellow);
    let json_data = await csv_to_json(csv_file_data);
    /* check clean data */
    let time_ordered_json = await decend_timestamps(json_data)

    let data_len = time_ordered_json.length
    let newest = (time_ordered_json[data_len-2].t*1000)
    let oldest = time_ordered_json[0].t*1000
    console.log({oldest:new Date(oldest), newest:new Date(newest)})
    let month = 1000*60*60*24*30
    let bars = await get_minutely(symbol,new Date(oldest-month), new Date(oldest))
    logger.log(bars[symbol].length)
    let csv_data = await bars_to_csv(bars[symbol]);

    /* write the data */
    save_fd(fd, csv_data);
    setTimeout(()=> get_data(symbol), 5000)
  }

}
async function get_minutely(symbol, start, end){
  let bars = await alpaca.getBars('minute', symbol, {start:start, end: end})
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
