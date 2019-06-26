require("./logger.js");
const fs = require("fs-extra");
const access_token_path = "./access_token.js";

module.exports = {
  save_data,
  write_access_token,
  make_path_exist,
  make_dir,
  read_file,
  get_file_stats,
  open_file,
  save_fd, read_csv
};
async function read_csv(fd){
  let file_stats = await get_file_stats(fd);
  var file_buffer = new Buffer(file_stats.size);
  let { bytesRead, buffer } = await fs.read(
    fd,
    file_buffer,
    0,
    file_buffer.length,
    null
  );
  return buffer.toString("utf8", 0, buffer.length);
}
async function get_file_stats(file) {
  try {
    let stats = await fs.stat(file);
    // logger.log(stat)
    return stats;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
}
async function open_file(file_path) {
  try {
    /* Open file for read and append*/
    let fd = await fs.open(file_path, "a+");
    let file_stats = await get_file_stats(file_path);
    /* Read the file */
    var file_buffer = new Buffer(file_stats.size);
  
    let { bytesRead, buffer } = await fs.read(
      fd,
      file_buffer,
      0,
      file_buffer.length,
      null
    );
      let csv_file_data = buffer.toString("utf8", 0, buffer.length);
      
    return {csv_file_data, fd} 

  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
}
async function read_file(file) {
  let buffer = await fs.readFile(file);
  logger.log(buffer);
  logger.log(buffer.length);

  return buffer;
}

async function save_data(symbol, name, data, append) {
  try {
    logger.log(`writing ${symbol}, ${name}`);
    let done = await write_file(`./data/${symbol}/${name}`, data, append);
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
}

/* MAIN */
async function write_access_token(token) {
  try {
    let code = `
  module.exports ="${token}"
  `;
    logger.log({ access_token_path });
    let mod_exp = "module.exports.access_token =`" + token + "`";
    let done = await write_file(access_token_path, mod_exp, false);
    if (done) logger.log("Success, new token saved".green);
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
}

//simple save with fd, buffer

async function save_fd(fd, data) {
  try {
    await fs.write(fd, data);
    await fs.close(fd);
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
  }
}

async function write_file(filename, data, append) {
  try {
    let flag = append ? "a" : "w";
    /* check path exists */
    //pathExists
    let path = get_path(filename);

    await make_path_exist(path);

    let fd = await fs.open(filename, flag);
    fs.write(fd, data);
    return true;
  } catch (err) {
    if (err) throw err;
  }
}

async function make_dir(path) {
  logger.log(`making dir with ${path}`);
  try {
    logger.log({ path });
    await fs.mkdirp(path);
    return true;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    return false;
  }
}

async function make_path_exist(path) {
  // logger.log("checking if path exists");
  try {
    /* assuming full filename and path */

    let exists = await fs.pathExists(path);
    if (!exists) await make_dir(path);

    return exists;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err);
    return false;
  }
}

function get_path(filename) {
  let path = filename.split("/");
  path.pop();
  return path.join("/");
}
