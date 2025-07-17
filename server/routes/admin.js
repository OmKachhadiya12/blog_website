const express = require('express');
const router = express.Router();
const Post = require('./../models/post');
const User = require('./../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const adminLayout = './../views/layouts/admin';

const authMiddleware = (req,res,next) => {
    const token = req.cookie.token;
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    try{
        const decoded = jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
    }catch(err){
        return res.status(401).json({message: 'Unauthorized'});
    }
}

router.get('/admin',async(req,res) => {
    try{
        const locals = {
            title: 'Admin'
        }

        res.render('admin/index',{locals,layout: adminLayout});

    }catch(err){
        console.log(err);
    }
});


router.post('/admin',async(req,res) => {
    try{    
        const {username,password} = req.body;

        const user = await User.find({username});
        if(!user){
            return res.status(401).json({message: 'Invalid Username or Password'});
        }

        const isPasswordValid = await bcrypt.compare(password.user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: 'Invalid Username or Password'});
        }

        const token = jwt.sign({userId: user._id},jwtSecret);
        res.cookie('token',token,{httpOnly: true});

        res.redirect('/dashboard');

    }catch(err){
        console.log(err)
    }
});


router.post('/register',async(req,res) => {
    try{    
        const {username,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({username,password: hashedPassword});
        res.status(201).json({message: 'User created!!',user});

    }catch(err){
        console.log(err)
    }
});

router.get('/dashboard',async(req,res) => {
    try{
        const locals = {
            title: 'Dashboard',
            description: 'Simple Blog created using Nodejs,Express and MongoDB'
        }
        const data = await Post.find();
            
        res.render('admin/dashboard',{locals,data,layout: adminLayout})

    }catch(err){
        console.log(err);
    }
});

router.get('/add-post',async(req,res) => {
    try{
        const locals = {
            title: 'Add-Post',
            description: 'Simple Blog created using Nodejs,Express and MongoDB'
        }
        const data = await Post.find();
            
        res.render('admin/dashboard',{locals,data,layout: adminLayout})

    }catch(err){
        console.log(err);
    }
});

router.post('/add-post',async(req,res) => {
    try{            
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body
        });

        await Post.create(newPost);
        res.dashboard('/dashboard')

    }catch(err){
        console.log(err);
    }
});

router.get('/edit-post/:id',async(req,res) => {
    try{
        const locals = {
            title: 'Edit-Post',
            description: 'Simple Blog created using Nodejs,Express and MongoDB'
        }

        const data = await Post.findOne({_id: req.params.id});
        res.render('admin/edit-post',{ locals,data,layout: adminLayout})
        
    }catch(err){
        console.log(err);
    }
});

router.put('/edit-post/:id',async(req,res) => {
    try{
        await Post.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        
        res.redirect(`/edit-post/${req.params.id}`)

    }catch(err){
        console.log(err);
    }
});

router.delete('/delete-post/:id',async(req,res) => {
    try{
        await Post.deleteOne({_id: req.params.id});
        res.redirect('/dashboard');
    }catch(err){
        console.log(err);
    }
});

router.get('/logout',(req,res) => {
    res.clearCookie('token');
    //res.json({message: 'Logout sucessfully'});
    res.redirect('/');
});

module.exports = router;