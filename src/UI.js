var width = 850
var height = 800


var s0 = 0, s1 = 580

function draw_data() {

    d3.select("#data_svg").selectAll("*").remove();

    var margin = {top: 20, right: 40, bottom: 110, left: 40},
    	width = 660 - margin.left - margin.right,
    	height = 500 - margin.top - margin.bottom

    var margin2 = {top: 430, right: 40, bottom: 40, left: 40},
	height2 = 500 - margin2.top - margin2.bottom;

    var svg = d3.select("#data_svg")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
    	.attr("width", 850)
	.attr("height", 800)
	.append("g")
	.attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    var parseDate = d3.timeParse("%m/%d/%Y %H:%M");

    var x = d3.scaleTime().range([0, width]),
	x2 = d3.scaleTime().range([0, width]),
	y = d3.scaleLinear().range([height, 0]),
	y2 = d3.scaleLinear().range([height2, 0]);

    var xAxis = d3.axisBottom(x),
	xAxis2 = d3.axisBottom(x2),
	yAxis = d3.axisLeft(y);

    
    var brush = d3.brushX()
    	.extent([[0, 0], [width, height2]])
    	.on("brush end", brushed);

    var zoom = d3.zoom()
    	.scaleExtent([1, Infinity])
    	.translateExtent([[0, 0], [width, height]])
    	.extent([[0, 0], [width, height]])
    	.on("zoom", zoomed);


    var line = d3.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.value); });
    
    var line2 = d3.line()
	.x(function(d) {return x2(d.date); })
	.y(function(d) {return y2(d.value); });

    
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0); 

    var Line_chart = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("clip-path", "url(#clip)");


    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
	.attr("class", "context")
	.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    //var dataPlaneGraph = color.domain().map(function(name) {

    x.domain(d3.extent(dataPlaneGraph[0].values, function(d) {
	return new Date(d.date);}));
    y.domain([0, d3.max(dataPlaneGraph[0].values,
			function (d) {return d.value;})
	      +d3.max(dataPlaneGraph[0].values, function (d) {
		  return d.value; })*0.2])
    x2.domain(x.domain());
    y2.domain(y.domain());

    var focuslineGroups = focus.selectAll("g")
        .data(dataPlaneGraph)
	.enter().append("g");
    
    var focuslines = focuslineGroups.append("path")
        .attr("class","line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) {return color(d.name);})
        .attr("clip-path", "url(#clip)");

    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .style("font", "normal 11px Arial")
        .call(xAxis);

    focus.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 0 - margin.left - 20)
	.attr("x",0 - (height / 2))
	.style("text-anchor", "middle")
        .style("font", "normal 11px Arial")
	.text("[KB/s]");      

    focus.append("g")
        .attr("class", "axis axis--y")
        .style("font", "normal 11px Arial")
        .call(yAxis);
    

    var contextlineGroups = context.selectAll("g")
        .data(dataPlaneGraph)
	.enter().append("g");
    
    var contextLines = contextlineGroups.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line2(d.values); })
        .style("stroke", function(d) {return color(d.name);})
        .attr("clip-path", "url(#clip)");
    

    context.append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + height2 + ")")
        .style("font", "normal 11px Arial")
	.call(xAxis2);

    context.append("g")
    	.attr("class", "brush")
    	.call(brush)
    	.call(brush.move, x.range());

    svg.append("rect")
	.attr("class", "zoom")
	.attr("width", width)
	.attr("height", height)
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	.call(zoom);

    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
    			     .scale(width / (s1 - s0))
    			     .translate(-s0, 0));

    function brushed() {
    	if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;

    	var s = d3.event.selection || x2.range();
    	x.domain(s.map(x2.invert, x2));
	focus.selectAll("path.line").attr("d",  function(d) {return line(d.values)});
    	focus.select(".axis--x").call(xAxis);

	if(s[0] !== 0) 
	    s0 = s[0]

	if(s[1] !== width)
	    s1 = s[1]
	svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
    				 .scale(width / (s1 - s0))
    				 .translate(-s0, 0));
    }

    function zoomed() {
    	if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
    	var t = d3.event.transform;

    	x.domain(t.rescaleX(x2).domain());
    	Line_chart.select(".line").attr("d", line)
    	focus.select(".axis--x").call(xAxis);
    	focus.selectAll("path.line").attr("d",  function(d) {
	    return line(d.values)
	});
    	context.select(".brush").call(brush.move, x.range().map(t.invertX, t));

	s0 = x.range().map(t.invertX, t)[0]
	s1 = x.range().map(t.invertX, t)[1]
    }
}


var svg = d3.select("#ctrl_svg")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
var link = d3.select("svg").selectAll(".link")
var linkText = d3.select("svg").selectAll(".link")
var nodeEnter = d3.select("svg").selectAll("g.node")

function draw_ctrl() {
    
    d3.select("svg").selectAll("*").remove()
    simulation.stop();
    
    simulation.force("link").links(edges);
    simulation.nodes(nodes);

    link = d3.select("svg").selectAll(".link")
    	.data(edges)
    	.enter()
    	.append("g")
    	.attr("class", "link")
    	.append("line")
    	.attr("class", "link-line")
    	.style("stroke", function(d){
	    var color
	    if(d.status === 'update') {
	    	color = 'green'	
	    } else if(d.status === 'withdraw') {
	    	color = 'red'
	    } else {
	    	color = 'orange'
	    }
	    d.status = ''
	    return color
	}) 
        .style("stroke-width", 2);

    linkText = d3.select("svg").selectAll(".link")
    	.append("text")
    	.attr("class", "link-label")
    	.attr("font-family", "Arial, Helvetica, sans-serif")
    	.attr("fill", "Black")
    //    	.style("font", "normal 14px Arial")
    	.style("font", "normal 16px Arial")
    
    	.attr("dy", ".35em")
    	.attr("text-anchor", "middle")
    	.text(function(d) {
            return d.label;
    	});

    linkText.on("mousedown", function(d) {
	
	if(d.labelCallback !== undefined)
	    d.labelCallback(d)
    })

    nodeEnter = d3.select("svg").selectAll("g.node")
    	.data(nodes, d => d.id)
    	.enter()
    	.append("g")
    	.attr("class", "node");

    var radius = 8
    nodeEnter.append("circle")
    	.attr("r", 8)
    	.style("fill", "#FCBC34");
    nodeEnter.append("text")

        .attr("font-family", "Arial, Helvetica, sans-serif")
    	.attr("fill", "Black")
    //.style("font", "bold 14px Arial")
	.style("font", "bold 16px Arial")
    	.attr("dy", ".35em")
    	.attr("text-anchor", "middle")
    	.text(function(d) {
	    return d.label
	})
    
    nodeEnter.on("mousedown", function(d) {
	if(d.labelCallback !== undefined)
	    d.labelCallback(d)
    })

    var drag = d3.drag();
    drag.on("drag", dragging);
    d3.selectAll("g.node").call(drag);
    
    function dragging(d) {
        var e = d3.event;
        d.fx = e.x;
        d.fy = e.y;
        if (simulation.alpha() < 0.1) {
            simulation.alpha(0.1);
            simulation.restart();
        }
    }

    simulation.alpha(0.1);    
    simulation.restart();
}

var linkForce = d3.forceLink().strength(d => 5.5);
var simulation = d3.forceSimulation()

    .force('charge', d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width/2,height/2))
    .force("x", d3.forceX(width/2))
    .force("y", d3.forceY(height/2))
    .force("link", linkForce.distance(450))
    .nodes(nodes)
    .on("tick", forceTick);
simulation.force("link").links(edges);

function forceTick() {
    d3.selectAll(".link")
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y);

    d3.selectAll("g.node")
        .attr("transform", function(d) {
	    var radius = 8
	    d.x = Math.max(radius, Math.min(width - radius, d.x));
	    d.y = Math.max(radius, Math.min(height - radius, d.y));
	    return `translate(${d.x},${d.y})`
	})

    link.attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

    linkText
        .attr("x", function(d) {
            return ((d.source.x + d.target.x)/2);
        })
        .attr("y", function(d) {
            return ((d.source.y + d.target.y)/2);
        });
}
