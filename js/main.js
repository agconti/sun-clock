;(function(){

var now = new Date()
  , time = getTime(now)

  // svg config 
  , svgWidth = 900
  , svgHeight = 600

  // clock config
  , clock = '.clock'
  , frameRate = 500
  , now = new Date()
  , blue = 'hsl(221, 85%, 22%)'
  , peach = 'hsl(31, 100%, 50%)'
  , orange = 'hsl(41, 100%, 50%)'
  , yellow = 'hsl(51, 100%, 50%)'
  , colorScale = d3.scale.ordinal()
      .domain(d3.range(3))
      .range([peach, orange, yellow])
  , opacityScale = d3.scale.linear()
      .domain(d3.range(2))
      .range([1, 0.7]) 
  , maximumTime = [-1, 1]
  , radiusScale = d3.scale.linear()
      .domain(maximumTime)
  , hourScale = d3.scale.ordinal()
      .domain(d3.range(24))
  , horizonScale = d3.scale.linear()
      .domain([0, 12, 23])

  // legend config
  , labels = [ { value: 'AM', textAnchor: "start"}
             , { value: 'PM', textAnchor: "end"}
             ]
  , legendMargin = 25
  , legendScale = d3.scale.ordinal()
      .domain(d3.range(labels.length))

/**
 * A factory that returns the current time in a convenient array.
 * @param {object} now -- a Date object
 * @return {object} -- an array of the form [ milliseconds%, seconds%, minuets% ]
 */
function getTime(now) {
  return [ now.getMilliseconds() / 999
         , now.getSeconds() / 60
         , now.getMinutes() / 60
         ]
}

/**
 * Sets the clocks scales to the current svg width and height
 */
function setScales(){
  var circleDiameter = svgHeight * 0.35
    , circleRadius = circleDiameter / 2
    
  d3.select('svg')
    .attr("height", svgHeight)
    .attr("width", svgWidth)
  radiusScale
    .range([0, circleDiameter])
  hourScale
    .rangeBands([-1, svgWidth])
  horizonScale
    .range([svgHeight, circleRadius, svgHeight])
  legendScale
    .range([legendMargin, svgWidth - legendMargin])
}

/**
 * Sets the clocks legened
 */
function setLegend(){
  legend = svg.selectAll('text')
    .data(labels)
    .attr("x", function(d, i) { return legendScale(i) })
    .attr("y", svgHeight - legendMargin)
    .attr("dy", "0.75em")
    .attr("text-anchor", function(d) { return d.textAnchor })
    .style("fill", blue)
    .text(function(d) { return d.value })    
}

/**
 * Fully redraws the clock from scratch.
 */
function setSvgDimensions(){
    svgWidth = window.innerWidth 
    svgHeight = window.innerHeight
    setScales()
    setLegend()
    tick(getTime(now))
}


/**
 * Updates the clock as time passes. 
 */
function tick (time){

  hands = svg.selectAll('circle')
    .data(time)
    .transition()
    .duration(frameRate)
    .attr('cx', function(){ return hourScale(now.getHours()) })
    .attr('cy', function(){ return horizonScale(now.getHours()) })
    .attr("r", function(d){ return radiusScale(d) })
    .style('fill', function(d, i){ return colorScale(i) })
    .style('opacity', function(d){ return opacityScale(d) })
}

var svg = d3.select(clock)
  .append('svg')
  .append('g')

var hands = svg.selectAll('g')
  .data(time).enter()
  .append('g')

// append base circles, so we can update them
hands.append('circle')
     .style('fill', function(d, i){ return colorScale(i) })

var legend = svg.selectAll('text')
    .data(labels).enter()
    .append('text')

// The initial display.
setSvgDimensions()

// allow the clock resize responsively
window.onresize = setSvgDimensions

// update the clock 
setInterval(function() {
  now = new Date()
  var time = getTime(now)
  tick(time)
}, frameRate)

})()
    