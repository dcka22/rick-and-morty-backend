const express = require('express');
const CharactersRouter = express.Router();
const axios = require("axios");

CharactersRouter.get('/', async (req, res) => {
  let response;
  try {
    response = await axios.get('https://rickandmortyapi.com/api/character');
  } catch (error) {
    throw new Error(error);
  }

  return res.json(response && response.data);
});

module.exports = CharactersRouter;