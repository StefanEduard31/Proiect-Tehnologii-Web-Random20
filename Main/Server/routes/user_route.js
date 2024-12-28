const { Router } = require("express");
const bcrypt = require('bcrypt');
const User = require("../database/models/user_model");
const Task = require("../database/models/task_model");
const userRouter = require("express").Router();
const {Op} = require("sequelize");

User.hasMany(Task , {foreignKey: 'userId', sourceKey: 'id'});

const BCRYPT_SALT = process.env.BCRYPT_SALT;

userRouter.route("/")
.get(async(req, res) => { // Gaseste toti utilizatorii
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
.post(async(req, res)=>{ // Creaza un nou utilizator cu datele din body
        try{
            const salt = bcrypt.genSaltSync(BCRYPT_SALT);
            const hash = bcrypt.hashSync(req.body.password, salt);
            req.body.password = hash; // Cripteaza parola utilizatorului
            const newUser = await User.create(req.body) 
            
            return res.status(200).json(newUser)
        }catch(err)
        {
            return res.status(400).json(err)
        }
})

userRouter.route("/:id")
.get(async(req, res) => { // Gaseste un utilizator in functie de id
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
.put(async(req, res) => { // Gaseste si modifica un utilizator in functie de id cu datele din body
    try{
        const user = await User.findByPk(req.params.id); // Cautare in functie de cheie primara
        if(user)
        {
            req.body.password = user.password;
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

userRouter.route("/:id/tasks") // Obtine toate sarcinile utilizatorului in functie de id
.get(async(req, res) => { 
    try{
        const user = await User.findByPk(req.params.id, {
            include: [Task]
        });
        if(user)
        {
            return res.status(200).json(user.Tasks)
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

userRouter.route("/:id/assignTask") // Asigneaza o sarcina utilizatorului in functie de id
.post(async(req, res) => { 
    try{
        const user = await User.findByPk(req.params.id);
        if(user)
        {
            const task = await Task.create(req.body);
            task.userId = user.id;
            await task.save();
            return res.status(200).json(task)
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

userRouter.route("/:userId/:taskId/allocate") // Aloca sarcinile utilizatorului in functie de id
.put(async(req, res) => {
    try{
        const user = await User.findByPk(req.params.userId); 
        if(user)
        {
            const task = await Task.findByPk(req.params.taskId); 
            if(task)
            {
                task.userId = user.id;
                task.status = "Pending";
                await task.save();
                return res.status(200).json(task)
            }
            else
            {
                return res.status(200).json("no data found")    
            }
        }
        else
        {
            return res.status(200).json("no data found")
        }
    }
    catch(err)
    {
        return res.status(400).json(err)
    }

})   

 

module.exports = userRouter;
     