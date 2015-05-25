'use strict'

angular.module('ourDna')
.controller('homeCtrl', function($scope, Person){
  $scope.rawtxt;


  $scope.getDNAfile = function(dnafile) {
    var theFile = dnafile.files[0];
    var reader = new FileReader();
    reader.onload = function(loadEvent){
      $scope.$apply(function(){
        $scope.rawtxt = loadEvent.target.result;
      });
    }
    reader.readAsText(theFile);
  }

  $scope.createProfile = function(profile){
    // prevent createProfile from running without DNA file upload
    var dataArr = [];
    var fileStr = $scope.rawtxt;

    $('#dnaHome').val(undefined);
    $scope.rawtxt = '';

    var lineData = fileStr.split('\n');
    for(var i = 0; i < lineData.length; i++){
      if(lineData[i][0] !== '#'){
        var data = lineData[i].split('\t');
        var dataObj = {
          rsid: data[0],
          chromosome: parseInt(data[1]),
          position: parseInt(data[2]),
          genotype: data[3]
        }
        dataArr.push(dataObj);
      }
    };

    var personObj = {
      surName: profile.surName,
      givenName: profile.givenName,
      snpArr: dataArr
    }

    Person.addPerson(personObj);
    // console.log('person', personObj);
    profile.givenName = '';
    profile.surName = '';
  }



});
