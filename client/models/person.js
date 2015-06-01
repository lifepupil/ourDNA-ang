'use strict';

angular.module('ourDna')
.factory('Person', function($rootScope, $http, nodeUrl){
  function Person(){
  }

  Person.addPerson = function(thisPerson){
    return $http.post(nodeUrl + '/people', thisPerson);
  };


  Person.GET_Genotype = function(thisSNPid){
    console.log('inside the factory GET_Genotype', thisSNPid);
    return $http.get(nodeUrl + '/people/' + thisSNPid);
  }

  Person.GET_Chromosome = function(thisChrom){
    console.log('inside the factory GET_Chromosome', thisChrom);
    return $http.get(nodeUrl + '/people/chromosomeId/' + thisChrom );
  }

  return Person;
});
