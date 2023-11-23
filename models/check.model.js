const db = require("../db/connection");

exports.checkIfArticleIdExists = (id) => {
  const idCheck = Number(id)
  if (isNaN(idCheck) || idCheck === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return db
      .query(
        `SELECT * 
    FROM articles 
    WHERE article_id = $1`,
        [id]
      )
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: "Article Not Found" });
        }
      });
  }};

exports.checkIfCommentIdExists = (id) => {
  const idCheck = Number(id);
  if (isNaN(idCheck)) {
    return Promise.reject({ status: 400, msg: "Invalid Comment ID" });
  } else {
    return db
      .query(`SELECT * FROM comments WHERE comment_id = $1`, [idCheck])
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: "Comment Not Found" });
        }
        return true;
      });
  }
};
