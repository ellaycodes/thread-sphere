exports.customErrors = (err, req, res, next) => {
  if (err) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleFourOhFour = (req, res) => {
  res.status(404).send({ msg: "Not Found" });
};
