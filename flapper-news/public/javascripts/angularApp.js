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
                controller: 'MainCtrl'
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl'
            });

        $urlRouterProvider.otherwise('home');
    }]);

myApp.controller('MainCtrl', ['$scope', 'postFactory', function ($scope, postFactory) {

    $scope.test = 'Hello World!';
    $scope.posts = postFactory.posts;

    $scope.addPost = function () {
        if ($scope.title === '') {
            return;
        }
        $scope.posts.push({
            title: $scope.title,
            link: $scope.link,
            upvotes: 0,
            comments: [
                {author: 'Joe', body: 'Cool post!', upvotes: 0},
                {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
            ]
        });
        $scope.title = '';
        $scope.link = '';
    };

    $scope.incrementUpvotes = function (post) {
        post.upvotes += 1;
    }
}]);

myApp.controller('PostsCtrl', ['$scope', '$stateParams', 'postFactory',
function($scope, $stateParams, postFactory) {
    $scope.post = postFactory.posts[$stateParams.id];
    $scope.addComment = function(){
        if($scope.body === '') { return;}
        $scope.post.comments.push({
            body: $scope.body,
            author: 'user',
            upvotes: 0
        });
        $scope.body = '';
    };
    $scope.incrementUpvotes = function(comment) {
        comment.upvotes += 1;
    }
}]);

myApp.factory('postFactory', [function () {
    var o = {
        posts: []
    };
    return o;
}]);