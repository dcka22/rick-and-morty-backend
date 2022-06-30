const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
mongoose.connect("mongodb://localhost:27888/development", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const INTERNAL_SERVER_ERROR = 500;
const UserModel = require("./src/models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const CharactersRouter = require("./src/routes/CharactersRouter");
const LoginRouter = require("./src/routes/LoginRouter");


app.use("/login", LoginRouter);

app.put("/users/:username/characters/:id", async (req, res) => {
  try {
    const { username, id } = req.params;

    await UserModel.updateOne(
      { username },
      { $pull: { 'favoriteCharacters': id } }
    );
    await UserModel.updateOne({ username }, { $push: { 'favoriteCharacters': id } });
  } catch (error) {
    return res
      .status(error.status || error.code || INTERNAL_SERVER_ERROR)
      .json({
        code: error.code || INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      });
  }
});

app.delete("/users/:username/characters/:id", async (req, res) => {
  try {
    const { username, id } = req.params;
  
   await UserModel.updateOne({ username }, { $pull: { 'favoriteCharacters': id} });

  } catch (error) {
    return res
      .status(error.status || error.code || INTERNAL_SERVER_ERROR)
      .json({
        code: error.code || INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      });
  }
});

app.use("/users/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const user = await UserModel.findOne({
      username,
    });
    res.json(user);
  } catch (error) {
    return res
      .status(error.status || error.code || INTERNAL_SERVER_ERROR)
      .json({
        code: error.code || INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      });
  }
});

app.use("/characters", CharactersRouter);

app.use("/characters/:id", async (req, res) => {
  let response;
  const { id } = req.params;

  try {
    response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
  } catch (error) {
    return res
      .status(error.status || error.code || INTERNAL_SERVER_ERROR)
      .json({
        code: error.code || INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      });
  }

  return res.json(response?.data);
});

module.exports = app.listen(5000, function () {
  console.log("listening on 5000");
});
