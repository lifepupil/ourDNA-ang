'use strict';

angular.module('ourDna')
.controller('homeCtrl', function($scope, Person){
  $scope.rawtxt = '';
  $scope.snpResults;
  $scope.snpResultShow = false;


  d3.select("body").style("background-color", "grey");
  var chromosomeLength = 26000000;
  var p_endPos = 6000000;
  var q_endPos = chromosomeLength - p_endPos;
  var chomosomeArms = [
    [0, p_endPos],
    [p_endPos + 1, q_endPos]
  ];

  var dataset = [
                  [ 50000,     20000 ],
                  [ 450000,    41000 ],
                  [ 1050000,   32000 ],
                  [ 2200000,   13000 ],
                  [ 2500000,   54000 ],
                  [ 3300000,   75000 ],
                  [ 4100000,   16000 ],
                  [ 4750000,   67000 ],
                  [ 5800000,   68000 ],
                  [ 7800000,   29000 ],
                  [ 8800000,   60000 ],
                  [ 11880000,   61000 ],
                  [ 25000000,   600000 ]
              ];
  var w = 1100;
  var h = 100;
  var svg = d3.select(".chromosomeView")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

  var xScale = d3.scale.linear()
     .domain([0, chromosomeLength])
     .range([0, w]);

  svg.selectAll("chromosomeTails")
     .data(chomosomeArms)
    .enter()
     .append("rect")
       .attr("x", function(d, i){ return xScale(d[0]); })
       .attr("y", 1)
       .attr('rx', 20)
       .attr('ry', 20)
       .attr("width", function(d, i){ return xScale(d[1]); })
       .attr("height", h - 2)

  svg.selectAll("snps")
     .data(dataset)
    .enter()
     .append("rect")
       .attr("x", function(d, i){ return xScale(d[0]); })
       .attr("y", 1)
       .attr("width", function(d, i){ return xScale(d[1]); })
       .attr("height", h - 2);






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
