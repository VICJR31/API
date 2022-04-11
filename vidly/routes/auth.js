const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//POST: used for creating/registering new users
router.post('/', async (req, res) => {
    //Use Joi validate function, will return a 400 error if name, email, or password isn't right
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message); 
  
    //if user isn't already register
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    res.send(true);
    // (2/8/22) Edit to check
    console.log('HIT!!! User Created');
});

// Validate function (validate User)
function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;