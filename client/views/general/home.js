'use strict';

angular.module('ourDna')
.controller('homeCtrl', function($scope, Person, $sce, $state){
  $scope.rawtxt = '';
  $scope.snpResults;
  $scope.snpResultShow = false;
  $scope.chromosomeNames = [];
  $scope.snpediaUrl = '';
  $scope.dancingChrom = 'assets/dancingChrom.png';
  $scope.circleDance = 'assets/circledance.jpg';
  $scope.dnaAnimation = 'assets/dna_animation.gif';
  $scope.humanKaryotype = 'assets/chromToDNA.jpg';
  $scope.Logo23andme = 'assets/23andMe_logo.png';
  // d3.select("body").style("background-color", "grey");
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
    ['MT', 16569, 0]
  ];
  var totalBasePairs = 0;
  for(var i = 0; i < chromosomeInfo.length; i++){
    $scope.chromosomeNames.push(chromosomeInfo[i][0]);
    totalBasePairs += chromosomeInfo[i][1];
  }
  console.log('totalBasePairs', totalBasePairs);




//~~~~~~~~~~~~~~~~

  $scope.startourDNA = function(){
      $state.go('addGenomicProfile');
    };

  $scope.getGenotype = function(snp_id){
    console.log('inside the controller get getGenotype');
    Person.GET_Genotype(snp_id)
    .then(function(response){
      var snpRs = snp_id.replace(/r/g, 'R');
      console.log(snpRs);
      $scope.snpediaUrl = $sce.trustAsResourceUrl('http://www.snpedia.com/index.php/' + snpRs);
      $scope.snpResultShow = true;
      $scope.snpResults = personTableData(response);
      var chromIndex = whichChrom();
      var snpWidth = chromosomeInfo[chromIndex][1]/1000;
      var dataset = [[$scope.snpResults[0].position, snpWidth]];
      displaySNPs(dataset, chromIndex);
    });
  };

  $scope.compareChromosomes = function(selectedChromosome){
    console.log('inside the home ctrler for compareChromosomes');
    Person.GET_Chromosome(selectedChromosome)
    .then(function(response){
      $scope.snpResultShow = true;
      $scope.snpResults = personTableData(response);
      var chromIndex = whichChrom();
      var snpWidth = chromosomeInfo[chromIndex][1]/50000;
      var dataset = [];
      var colorComps = compareSnps(response);
        console.log('colorComps', colorComps);
      dataset = prepSNPs(response, snpWidth, colorComps);
      displaySNPs(dataset, chromIndex);
    });
  };

  function compareSnps(response){
    var person1 = response.data[0].chrom;
    var person2 = response.data[1].chrom;
    var comparisonArr = [];
    var thisComparison = '';
    var p1Genotype;
    var p2Genotype;

    console.log('genotypes - person1:', person1[0].genotype, ' person2: ', person2[0].genotype);
    for(var i = 0; i < response.data[0].chrom.length; i++){
      var baseFilter = /^[ATCG][ATGC]?/;
      // console.log('baseFilter.exec(person1[i].genotype) ', baseFilter.exec(person1[i].genotype));
      p1Genotype = (baseFilter.exec(person1[i].genotype) === null) ? undefined : person1[i].genotype;
      p2Genotype = (baseFilter.exec(person2[i].genotype) === null) ? undefined : person2[i].genotype;

      thisComparison = 'grey';
      if(p1Genotype && p2Genotype){
        if(p1Genotype === p2Genotype){
          // console.log('p1Genotype:', p1Genotype, ' p2Genotype:', p2Genotype);
          thisComparison = 'green';
        } else {
          thisComparison = 'red';
        }
      }
      comparisonArr.push(thisComparison);
    }
    return comparisonArr;
  };

  function prepSNPs(response ,snpWidth, colorComps){
    var snpArr = [];
    var snp;
    for(var i = 0; i < response.data[0].chrom.length; i++){
      snp = [response.data[0].chrom[i].position, snpWidth, colorComps[i]];
      snpArr.push(snp);
    }
    console.log('about to exit prepSNPs - snpArr[0][0] ', snpArr[0][0], 'colorComps[0] ', colorComps[0]);
    return snpArr;
  };

  function personTableData(response){
    var snpArr = [];
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
    return snpArr;
  };

  function whichChrom(){
    var chromIndex = 0;
    for(var i = 0; i < chromosomeInfo.length; i++){
      if(chromosomeInfo[i][0] === $scope.snpResults[0].chromosomeId){
        return i;
      }
    }
  };

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

    $('#dnaHome').val('');
    profile.givenName = '';
    profile.surName = '';
    profile.sex = '';
  };

  function displaySNPs(dataset, chromIndex){
    console.log('displaySNPs test - dataset[0] ', dataset[0]);
    d3.selectAll("svg > *").remove();
    var w = 1100;
    var h = 100;

    $scope.thisChromosome = chromosomeInfo[chromIndex][0];
    $scope.thisChromosomeLength = chromosomeInfo[chromIndex][1];

    var chromosomeLength = chromosomeInfo[chromIndex][1];
    var p_endPos = chromosomeInfo[chromIndex][2] * 1000000;
    var q_endPos = chromosomeLength - p_endPos;
    var chomosomeArms = [
      [0, p_endPos],
      [p_endPos + 1, q_endPos]
    ];

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
         .style('fill', function(d, i){ return d[2]; })
  };

});
