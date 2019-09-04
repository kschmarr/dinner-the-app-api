require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const errorHandler = require("./error-handler");
const dinnerRouter = require("./dinner-router");
const dinnerService = require("./dinner-service");

const app = express();

app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test"
  })
);
app.use(cors());
app.use(helmet());

app.use("/", dinnerRouter);

app.get("/", (req, res) => {
  res.send("Hello, Kris!");
});

app.use(errorHandler);

module.exports = app;
