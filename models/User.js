import {Schema, model} from "mongoose";
import bycript from 'bcryptjs';

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [{
        ref: "Role",
	    type: String,
    }],
    views: {
        type: Number,
        default: 0,
    },
    yearsOld: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: false,
    },
    favorites: [{
        id: {
            type: Array,
            required: false,
            default: []
        }
    }]
},{
    timestamps: true,
    versionKey: false,
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bycript.genSalt(10);
    return bycript.hash(password, salt)
};

UserSchema.methods.validatePassword = function (password) {
    return bycript.compare(password, this.password);
}

export default model('User', UserSchema);
