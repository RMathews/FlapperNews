var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET ALL POSTS
router.get('/posts', function(req, res, next) {
    Post.find()
        .then(function(posts){
            res.json(posts);
        }, function(err) {
            if(err) { return next(err); }
        });
});

// CREATE POST
router.post('/posts', function(req, res, next){
    var post = new Post(req.body);

    post.save()
        .then(function (post) {
            res.json(post);
        }, function (err) {
            if(err){ return next(err); }
        });
});

// FIND POST BY ID
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
           if(err) { return next(err); }
       });
});

// GET POST BY ID
router.get('/posts/:post', function(req, res){
    res.json(req.post);
});

// UPVOTE POST
router.put('/posts/:post/upvote', function(req, res, next){

    req.post.upvote(function(err, post){

        if (err) { return next(err); }
        res.json(post);
    });
});

// DELETE POST AND IT'S COMMENTS BY POST ID
router.delete('/posts/:post_id', function(req, res, next) {

    Post.findById(req.params.post_id, function (err, post) {
        if (err) {return next(err); }
        if (!post) {return res.send(404); }
        for(var i=0; i<post.comments.length; i++){
            Comment.remove({_id : post.comments[i]}).exec();
        };
        post.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
});

// CREATE COMMENT (BY POST)
router.post('/posts/:post/comments', function(req, res, next){

    var comment = new Comment(req.body);
    comment.post = req.post._id;

    comment.save()
        .then(function(comment){
            req.post.comments.push(comment);
            req.post.save()
                .then(function (post){
                }, function (err) {
                   if (err) {return next(err); }
                });
            res.json(comment);
        }, function (err){
            if (err) {return next (err); }
        });
});

// GET ALL COMMENTS
router.get('/comments', function (req, res, next){
    Comment.find()
        .then(function (comments) {
            res.json(comments)
        }, function (err) {
            if (err) {return next(err); }
        });
});

// GET COMMENT BY COMMENT ID
router.param('comment', function(req, res, next, id){
    var query = Comment.findById(id);

    query.exec()
        .then(function (comment){
            req.comment = comment;
            if(!comment) {
                return next(new Error("can\'t find comment"));
            }
            return next();
        }, function (err){
            if (err) {return next(err)};
        });
});

// UPVOTE COMMENT
router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {

    req.comment.upvote( function (err, comment) {
        if(err) { return next(err); }
        res.json(comment);
    });
});

// GET ALL POSTS DETAILED
router.get('/posts_detail/:post', function (req, res, next){
   req.post.populate('comments', function (err, post) {
       if(err) {return next (err); }
       res.json(post);
   });
});


module.exports = router;
