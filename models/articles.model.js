const db = require("../db/connection");

exports.selectAllArticles = () => {
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
