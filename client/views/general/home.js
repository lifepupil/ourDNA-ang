'use strict'

angular.module('ourDna')
.controller('homeCtrl', function($scope){
  $scope.profile = {};
  $scope.rawtxt;
  $scope.family = [];

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
          chromosome: data[1],
          position: data[2],
          genotype: data[3]
        }
        dataArr.push(dataObj);
      }
    };
    profile.dna = dataArr;
    $scope.family.push(profile);
    profile.name = '';
    console.log('family', $scope.family);
  }



});
