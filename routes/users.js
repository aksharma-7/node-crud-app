const express = require('express');
const user = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//bring in Article Model
let User = require('../models/user');


//Register Form

router.get('/register', (req, res) => {
    res.render('register');
});


router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) {
                    console.log(err)
                }
                newUser.password = hash;
                newUser.save((err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        req.flash('success', 'You are now registered and can login');
                        res.redirect('/users/login');
                    }
                })
            });
        });
    }

});


//Login Form
router.get('/login', (req, res) => {
    res.render('login');
});

//Login Process
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});


module.exports = router