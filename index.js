const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/librarymanagement');
const db = mongoose.connection;
db.once('open', () => console.log('Mongoose connected'));
require('./routes/index')(app)
const port = 8080;
app.listen(port, () => console.log(`port is working`));



