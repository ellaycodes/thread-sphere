const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { handleFourOhFour } = require('./errors')

app.get("/api/topics", getTopics);

app.get("*", handleFourOhFour);

module.exports = app;
