require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");
const UserRoutes = require("./routes/UserRoutes");

const app = express();

db();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:4200" }));
app.use(express.static("public"));
app.use("/users", UserRoutes);

module.exports = app;
