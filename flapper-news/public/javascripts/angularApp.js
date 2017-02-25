/* Created by revon on 2/4/17. */

var myApp = angular.module('flapperNews', ['ui.router'])

myApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                resolve: {
                    homePromise: ['postFactory', function(postFactory){
                        return postFactory.getAll();
                    }]
                }
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl',
                resolve: {
                    postPromise: ['$stateParams', 'postFactory', function($stateParams, postFactory){
                        return postFactory.getPost($stateParams.id);
                    }]
                }
            });

        $urlRouterProvider.otherwise('home');
    }]);

myApp.controller('MainCtrl', ['$scope', 'postFactory', function ($scope, postFactory) {

    $scope.test = 'Hello World!';
    $scope.posts = postFactory.posts;

    $scope.addPost = function () {
        if (!$scope.title || $scope.title === '') { return; }
        postFactory.create({
            title: $scope.title,
            link: $scope.link
        });
        $scope.title = '';
        $scope.link = '';
    };

    $scope.incrementUpvotes = function (post) {
        postFactory.upvotePost(post);
    };
}]);

myApp.controller('PostsCtrl', ['$scope', 'postPromise', 'postFactory',
function($scope, postPromise, postFactory) {
    $scope.post = postPromise;
    $scope.addComment = function(){
        if($scope.body === '') { return;}
        postFactory.addComment(postPromise._id, {
            author: 'user',
            body: $scope.body
        }).success(function (comment) {
            $scope.post.comments.push(comment);
        });
        $scope.body = '';
    };
    $scope.incrementUpvotes = function(comment) {
        postFactory.upvoteComment(postPromise, comment);
    }
}]);

myApp.factory('postFactory', ['$http', function ($http) {
    var o = {
        posts: []
    };
    o.getAll = function() {
        return $http.get('/posts').success(function(data){
            angular.copy(data, o.posts);
        });
    };
    o.create = function(post) {
        return $http.post('/posts', post).success(function (data){
            o.posts.push(data);
        });
    };
    o.upvotePost = function(post){
        return $http.put('/posts/'+ post._id +'/upvote', {} ).success(function (data){
            post.upvotes += 1;
        });
    };
    o.getPost = function(id) {
        return $http.get('/posts_detail/' + id).then(function (res) {
            return res.data;
        });
    };
    o.addComment = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment);
    };
    o.upvoteComment = function(post, comment) {
        $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', {})
            .success(function(data) {
                comment.upvotes += 1;
            });
    };
    return o;
}]);