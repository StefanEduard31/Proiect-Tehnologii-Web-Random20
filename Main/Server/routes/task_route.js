const { Router } = require("express");
const Task = require("../database/models/task_model");
const taskRouter = require("express").Router();
const {Op} = require("sequelize");

taskRouter.route("/")
.get(async(req, res) => { // Returneaza toate sarcinile
    try{
        const tasks = await Task.findAll();
        if(tasks)
        {
            return res.status(200).json(tasks)
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
.post(async(req, res)=>{ // Creaza o noua sarcina cu datele din body
        try{
            console.log(req.body)
            const newTask = await Task.create(req.body) 
            
            return res.status(200).json(newTask)
        }catch(err)
        {
            return res.status(400).json(err)
        }
})

taskRouter.route("/:id")
.get(async(req, res) => { // Gaseste o sarcina dupa id
    try{
        const task = await Task.findByPk(req.params.id); 
        if(task)
        {
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
.put(async(req, res) => { // Gaseste o sarcina dupa id si o modifica cu datele din body
    try{
        const task = await Task.findByPk(req.params.id); 
        if(task)
        {
            const updatedTask = await task.update(req.body);
            return res.status(200).json(updatedTask)
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



module.exports = taskRouter;
     