'use strict';

angular.module('ourDna')
.controller('homeCtrl', function($scope, Person){
  $scope.rawtxt = '';
  $scope.snpResults;
  $scope.snpResultShow = false;


  d3.select("body").style("background-color", "grey");

  var dataset = [
                  [ 50,     20 ],
                  [ 450,    41 ],
                  [ 1050,   32 ],
                  [ 2200,   13 ],
                  [ 2500,   54 ],
                  [ 3300,   75 ],
                  [ 4100,   16 ],
                  [ 4750,   67 ],
                  [ 5800,   68 ],
                  [ 7800,   29 ],
                  [ 8800,   60 ],
                  [ 11880,   61 ],
                  [ 18000,   1000 ]
              ];
  var w = 1100;
  var h = 200;
  var svg = d3.select(".chromosomeView")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

  var xScale = d3.scale.linear()
                       .domain([0, 25000])
                       .range([0, w]);

  svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("x", function(d, i){
       return xScale(d[0]);
     })
     .attr("y", 1)
     .attr("width", function(d, i){ return d[1]; })
     .attr("width", function(d, i){ return xScale(d[1]); })
     .attr("height", 100)
     .text('hi');







//~~~~~~~~~~~~~~~~

  $scope.getGenotype = function(snp_id){
    console.log('inside the controller get getGenotype');
    Person.GET_Genotype(snp_id)
    .then(function(response){
      $scope.snpResultShow = true;
      var t = response.data[0].chrom[0].genotype;
      var snpArr = [];
      console.log('rs info returned', t);

      var snpObj = {};

      for(var i = 0; i < response.data.length; i++){
        snpObj = {
          firstName: response.data[i].givenName,
          lastName: response.data[i].surName,
          genotype: response.data[i].chrom[0].genotype,
          sex: response.data[i].sex,
          chromosomeId: response.data[i].chromosomeId
        }
        snpArr.push(snpObj);
      }

      $scope.snpResults = snpArr;
      var str = 'CLICK HERE'
      var x = "Rs4680";
      var result = str.link("http://www.snpedia.com/index.php/"+ x);
      document.getElementById("demo").innerHTML = result;
    });
  }

  $scope.getDNAfile = function(dnafile){
    var theFile = dnafile.files[0];
    // console.log('dnafile name', theFile.name);
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
      sex: profile.sex,
      fileName: $scope.theFileName,
      snpArr: dataArr
    };

    console.log('person: ', personObj);
    Person.addPerson(personObj);

    // $('#dnaHome').val('');
    // profile.givenName = '';
    // profile.surName = '';
    // profile.sex = '';
  };
});
