const express = require('express');
const router = express.Router();
const { query , body , validationResult } = require('express-validator');
const  User =  require('../model/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get('/' , (req , res) => {
    res.render('index.ejs');
});

router.get('/register' ,(req , res) => {
        res.render('register.ejs');
});

router.post('/register' ,
    body('username').trim(),
    body('email').trim().isEmail().isLength({min : 5}),
    body('password').trim().isLength({min : 5}).withMessage('Password must be at least 5 characters long'),
    async (req , res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username , email , password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username : username,
        email : email,
        password : hashedPassword,
    });

    res.json(newUser)

    // res.send('User Registered Successfully!');
});



router.get('/login' ,(req , res) => {
    res.render('login.ejs');
});

router.post('/login' ,
    body('username').trim(),
    body('password').trim().notEmpty().withMessage('Password is required'),
    async (req , res) => {
    const {username , password} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({username : username});
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const isMatch  =  await bcrypt.compare(password , user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({
        id : user._id,
        username : user.username,
        email : user.email,
    },
    process.env.JWT_SECRET
    );

    res.cookie('token' , token);
    res.send('Login Successful!');
});



module.exports = router;