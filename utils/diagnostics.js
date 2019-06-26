let {open_file, get_file_stats, read_csv} =require('./files.js')
let {csv_to_json} = require('./transform.js')
const fs = require("fs-extra");

check_minutly_increments('FB')

/* check the increments? */
async function check_minutly_increments(symbol){
  logger.log(`${symbol}`.blue)
  let file_path = `./data/${symbol}/minutely_${symbol}.csv`
  let json_data = await get_data(file_path)
  logger.log(json_data.length)
  json_data.map((data, index) =>{
    // logger.log(data)
    let time =data.t
    let next_time = json_data[index+1].t
    let time_diff = time - next_time
    // logger.log(time_diff)
    if(time_diff < -60 ){
      logger.log(data)
      logger.log(json_data[index+1])

    }
  })

}

async function get_data(file_path){
  let {csv_file_data} = await open_file(file_path);
  let json_data = await csv_to_json(csv_file_data);
  return json_data
}