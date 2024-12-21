const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const PORT = 3100;

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));
app.use(morgan('dev'));

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`)
});
