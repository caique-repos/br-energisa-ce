const express = require("express");
const routes = require("./routes");
// const cors = require("cors");
const app = express();

// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"],
//   })
// );

// app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

module.exports = app;
