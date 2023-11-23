const db = require("../db/connection");

exports.checkIfArticleIdExists = (id) => {
  const idCheck = Number(id)
  if (isNaN(idCheck) || idCheck === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `SELECT * 
    FROM articles 
    WHERE article_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        console.log(rows.length);
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
    });
};
