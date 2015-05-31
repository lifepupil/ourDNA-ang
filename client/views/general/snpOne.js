'use strict';

angular.module('ourDna')
.controller('homeCtrl', function($scope, Person){
  $scope.rawtxt = '';
  $scope.snpResults;
  $scope.snpResultShow = false;
  // d3.select("body").style("background-color", "grey");

  // VALUES BELOW TAKEN FROM http://en.wikipedia.org/wiki/Human_genome
  var chromosomeInfo = [
    ['1', 249250621, 125.0],
    ['2', 243199373, 93.3],
    ['3', 243199373, 91.0],
    ['4', 191154276, 50.4],
    ['5', 180915260, 48.4],
    ['6', 171115067, 61.0],
    ['7', 159138663, 59.9],
    ['8', 146364022, 45.6],
    ['9', 141213431, 49.0],
    ['10', 135534747, 40.2],
    ['11', 135006516, 53.72],
    ['12', 133851895, 35.8],
    ['13', 115169878, 17.9],
    ['14', 1073495408, 17.6],
    ['15', 1025313928, 19.6],
    ['16', 90354753, 36.6],
    ['17', 81195210, 24.0],
    ['18', 78077248, 17.20],
    ['19', 59128983, 26.5],
    ['20', 63025520, 27.5],
    ['21', 48129895, 13.2],
    ['22', 51304566, 14.7],
    ['X', 155270560, 60.6],
    ['Y', 59373566, 12.5],
    ['mtDNA', 16569, 0]
  ];






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
          position: response.data[i].chrom[0].position,
          sex: response.data[i].sex,
          chromosomeId: response.data[i].chromosomeId
        }
        snpArr.push(snpObj);
      }

      $scope.snpResults = snpArr;
      var chromIndex = 0;
      for(var i = 0; i < chromosomeInfo.length; i++){
        if(chromosomeInfo[i][0] === $scope.snpResults[0].chromosomeId){
          chromIndex = i;
        }
      }

      var chromosomeLength = chromosomeInfo[chromIndex][1];
      var p_endPos = chromosomeInfo[chromIndex][2] * 1000000;
      var q_endPos = chromosomeLength - p_endPos;
      var chomosomeArms = [
        [0, p_endPos],
        [p_endPos + 1, q_endPos]
      ];

      d3.selectAll("svg > *").remove();
      $scope.thisChromosome = chromosomeInfo[chromIndex][0];
      $scope.thisChromosomeLength = chromosomeInfo[chromIndex][1];

      var dataset = [[$scope.snpResults[0].position, 100000]]
      var w = 1100;
      var h = 100;
      var svg = d3.select(".chromosomeView")
          .append("svg")
          .attr("width", w)
          .attr("height", h);

      var xScale = d3.scale.linear()
         .domain([0, chromosomeLength])
         .range([0, w]);

      var ctGroup = svg.append('g');
      var snpGroup = svg.append('g');

      ctGroup.selectAll("chromosomeTails")
         .data(chomosomeArms)
        .enter()
         .append("rect")
           .attr("x", function(d, i){ return xScale(d[0]); })
           .attr("y", 1)
           .attr('rx', 20)
           .attr('ry', 20)
           .attr("width", function(d, i){ return xScale(d[1]); })
           .attr("height", h - 2)
           .style('fill', 'white')
           .style('stroke', 'black')
           .style('stroke-width', 5)

      snpGroup.selectAll("snps")
         .data(dataset)
        .enter()
         .append("rect")
           .attr("x", function(d, i){ return xScale(d[0]); })
           .attr("y", 1)
           .attr("width", function(d, i){ return xScale(d[1]); })
           .attr("height", h - 2)
           .style('fill', 'red')
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
