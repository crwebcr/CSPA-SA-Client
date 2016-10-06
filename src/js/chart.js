// 
// //////////////////////
// // GRAPH MANAGEMENT //
// //////////////////////
// 
// /**
//  *  Clean button
//  */
// function clean() {newGraph(); $('#clean').hide();}
// 
// /**
//  *  Display any curve
//  *  @param item = short name of the curve
//  *  @param data = curve points
//  */
// function showCurve(item) {
// 	$('.statistics').hide(); $('#graph').show(); if (typeof graph.curves[item] != 'undefined') return;
// 	var type = resultsTable[item].type; if (type != graph.type) { newGraph(); graph.type=type; }
// 	graph.ncurves++; graph.curves[item]=''; plotGraph();
// }
// 
// /**
//  *  Display the original series
//  */
// function showSeries() {showCurve('y');}
// 
// /**
//  * Initialize the graph dimension
//  */
// function initGraph() {
// 
// 	graph.width = $('#graph').width() - graph.margin.left - graph.margin.right;
// 	graph.height = $('#graph').height() - graph.margin.top - graph.margin.bottom - 10;
// 
// 	graph.x = d3.time.scale().range([0, graph.width]);
// 	graph.y = d3.scale.linear().range([graph.height, 0]);
// }
// 
// /**
//  *  Reset graph
//  */
// function newGraph() {
// 	graph.curves = {}; graph.ncurves = 0; graph.type = '';
// 	graph.rangeX = []; graph.rangeY = [];
// 	d3.select("svg").remove();
// }
// 
// /**
//  * Add plot to the graph, update the scale and the legend
//  */
// function plotGraph() {
// 
// 	// series to plot
// 	var name, data, names = []; for (var i in graph.curves) names.push(i);
// 
// 	// Delete graph zone
// 	d3.select("svg").remove();
// 
// 	// Add graph zone
// 	graph.svg = d3.select("#graph")
//     			.append("svg").attr("width", $('#graph').width()).attr("height", $('#graph').height())
//     			.append("g").attr("transform","translate(" + graph.margin.left + "," + graph.margin.top + ")");
// 
// 	// Define axis
// 	graph.line = d3.svg.line()
// 				.x(function(d) {return graph.x(d.date);})
// 				.y(function(d) {return graph.y(d.value);});
// 
// 	graph.xAxis = d3.svg.axis().scale(graph.x).orient("bottom");
// 	graph.yAxis = d3.svg.axis().scale(graph.y).orient("left");
// 
// 	// Update range of axis
// 	name = names[names.length-1]; data = (name=='y') ? seriesData : results[name].series;
// 	graph.rangeX = d3.extent(graph.rangeX.concat(d3.extent(data, function(d) { return d.date; })));
// 	graph.rangeY = d3.extent(graph.rangeY.concat(d3.extent(data, function(d) { return d.value; })));
// 
// 	graph.x.domain(graph.rangeX);
// 	graph.y.domain(graph.rangeY);
// 
// 	// Add axis
// 	graph.svg.append("g")
// 	         .attr("class","x axis")
// 	         .attr("transform", "translate(0," + graph.height + ")")
// 	         .call(graph.xAxis);
// 
//     graph.svg.append("g")
// 	         .attr("class","y axis")
// 	         .call(graph.yAxis);
// 
//     // Add plots
//     for (var j in names) {
//     	name = names[j]; data = (name=='y') ? seriesData : results[name].series;
//     	graph.svg.append("path")
//     		.datum(data)
//     		.attr("class", "line")
//     		.style("stroke", colors[j])
//     		.attr("d", graph.line);
//     }
// 
// 	// Define legend zone
// 	var legend = graph.svg.append("g")
// 	  			    	  .attr("class", "legend")
// 	  			          .attr("x",25)
// 	  			          .attr("y",graph.height + 25)
// 	  			          .attr("height", 50)
// 	  			          .attr("width", 100);
// 
// 	// Add series name in the legend
// 	legend.selectAll('g').data(names).enter().append('g')
//     	  .each(function(d,i) {
//     		  var g = d3.select(this);
// 
//     		  g.append("rect")
//     		   .attr("x", 25 + 60*i)
//                .attr("y", graph.height + 25)
//                .attr("width", 10)
//                .attr("height", 10)
//                .style("fill", colors[i]);
// 
//     		  g.append("text")
//     		  	.attr("x", 40 + 60*i)
//     		  	.attr("y", graph.height + 35)
//     		  	.attr("height", 30)
//     		  	.attr("width", 40)
//     		  	.style("fill", colors[i])
//     		  	.text(d);
//     });
// 
// 	// Show button clean
// 	if (names.length==1) $('#clean').show();
// }
