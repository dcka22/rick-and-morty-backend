const { Schema, mongoose } = require('mongoose');
const { getHashedPassword } = require('../utils');

const UserSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        favoriteCharacters: [Number]
    },
    { timestamps: true }
);

UserSchema.pre('save', async function (next) {
    let user = this;

    if (!user.isModified('password')) {
        return next();
    }

    try {
        user.password = getHashedPassword(user.password);

        return next();
    } catch (e) {
        return next(e);
    }

})

UserSchema.methods.toJSON = function () {
    const jsonObject = this.toObject();
    delete jsonObject.__v;
    jsonObject.id = jsonObject._id;
    delete jsonObject._id;
    return jsonObject;
};

module.exports = mongoose.model('User', UserSchema);