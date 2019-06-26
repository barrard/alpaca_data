const { AsyncParser, parseAsync } = require("json2csv");
const csvtojsonV2 = require("csvtojson");
const csv = require("csvtojson");

module.exports = {
  bars_to_csv,
  csv_to_json, decend_timestamps
};
async function csv_to_json(csv_data) {
  let json = await csv({
    // noheader:true,
    // output: "csv"
  }).fromString(csv_data);
  return(json);
}

async function decend_timestamps(data){
  return data.sort((a, b) => low_to_high(a, b, "t"))
}

function low_to_high(a, b, prop) {
  if (a[prop] > b[prop]) return 1;
  if (a[prop] < b[prop]) return -1;
  return 0;
}
function high_to_low(a, b, prop) {
  if (a[prop] > b[prop]) return -1;
  if (a[prop] < b[prop]) return 1;
  return 0;
}

async function bars_to_csv(data, header) {
  let data_length = data.length;
  let counter = 0;
  const fields = ["o", "h", "l", "c", "t"];
  const opts = { fields, header };
  let csv = await parseAsync(data, opts)
    .then(csv => csv)
    .catch(err => console.error(err));
  // console.log(csv)
  return csv;
  // const transformOpts = { highWaterMark: 8192 };
  // const asyncParser = new AsyncParser(opts, transformOpts);
  // let csv = "";
  // asyncParser.processor
  //   .on("data", chunk => (csv += chunk.toString()))
  //   .on("end", () => )
  //   .on("error", err => console.error(err));

  // asyncParser.transform
  //   .on("header", header => console.log(header))
  //   .on("line", line => {
  //     if (counter == 0) logger.log(`Line 0 = ${line}`);
  //     counter++;
  //     if (counter == data_length) logger.log(`Data at ${counter} : ${line}`);
  //   })
  //   .on("error", err => console.log(err));
  // asyncParser.input.push(JSON.stringify(data)); // This data might come from an HTTP request, etc.
  // asyncParser.input.push(null); // Sending `null` to a stream signal that no more data is expected and ends it.
}
