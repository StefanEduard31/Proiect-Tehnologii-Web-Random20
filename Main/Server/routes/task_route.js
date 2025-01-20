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
            newTask.status = "Open"
            await newTask.save()
            
            return res.status(200).json(newTask)
        }catch(err)
        {
            return res.status(400).json(err)
        }
})


taskRouter.route("/unallocatedTasks") // Returneaza toate sarcinile care nu sunt alocate
.get(async(req, res) => { 
    try{
        const tasks = await Task.findAll({where:{
            userId: null
        }});
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
            updatedTask.status = "Pending"
            await updatedTask.save();
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

taskRouter.route("/assign/:taskId/:userId")
  .put(async (req, res) => {
    try {
        console.log("ceva")
      const task = await Task.findByPk(req.params.taskId);
      if (task) {
        task.userId = req.params.userId;
        task.status = "Pending";
        await task.save();
        return res.status(200).json(task);
      } else {
        return res.status(404).json({ error: "Task not found" });
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  });
taskRouter.route("/:id/complete")
  .put(async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (task) {
        task.status = "Completed";
        await task.save();
        return res.status(200).json(task);
      } else {
        return res.status(404).json({ error: "Task not found" });
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  });

  taskRouter.route("/:id/close")
  .put(async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (task) {
        task.status = "Closed";
        await task.save();
        return res.status(200).json(task);
      } else {
        return res.status(404).json({ error: "Task not found" });
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  });


module.exports = taskRouter;
     