const db = require("../db/connection");

exports.selectAllArticles = (topic, sort_by = "created_at", order = "desc") => {
  const validSortColumns = ["created_at", "votes", "comment_count"];

  if (!validSortColumns.includes(sort_by)) {
    sort_by = "created_at";
  }

  order = order.toLowerCase() === "asc" ? "asc" : "desc";

  let query = `
  SELECT articles.author, 
         articles.title, 
         articles.article_id, 
         topic, 
         articles.created_at, 
         articles.votes, 
         article_img_url, 
         COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
`;

  const queryParams = [];

  if (topic) {
    query += ` WHERE topic = $1`;
    queryParams.push(topic);
  }

  query += `
GROUP BY articles.author, 
         articles.title, 
         articles.article_id, 
         topic, 
         articles.created_at, 
         articles.votes, 
         article_img_url
`;

  query += ` ORDER BY ${sort_by} ${order};`;

  return db.query(query, queryParams).then(({ rows }) => rows);
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.author, 
articles.title, 
articles.article_id,
articles.body, 
topic, 
articles.created_at, 
articles.votes, 
article_img_url`,
      [article_id]
    )
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
  if (typeof body === "string" && body.length < 1) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
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
