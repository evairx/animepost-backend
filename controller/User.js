const UserSchema = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

const addUser = async (req, res) => {
    const { user, email, password, role } = req.body;
    const users = new UserSchema ({
        user,
        email,
        password,
        role
    });

    users.password = await users.encryptPassword(users.password);
    const token = jwt.sign({ id: users._id, role: users.role}, config.secret);
    users.save()
    res.status(200).send({token})
};

module.exports = {addUser,};