const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const { appRouter } = require("./routes/app.route");
const dotenv = require("dotenv").config();

const port = 3001;
const DB_NAME = "Anime";

app.use(
  cors({
    origin: "http://localhost:3000",
    SameSite: "lax",
    credentials: true,
  })
);
app.use(express.json());
app.use(appRouter);

mongoose
  .connect(
    `${process.env.DB_HOST}`
  )
  .catch((error) => console.log("connection error: " + error));
mongoose.connection.on("open", () => {
  console.log("mongodb connected");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
