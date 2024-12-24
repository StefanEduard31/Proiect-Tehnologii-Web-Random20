const { Router } = require("express");
const User = require("../database/models/user_model");
const userRouter = require("express").Router();
const {Op} = require("sequelize");

userRouter.route("/")
.get(async(req, res) => {
    try{
        const users = await User.findAll();
        if(users)
        {
            return res.status(200).json(users)
        }
        else
        {
            return res.status(200).json("no data found")    
        }
    }catch(err)
    {
        return res.status(400).json(err)
    }
})
.post(async(req, res)=>{
        try{
            console.log(req.body)
            const newUser = await User.create(req.body) // CREARE NOU ANGAJAT
            
            return res.status(200).json(newUser)
        }catch(err)
        {
            return res.status(400).json(err)
        }
})

userRouter.route("/:id")
.get(async(req, res) => {
    try{
        const user = await User.findByPk(req.params.id);
        if(user)
        {
            return res.status(200).json(user)
        }
        else
        {
            return res.status(200).json("no data found")    
        }
    }catch(err)
    {
        return res.status(400).json(err)
    }
})
.put(async(req, res) => {
    try{
        const user = await User.findByPk(req.params.id);
        if(user)
        {
            const uptdatedUser = await user.update(req.body);
            return res.status(200).json(uptdatedUser)
        }
        else
        {
            return res.status(200).json("no data found")    
        }
    }catch(err)
    {
        return res.status(400).json(err)
    }
})



module.exports = userRouter;
     