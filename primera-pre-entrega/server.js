const express = require("express");
const router = require("./routes");

const PORT = 8080;
const app = express();

// Config middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Welcome to my first backend");
});

app.get("*", (req, res) => {
  res.send("That route is not valid, please try '/' instead");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
