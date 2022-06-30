const express = require('express');
const LoginRouter = express.Router();
const UserModel = require('../models/user');
const { getHashedPassword } = require('../utils');

const crypto = require('crypto');

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString('hex');
}

LoginRouter.post('/', async (req, res) => {    
    const { username, password } = req.body;

    const hashedPassword = getHashedPassword(password);

    const user = await UserModel.findOne({
      username: username,
      password: hashedPassword,
  });

    if (user) {
        const authToken = generateAuthToken();
        res.send({ token: authToken})
    }
    res.send('error')
});

module.exports = LoginRouter;
