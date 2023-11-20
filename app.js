const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require('./controllers/api.controller')
const { handleFourOhFour } = require("./errors");

app.get("/api", getApi);
app.get("/api/topics", getTopics);

app.get("*", handleFourOhFour);

module.exports = app;
