const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentsByArticleId,
} = require("./controllers/articles.controller");
const { handleFourOhFour, customErrors, psqlErrors } = require("./errors");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.get("*", handleFourOhFour);

app.use(psqlErrors);
app.use(customErrors);

module.exports = app;
