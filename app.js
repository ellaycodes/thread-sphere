const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const { getArticleById } = require("./controllers/articles.controller");
const { handleFourOhFour, customErrors } = require("./errors");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("*", handleFourOhFour);

app.use(customErrors);

module.exports = app;
