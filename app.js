const db = require("./db");
const UserRoutes = require("./routes/UserRoutes");
const PetRoutes = require("./routes/PetRoutes");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

db();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:4200" }));
app.use(express.static("public"));
app.use("/users", UserRoutes);
app.use("/pets", PetRoutes);

module.exports = app;
