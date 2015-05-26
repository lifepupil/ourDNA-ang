'use strict';

angular.module('ourDna')
.controller('homeCtrl', function($scope, Person){
  $scope.rawtxt = '';

  $scope.getDNAfile = function(dnafile){
    var theFile = dnafile.files[0];
    console.log('dnafile name', theFile.name);
    $scope.theFileName = theFile.name;
    // var reader = new FileReader();
    // reader.onloadend = function(loadEvent){
    //   $scope.$apply(function(){
    //     $scope.rawtxt = loadEvent.target.result;
    //   });
    // };
    // reader.readAsText(theFile);
  };

  $scope.createProfile = function(profile){
    var dataArr = [];

    var dataObj = {
      rsid: '',
      chromosome: '',
      position: 0,
      genotype: ''
    };
    dataArr.push(dataObj);

    var personObj = {
      surName: profile.surName,
      givenName: profile.givenName,
      fileName: $scope.theFileName,
      snpArr: dataArr
    };

    console.log('person: ', personObj);
    Person.addPerson(personObj);

    $('#dnaHome').val('');
    profile.givenName = '';
    profile.surName = '';
  };
});
