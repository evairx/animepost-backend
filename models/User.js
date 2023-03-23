const {Schema, model} = require('mongoose');
const bycript = require('bcryptjs');

const UserSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'premium', 'admin'],
        default: 'user'
    }
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bycript.genSalt(10);
    return bycript.hash(password, salt)
};

UserSchema.methods.validatePassword = function (password) {
    return bycript.compare(password, this.password);
}

module.exports = model('User', UserSchema);
