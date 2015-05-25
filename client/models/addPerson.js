'use strict';

angular.module('ourDna')
.factory('Person', function($rootScope, $http, nodeUrl){
  function Person(){
  }

  Person.addPerson = function(thisPerson){
    console.log('thisPerson', thisPerson);
    return $http.post(nodeUrl + '/People', thisPerson);
  };

  return Person;
});
