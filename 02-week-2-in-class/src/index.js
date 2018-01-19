import * as d3 from 'd3';
//Install bootstrap first, using npm install bootstrap --save
//import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import parse from './parse';

console.log('Week 2 in class');

//Part 1: review d3-selection
//https://github.com/d3/d3-selection

// //Select elements
// const moduleSelection = d3.select('.module'); //selection
// console.log(moduleSelection);
// console.log(moduleSelection.node()); //node
//
// //Selection vs DOMNode
//
// //Modifying selection
// const redNode = moduleSelection
//   .append('div')
//   .attr('class','new new-div')
//   .style('width','100px')
//   .style('height','200px')
//   .style('background','red');
//
// //Handle events
// redNode.on('click',function(){
//   console.log('red box has been clicked')
// });
//
// const divSelection = d3.select('body')
//   .selectAll('div');
//
// //Control flow: .each and .call
// divSelection.each(function(d, i, nodes){
//   console.log(this);
//   console.log('test');
// });

//Data binding

//Import and parse data
d3.csv('./data/hubway_trips_reduced.csv', parse, function(err,trips){

	//Data transformation, discovery, and mining
  console.log(trips);

  const tripsByStation0 = d3.nest()
    .key(function(d){ return d.station0; })
    .entries(trips);

  const tripVolumeByStation0 = tripsByStation0.map(function(d){
    return {
      station: d.key,
      volume: d.values.length
    }
  });

  console.log(tripVolumeByStation0);

  // mine for maximum
  const maxVolume = d3.max(tripVolumeByStation0, function(d){return d.volume});
  console.log(maxVolume);

  // visual space measurements
  const margin = {t:100, r:300, b:100, l:300};
  const padding = 3;
  const w = d3.select('.module').node().clientWidth;
  const h = d3.select('.module').node().clientHeight;
  const ww = w - margin.l - margin.r;
  const hh = w - margin.t - margin.b;

  // scale
  const scaleX = d3.scaleLinear().domain([0, maxVolume]).range([0,w]);

	//Represent / DOM manipulation
  const svgNode = d3.select('.module')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  const plot = svgNode
    .append('g')
    .attr('class','chart')
    .attr('transform', `translate(${margin.l},${margin.t})`);

  const stationNodes = plot.selectAll('.station')
    .data(tripVolumeByStation0)
    .enter()
    .append('g')
    .attr('class','station')
    .attr('transform', function(d,i){
      return `translate(0,${i*h/tripVolumeByStation0.length})`
    });

  stationNodes
    .append('rect')
    .attr('width',function(d){ return scaleX(d.volume); })
    .attr('height',(hh/tripVolumeByStation0.length)-padding)
    .style('fill','red');

  stationNodes
    .append('text')
    .text(function(d){ return d.station; })
    .attr('text-anchor','end')
    .style('font-size','6px');

});
