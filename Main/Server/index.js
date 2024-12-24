const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./database/sequelize');
const taskRouter = require('./routes/task_route');
const userRouter = require('./routes/user_route');
const app = express();
dotenv.config()

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));
app.use(morgan('dev'));

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use("/tasks", taskRouter) 
app.use("/users", userRouter) 

app.listen(PORT, async () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`)
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
