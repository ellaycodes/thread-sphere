const {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticleId,
  insertCommentsByArticleId,
  updateArticleByArticle_id,
  deleteComment,
} = require("../models/articles.model");

const {
  checkIfArticleIdExists,
  checkIfCommentIdExists,
  checkIfTopicExists
} = require("../models/check.model");

exports.getAllArticles = (req, res, next) => {
  const { topic } = req.query;

  const existenceCheck = [selectAllArticles(topic)];

  if (topic) {
    existenceCheck.push(checkIfTopicExists(topic));
  }

  Promise.all(existenceCheck)
    .then((resolvedExistence) => {
      const articles = resolvedExistence[0]
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const existenceCheck = [selectCommentsByArticleId(article_id)];

  if (article_id) {
    existenceCheck.push(checkIfArticleIdExists(article_id));
  }

  Promise.all(existenceCheck)
    .then((resolvedExistence) => {
      const comments = resolvedExistence[0];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  const existenceCheck = [
    insertCommentsByArticleId(username, body, article_id),
  ];

  if (article_id) {
    existenceCheck.push(checkIfArticleIdExists(article_id));
  }

  Promise.all(existenceCheck)
    .then((resolvedExistence) => {
      const comments = resolvedExistence[0];
      res.status(201).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  const existenceCheck = [updateArticleByArticle_id(article_id, inc_votes)];

  if (article_id) {
    existenceCheck.push(checkIfArticleIdExists(article_id));
  }

  Promise.all(existenceCheck)
    .then((resolvedExistence) => {
      const articles = resolvedExistence[0];
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  checkIfCommentIdExists(comment_id)
    .then(() => {
      return deleteComment(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
