var tipWidth = 150,
    tipHeight = 70;

// Ramp paraemters, first for dead, then for injuries
var rampameters = [[0,10,50,100,500,1000,2000],[0,10,50,100,500,1000,4000]]

//m = 0 is dead map, m = 1 is injured map;
var m = 0;

// define the color ramp function
var ramp = function(d, m) {
  if (m === 0) {
    var o = d.properties.dead;
  } else if (m === 1) {
    var o = d.properties.injured;
  };
  
  for (var i = 0; i < rampameters[m].length; i++) {
    if (o <= rampameters[m][i]) {
      var qclass = "q" + i;
      break;
    };
  };
  return qclass;
}

// var projection = d3.geo.albers()
//     .scale(1280)
//     .translate([width / 2, height / 2]);

var scale = 6400;
var yaw = -84.5;
var pitch = 11.1 ;
var roll = 0;
// var scale = 5750;
// var yaw = -87;
// var pitch = 11.1 ;
// var roll = 0;
var graticulex = 1;
var graticuley = 1; 

var projection = d3.geo.albers()
  .scale(scale)    
  .rotate([yaw, pitch, roll]) //yaw, pitch, roll    ;  

var graticule = d3.geo.graticule()
  .step([graticulex, graticuley]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("path")
  .datum(graticule)
  .attr("class", "graticule")
  .attr("d", path);
  
queue()
    .defer(d3.json, "data/districts_topo4.json")    
    .await(ready);

function ready(error, districts_topo4) {
// console.log(districts_topo4)
  svg.append("g")
      .attr("class", "districts_id")
    .selectAll("path")
      .data(topojson.feature(districts_topo4, districts_topo4.objects.districts_id).features)
    .enter().append("path")
      .attr("class", function(d) { 
        return ramp(d,m)
        // return quantize(rateById.get(d.id)); 
      })
      .attr("d", path)
      .on("mouseover", tooltip)
      .on("mouseout", remover);

// Draw the state borders
  svg.append("path")
      .datum(topojson.mesh(districts_topo4, districts_topo4.objects.districts_id, function(a, b) { 
        return a !== b; }))
      .attr("class", "states")
      .attr("d", path)

    svg.append("path")
      .datum(topojson.mesh(districts_topo4, districts_topo4.objects.districts_id, function(a, b) { 
        return a == b; }))
      .attr("class", "country")
      .attr("d", path)      
}

function tooltip(d) {
  var dead = d.properties.dead;
  var injured = d.properties.injured;
  var district = d.properties.district;

  centroid = path.centroid(d);

  centroid_adjusted = [(centroid[0]-(tipHeight)),(centroid[1]-(tipWidth-50))];

        // tip_text  = [(centroid_adjusted[0] -50),(centroid_adjusted[1])];
        tip_text = [(centroid_adjusted[0] + (tipWidth /2)),(centroid_adjusted[1] + 20)];
        tip_text2  = [(centroid_adjusted[0] + (tipWidth /2)),(centroid_adjusted[1] + 40)];
        tip_text3  = [(centroid_adjusted[0] + (tipWidth /2)),(centroid_adjusted[1] + 60)];
        
      var tooltipContainer = svg.append("g")
        .attr("id", "tooltip")
      .append("rect")
              .attr("transform", function() { 
          return "translate(" + centroid_adjusted + ")"; })
        .attr("width", (tipWidth))
        .attr("height", (tipHeight))
        .attr("rx", 6)
        .attr("ry", 6)
        // .attr("fill", "brown");

// tip title
      svg
        .append("text")
        .attr("class","tip-text")
        .text(function(d){return district})
        .attr("transform", function() { 
          return "translate(" + tip_text + ")"; });

      svg
        .append("text")
        .attr("class","tip-text2")
        .text(function(d){
            return "Total dead: " + dead;
        })
        .attr("transform", function() { 
          return "translate(" + tip_text2 + ")"; });
        
        svg
        .append("text")
        .attr("class","tip-text3")
        .text(function(d){
            return "Total injuries: " + injured;
        })
        .attr("transform", function() { 
          return "translate(" + tip_text3 + ")"; });           
}      
// d3.selectAll("g").on('mouseover', tooltip);

function remover() {
      d3.select("#tooltip").remove();
      d3.selectAll(".tip-text").remove();
      d3.selectAll(".tip-text2").remove();        
      d3.selectAll(".tip-text3").remove();     
    }


// WHAT YOU DO WHEN YOU CLICK TO CHANGE THE MAP
var deathmap = document.getElementById("deathmap");
var injurymap = document.getElementById("injurymap");

deathmap.onmousedown = function () {
  if (m === 1) {
      deathmap.className = "large-6 medium-6 small-6 nepbuttons active"
      injurymap.className = "large-6 medium-6 small-6 nepbuttons"
      m-=1;
      // d3.selectAll('g').data([]).exit().remove();
      d3.selectAll(".districts_id").remove();
      d3.selectAll(".country").remove();
      d3.selectAll(".states").remove();
    queue()
      .defer(d3.json, "data/districts_topo4.json")
      .await(ready);
  };    
};

injurymap.onmousedown = function () {
    if (m === 0) {
      deathmap.className = "large-6 medium-6 small-6  nepbuttons"
      injurymap.className = "large-6 medium-6 small-6 nepbuttons active"
      m+=1;
      // d3.selectAll('g').data([]).exit().remove();
      d3.selectAll(".districts_id").remove();
      d3.selectAll(".country").remove();
      d3.selectAll(".states").remove();
    queue()
      .defer(d3.json, "data/districts_topo4.json")
      .await(ready);
    };
};

d3.select(self.frameElement).style("height", height + "px");


