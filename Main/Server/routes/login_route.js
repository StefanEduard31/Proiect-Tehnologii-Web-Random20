const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../database/models/user_model");
const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            where: {
                username: username
            }
        })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found", data: {} });
        }

        const validPassword = bcrypt.compareSync(password, user.dataValues.password);

        if (!validPassword) {
            return res.status(400).json({ success: false, message: "Incorrect password", data: {} });
        }

        const token = jwt.sign({ id: user.dataValues.id }, process.env.TOKEN_SECRET, {
            expiresIn: '1h'
        })

        return res.status(200).json({ success: true, message: "Login succesful", data: { token } });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
})

loginRouter.post('/check', async(req, res) =>{
    const token = req.body.token;

    if(!token)
    {
        return res.status(400).json({success: false, message: 'Token not found'})
    }
})

module.exports = loginRouter;