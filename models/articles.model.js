const db = require("../db/connection");

exports.selectAllArticles = (topic) => {
  if (typeof topic === "undefined") {
    return db
      .query(
        `SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.author, 
articles.title, 
articles.article_id, 
topic, 
articles.created_at, 
articles.votes, 
article_img_url
ORDER BY articles.created_at DESC;`
      )
      .then(({ rows }) => {
        return rows;
      });
  } else {
    
  const selectFromDB = `SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count
  FROM articles`;

  const joinDB = `LEFT JOIN comments ON articles.article_id = comments.article_id`;

  let whereDB;
  if (topic && topic !== undefined && typeof topic === "string") {
    whereDB = `WHERE topic = $1 `;
  } else {
    whereDB = ``;
  }

  const groupByDB = `GROUP BY articles.author, 
articles.title, 
articles.article_id, 
topic, 
articles.created_at, 
articles.votes, 
article_img_url`;

  const orderByDB = `ORDER BY articles.created_at DESC`;

  return db
    .query(`${selectFromDB} ${joinDB} ${whereDB}${groupByDB} ${orderByDB};`, [
      topic,
    ])
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      console.log(err);
    });
  }
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows;
    });
};

exports.selectCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments 
    WHERE article_id = $1 
    ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentsByArticleId = (author, body, id) => {
  return db
    .query(
      `INSERT INTO comments 
  (article_id, author, body)
  VALUES 
  ($3, $1, $2) 
  RETURNING *;`,
      [author, body, id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateArticleByArticle_id = (id, inc_votes) => {
  if (typeof inc_votes === "string") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `UPDATE articles
  SET votes = votes + $1 
  WHERE article_id = $2 
  RETURNING *;`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return rows[0];
    });
};

exports.deleteComment = (id) => {
  return db.query(
    `DELETE FROM comments
    WHERE comment_id = $1;`,
    [id]
  );
};
