'use strict';

angular.module('ourDna')
.factory('Person', function($rootScope, $http, nodeUrl){
  function Person(){
  }

  Person.addPerson = function(thisPerson){
    return $http.post(nodeUrl + '/people', thisPerson);
  };


  Person.GET_Genotype = function(thisSNPid){
    console.log('inside the factory get GET_Genotype', thisSNPid);
    return $http.get(nodeUrl + '/people/' + thisSNPid);
  }

  return Person;
});
