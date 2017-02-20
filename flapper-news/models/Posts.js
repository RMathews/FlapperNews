/**
 * Created by revon on 2/19/17.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var PostSchema = new mongoose.Schema({

    title: String,
    link: String,
    upvotes: {type: Number, default: 0},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

PostSchema.methods.upvote = function(callback){
    this.upvotes += 1;
    this.save(callback);
};

mongoose.model('Post', PostSchema);