require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:4200" }));
app.use(express.static("public"));

db();

module.exports = app;
