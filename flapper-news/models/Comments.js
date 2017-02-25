/**
 * Created by revon on 2/19/17.
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var CommentSchema = new mongoose.Schema({
    author: String,
    body: String,
    upvotes: {type: Number, default: 0},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

CommentSchema.methods.upvote = function(callback){
    this.upvotes += 1;
    this.save(callback);
};

mongoose.model('Comment', CommentSchema);