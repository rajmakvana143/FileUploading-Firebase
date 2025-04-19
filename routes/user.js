const express = require('express');
const router = express.Router();
const { query , body , validationResult } = require('express-validator');


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
    (req , res) => {

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    res.send('User Registered Successfully!');
});


module.exports = router;