'use strict';

angular.module('ourDna')
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {url: '/', templateUrl: '/views/general/home.html', controller: 'homeCtrl'})
  .state('snpOne', {url: '/snpOne', templateUrl: '/views/general/snpOne.html', controller: 'homeCtrl'})
  .state('snpMany', {url: '/snpMany', templateUrl: '/views/general/snpMany.html', controller: 'homeCtrl'})
  .state('about', {url: '/about', templateUrl: '/views/general/about.html'})
  .state('faq', {url: '/faq', templateUrl: '/views/general/faq.html'})
  .state('contact', {url: '/contact', templateUrl: '/views/general/contact.html'})
  .state('register', {url: '/register', templateUrl: '/views/users/users.html', controller: 'UsersCtrl'})
  .state('login', {url: '/login', templateUrl: '/views/users/users.html', controller: 'UsersCtrl'});
});
