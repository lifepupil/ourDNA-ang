'use strict';

angular.module('ourDna')
.controller('homeCtrl', function($scope, Person){
  $scope.rawtxt = '';
  $scope.snpResults;
  $scope.snpResultShow = false;


  d3.select("body").style("background-color", "grey");
  // d3.selectAll("p")
  //     .data([4, 8, 15, 16, 23, 42, 50])
  //     .style("font-size", function(d) { return d + "px"; });
  //
  // var section = d3.selectAll('p');
  // var div = section.append('div');
  // div.html('Hello, world!');

  // var data = [4, 8, 15, 16, 23, 42, 50, 100000];
  // var x = d3.scale.linear()
  //   .domain([0, d3.max(data)])
  //   .range([0, 420]);
  //
  // d3.select(".chart")
  // .selectAll("div")
  //   .data(data)
  // .enter().append("div")
  //   .style("width", function(d) { return x(d) + "px"; })
  //   .text(function(d) { return d; });


  var data = [4, 8, 15, 16, 23, 42];
  var chrLength = 100;
  var width = 420,
      barHeight = 20;

  var x = d3.scale.linear()
      .domain([0, chrLength])
      .range([0, width]);

  var chart = d3.select(".chart")
      .attr("width", width)
      .attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      // .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
      .attr("transform", function(d, i) { return "translate("+ barHeight * i + "," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", x)
      .attr("height", barHeight - 1);

  bar.append("text")
      .attr("x", function(d) { return x(d) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d; });




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
