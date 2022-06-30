const UserModel = require('../models/user');
const request = require('supertest')
const app = require('../../server.js')
const mongoose = require("mongoose");
const { exit } = require('process');
mongoose.connect("mongodb://localhost:27888/development", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
jest.setTimeout(30000);
describe('Users endpoint tests', () => {
  test('should add character as favorite', async () => {
    const requestData = {
      username: 'username_1',
      id: 10
    }

    const userBeforeSave = await UserModel.findOne({
      username: requestData.username,
    });
   
    expect(userBeforeSave?.toJSON().favoriteCharacters).toEqual([1, 7]);
    
    request(app)
      .put(`/users/${requestData.username}/characters/${requestData.id}`)
  
    const userAfterSave = await UserModel.findOne({
      username: requestData.username,
    });
   
    expect(userAfterSave?.toJSON().favoriteCharacters).toEqual([1, 7, 10]);
  })
})