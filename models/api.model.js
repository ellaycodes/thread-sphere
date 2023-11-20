const db = require("../db/connection");
const fs = require("fs");

exports.readEndPoints = () => {
  const file = JSON.parse(fs.readFileSync("endpoints.json"));
  return file;
};
