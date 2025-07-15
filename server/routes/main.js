const express = require('express');
const router = express.Router();
const Post = require('./../models/post');

router.get('',async(req,res) => {
    try{
        const locals = {
            title: 'Blog Website',
            description: 'Simple Blog created using Nodejs,Express and MongoDB'
        }
        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: {createdAt: -1} }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index',{
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });
    }catch(err){
        console.log(err)
    }
});

router.get('/post/:id',async(req,res) => {
    try{
        let slug = req.params.id;
        const data = await Post.findById({_id: slug});

        const locals = {
            title: data.title,
            description: 'Simple Blog created using Nodejs,Express and MongoDB'
        }

        res.render('post',{local,data});

    }catch(err){
        console.log(err);
    }
});

router.post('/search',async(req,res) => {
    try{
        const locals = {
            title: 'Search',
            description: 'Simple Blog created using Nodejs,Express and MongoDB'
        }
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find({
            $or: [
                {title: { $regex: new RegExp(searchNoSpecialChar,'i')}},
                {body: { $regex: new RegExp(searchNoSpecialChar,'i')}}
            ]
        });

        res.render('search',{ locals,data});

    }catch(err){
        console.log(err);
    }
})

module.exports = router;