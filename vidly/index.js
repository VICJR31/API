//  Authentication
//  Authorization

//  Register: POST /api/users {name, email, password}
//  Login: POST /api/logins
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const users = require('./routes/users');
const auth = require('./routes/auth');
let bodyParser = require('body-parser');
const express = require('express');

const app = express();

const cors = require("cors");

app.use(
    cors({
        // : "http://localhost:8100",
        origin: '*',
    })
)

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost/vidly2')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));


app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));