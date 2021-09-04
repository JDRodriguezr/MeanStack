const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./db/db");
const User = require("./routes/user");
const Post = require("./routes/post");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/user", User);
app.use("/api/post", Post);

app.listen(process.env.PORT, () =>
  console.log("Backend server running on port: " + process.env.PORT)
);

dbConnection();
