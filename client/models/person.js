'use strict';

angular.module('ourDna')
.factory('Person', function($rootScope, $http, nodeUrl){
  function Person(){
  }

  Person.addPerson = function(thisPerson){
    // console.log(JSON.stringify(thisPerson.snpArr[0]));
    // console.log('thisPerson', thisPerson);
    return $http.post(nodeUrl + '/people', thisPerson);
  };

  return Person;
});
