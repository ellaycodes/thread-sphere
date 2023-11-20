const { readEndPoints } = require("../models/api.model");

exports.getApi = (req, res, next) => {
  res.status(200).send(readEndPoints())
};
