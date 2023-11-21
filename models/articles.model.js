const db = require("../db/connection");

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count
      FROM articles 
    JOIN comments ON articles.article_id = comments.article_id
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
      console.log(rows);
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
