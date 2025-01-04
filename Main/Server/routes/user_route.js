const { Router } = require("express");
const bcrypt = require('bcrypt');
const User = require("../database/models/user_model");
const Task = require("../database/models/task_model");
const userRouter = require("express").Router();
const {Op, where} = require("sequelize");

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
                
            /*
            if(newUser.role === "User" && newUser.managerId === null)
            {
                managers = await User.findAll({where:{
                    role: "Manager"
                }
                });
                if(managers.length > 0)
                {
                    const rnd = Math.floor(Math.random() * managers.length);
                    newUser.managerId = managers[rnd].id;
                    await newUser.save();
                }
            }
            d*/

            delete newUser.dataValues.password;
            
            return res.status(200).json(newUser)
        }catch(err)
        {
            return res.status(400).json(err)
        }
})
userRouter.route("/unallocatedUsers")
.get(async(req, res) => { // Gaseste toti utilizatorii care nu sunt asignati unui manager
    try{
        const users = await User.findAll({where:{
            managerId: null
        }});
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
            const uptdatedUser = await user.update(req.body);

            delete uptdatedUser.dataValues.password;

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
            task.status = "Pending";
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

userRouter.route("/:userId/:taskId/allocateTask") // Aloca sarcinile utilizatorului in functie de id
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

userRouter.route("/:userId/:taskId/completeTask") // Marcheaza o sarcina ca fiind completata
.put(async(req, res) => {
    try{
        const user = await User.findByPk(req.params.userId); 
        if(user)
        {
            const task = await Task.findByPk(req.params.taskId); 
            if(task)
            {
                task.status = "Completed";
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

userRouter.route("/:userId/:taskId/closeTask") // Marcheaza o sarcina ca fiind inchisa
.put(async(req, res) => {
    try{
        const user = await User.findByPk(req.params.userId); 
        if(user)
        {
            const task = await Task.findByPk(req.params.taskId); 
            if(task)
            {
                task.status = "Closed";
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

userRouter.route("/:userId/managedUsers") // Gaseste toti utilizatorii care sunt amanejati de un manager
.get(async(req, res) => { 
    try{
        const users = await User.findAll({
            where: {
                managerId: req.params.userId
            }
        });
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

userRouter.route("/:userId/managedUsersTasks") // Gaseste toate sarcinile utilizatorilor care sunt amanejati de un manager
.get(async(req, res) => { 
    try{
        const users = await User.findAll({
            where: {
                managerId: req.params.userId
            }
        });

        const tasks = await Task.findAll({
            where: {
                userId: {
                    [Op.in]: users.map(user => user.id)
                }
            }
        });
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

userRouter.route("/:userId/promote") // Promoveaza un utilizator
.put(async(req, res) => {
    try{
        const user = await User.findByPk(req.params.userId); 
        if(user)
        {
            if(user.role === "User")
                user.role = "Manager";
            else user.role = "Admin";
            await user.save();
            return res.status(200).json(user)
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

userRouter.route("/:userId/demote") // Demoteaza un utilizator
.put(async(req, res) => {
    try{
        const user = await User.findByPk(req.params.userId); 
        if(user)
        {
            if(user.role === "Admin")
                user.role = "Manager";
            else if(user.role === "Manager")
                user.role = "User";
            else return res.status(200).json("User is already a user");
            await user.save();
            return res.status(200).json(user)
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
     