exports.psqlErrors = (err, req, res, next) => {
  if (err.code === '23503') {
    res.status(404).send({ msg: "Article Not Found"});
  } else if (err.code === '23502' || err.code === '22P02') {
    res.status(400).send({msg: "Bad Request"});
  } else {
    next(err);
  }
};

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
