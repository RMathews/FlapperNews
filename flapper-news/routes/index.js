var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/posts', function(req, res, next) {
    Post.find()
        .then(function(posts){
            res.json(posts);
        }, function(err) {
            if(err) { return next(err); }
        });
});

router.post('/posts', function(req, res, next){
    var post = new Post(req.body);

    post.save()
        .then(function (post) {
            res.json(post);
        }, function (err) {
            if(err){ return next(err); }
        });
});

router.param('post', function(req, res, next, id){
   var query = Post.findById(id);

   query.exec()
       .then(function (post){
           req.post = post;

           if (!post) {
               return next(new Error("can\'t find post"));
           }

           return next();
       }, function(err) {
           if(err) {
               return next(err);
           }
       });
});

router.get('/posts/:post', function(req, res){
    res.json(req.post);
});

router.put('/posts/:post/upvote', function(req, res, next){

    req.post.upvote(function(err, post){

        if (err) { return next(err); }
        res.json(post);
    });
});



module.exports = router;
