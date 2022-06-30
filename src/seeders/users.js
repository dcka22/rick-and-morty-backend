const UserModel = require("../models/user");
const utf8 = require("utf8");
const { Base64 } = require("js-base64");
const mongoose = require("mongoose");
const { exit } = require("process");
mongoose.connect("mongodb://localhost:27888/development", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const usersData = [
    {
        username: "username_1",
        password: Base64.encode(utf8.encode("username_1")),
        favoriteCharacters: [1, 7],
    },
    {
        username: "username_2",
        password: Base64.encode(utf8.encode("username_2")),
        favoriteCharacters: [3, 5],
    },
];

const seeder = async () => {
    try {
        await UserModel.deleteMany({});

        for (const userData of usersData) {
            await UserModel.create(userData);
        }

        console.log("seeder complete");
    } catch (err) {
        console.log("Seeder failed", err);
    }
    exit()
};

module.exports = seeder();
