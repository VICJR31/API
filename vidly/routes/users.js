const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');

// const app = express();
const router = express.Router();

// (3/23/22) Auth isn't working, thus far. Can try using 'app' instead of
// 'router' for '.use', below. If not, google error or see if the APIs can
// only access one cors, at a time

//*'cors' was here*

//POST: used for creating/registering new users
router.post('/', async (req, res) => {
    console.log('Users hit')

    //Use Joi validate function, will return a 400 error if name, email, or password isn't right
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message); 
    //if user isn't already register
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    
    //return this custom object to the client
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;

// (1/25/22) Note
// Joi password complexity
//     ---> Good for enforce password complexity!