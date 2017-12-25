const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var emailCheck = require('email-check');
const config = require('../config/database');

//********* DB Models *********
const User = require('../models/user');


//********* Routes *********

//Register Form
router.get('/register', (req, res)=>{
    res.render("register");
});

//News
router.get('/news', (req, res)=>{
    res.render("news");
});

//Gallery
router.get('/gallery', (req, res)=>{
    res.render("gallery");
});

//Game
router.get('/game', (req, res)=>{
    res.render("game");
});

//Instruction
router.get('/instruction', (req, res)=>{
    res.render("instruction");
});



// Register Form Post
router.post('/register', (req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
  

    req.checkBody('name',  'Name is required').notEmpty();
    req.checkBody('email',  'Name is required').notEmpty();
    req.checkBody('email',  'Name is invalid').isEmail();
    req.checkBody('username',  'Username is required').notEmpty();
    req.checkBody('password',  'Password is required').notEmpty();
    req.checkBody('password2',  'Password do not match').equals(password);

    const errors = req.validationErrors();
    if(errors){

        req.flash('success',  'Please confirm your password!');
        res.redirect('/users/register');
    }else{


        // create a new user
        const newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });


        // Check if email or username already exists
        User.find({$or: [{email: email}, {username: username}]}, (err, user)=>{
            console.log(user);
            if(err) throw err;
            if(user == ""){


                // encrypt password
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err){console.log(err)}
                        else{
                            newUser.password = hash;
                            newUser.save((err)=> {
                                if(err){ console.log(err); res.redirect('/');}
                                else{
                                    req.flash('success',  'You are now register and can login.');
                                    res.redirect('/users/login');
                                }
                            });
                        }
                    });
                });
            }
            else {
                req.flash('success',  'Your email or username already exists.');
                res.redirect('/users/register');
            }
        });
    }
});


// Login Route
router.get('/login', (req, res)=>{
    res.render('login');
});


// Login Process
router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Route
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('sucess', 'You are logout');
    res.redirect('/users/login');
});


// *********** Export Router ***********
module.exports = router;