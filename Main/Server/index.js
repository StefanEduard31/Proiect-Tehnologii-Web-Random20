const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./database/sequelize');
const taskRouter = require('./routes/task_route');
const userRouter = require('./routes/user_route');
const loginRouter = require('./routes/login_route');
const app = express();
dotenv.config()

const PORT = process.env.PORT || 3000;  // Portul pe care ruleaza serverul

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));
app.use(morgan('dev')); 

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); // Middleware pentru a putea folosi JSON
app.use("/login", loginRouter) // Ruter pentru utilizatori
app.use("/users", userRouter) // Ruter pentru utilizatori
app.use("/tasks", taskRouter) // Ruter pentru sarcinii

app.listen(PORT, async () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`)
    try {
        await sequelize.authenticate(); // Realizarea conexiunii cu baza de date
        console.log('Connection has been established successfully.');
    }catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
