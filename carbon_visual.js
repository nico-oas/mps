async function build_carbon_visual(timespan) {
    switch(timespan) {
        case "daily":
            await retrieve_carbon("daily").then(data => {
                if (data) {
                    data = JSON.parse(data);
        
                    // set the dimensions and margins of the graph dynamically for responsiveness
                    var margin = {top: 20, right: 70, bottom: 100, left: 70},
                    default_ratio = 1.2
                    current_width = $(document.getElementById("carbon_vis_daily")).width();
                    if (current_width >= 900) current_width /= 2;
                    current_height = current_width * 0.8;
                    current_ratio = current_width / current_height;
                    // Check if height is limiting factor
                    if ( current_ratio > default_ratio ){
                        h = current_height;
                        w = h * default_ratio;
                    // Else width is limiting
                    } else {
                        w = current_width;
                        h = w / default_ratio;
                    }

                    // Set new width and height based on graph dimensions
                    width = w - margin.left - margin.right;
                    height = h - margin.top - margin.bottom;

                    //console.log(width + "|" + height + "|" + current_height + "|" + current_width);
                    

                    // format the data and summarize carbon two show second line with total sum of co2
                    var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
                    bisectDate = d3.bisector(function(d) { return d.date; }).left;
                    for (i = 0; i < data.length; i++) {
                        data[i]['date'] = parseDate(data[i]['date']);
                        if (i == 0) {
                            data[i]['carbon_sum'] = data[i]['total_carbon'];
                            data[i]['total_carbon'] = data[i]['total_carbon'].toFixed(3);
                            continue;
                        }
                        data[i]['carbon_sum'] = data[i - 1]['carbon_sum'] + data[i]['total_carbon'];
                        data[i]['total_carbon'] = data[i]['total_carbon'].toFixed(3);
                    }

                    // set the ranges
                    var x = d3.scaleTime().range([0, width]);
                    var y = d3.scaleLinear().range([height, 0]);
                    var y2 = d3.scaleLinear().range([height, 0]);

                    // Scale the range of the data
                    x.domain(d3.extent(data, d => { return d.date; }));
                    y.domain([0, d3.max(data, d => { return parseFloat(d.total_carbon); })]);
                    y2.domain([0, d3.max(data, d => { return parseFloat(d.carbon_sum); })]);

                    // add svg to html body
                    var svg = d3.select("#carbon_vis_daily")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    // define the line
                    var valueline = d3.line()
                    .x(function(d) { return x(d.date); })
                    .y(function(d) { return y(d.total_carbon); });

                    // define the 2nd line
                    var valueline_sum = d3.line()
                    .x(function(d) { return x(d.date); })
                    .y(function(d) { return y2(d.carbon_sum); });

                    // Add the valueline path
                    svg.append("path")
                    .attr("class", "line")
                    .attr("d", valueline(data));

                    
                    svg.append("path")
                    .attr("class", "line2")
                    .attr("d", valueline_sum(data));
                    
/*
                    // add the dots with tooltips to the daily line
                    var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
                    svg.selectAll("dot")
                        .data(data)
                    .enter().append("circle")
                        .attr("r", 3)
                        .attr("cx", function(d) { return x(d.date); })
                        .attr("cy", function(d) { return y(d.total_carbon); })
                        .on("mouseover", function(event,d) {
                        div.transition()
                            .duration(350)
                            .style("opacity", .9);
                        div.html(d3.timeFormat("%d.%m.%Y")(d.date) + "<br/>" + "carbon: " + d.total_carbon.toFixed(3) + "kg")
                            .style("left", (event.pageX) + "px")
                            .style("top", (event.pageY - 28) + "px");
                        })
                        .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                        });

                    // add the dots with tooltips to the total sum line
                    var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
                    svg.selectAll("dot")
                        .data(data)
                    .enter().append("circle")
                        .attr("r", 3)
                        .attr("cx", function(d) { return x(d.date); })
                        .attr("cy", function(d) { return y2(d.carbon_sum); })
                        .on("mouseover", function(event,d) {
                        div.transition()
                            .duration(350)
                            .style("opacity", .9);
                        div.html(d3.timeFormat("%d.%m.%Y")(d.date) + "<br/>" + "Total carbon: " + d.carbon_sum.toFixed(3) + "kg")
                            .style("left", (event.pageX) + "px")
                            .style("top", (event.pageY - 28) + "px");
                        })
                        .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                        });

*/               
                    // Better tooltip without dots => line that can be dragged to specific location on the graph
                    var focus = svg.append("g") 
                    .style("display", "none");

                    // append the x line
                    focus.append("line")
                        .attr("class", "x")
                        .style("stroke", "blue")
                        .style("stroke-dasharray", "3,3")
                        .style("opacity", 0.5)
                        .attr("y1", 0)
                        .attr("y2", height);

                    // append the y line
                    focus.append("line")
                        .attr("class", "y")
                        .style("stroke", "blue")
                        .style("stroke-dasharray", "3,3")
                        .style("opacity", 0.5)
                        .attr("x1", width)
                        .attr("x2", width);

                    // append the circle at the intersection 
                    focus.append("circle")
                    .attr("class", "y")
                    .style("fill", "none")
                    .style("stroke", "blue")
                    .attr("r", 4);

                    // place the value at the intersection
                    focus.append("text")
                        .attr("class", "y1")
                        .style("stroke", "white")
                        .style("stroke-width", "3.5px")
                        .style("opacity", 0.8)
                        .attr("dx", 8)
                        .attr("dy", "-.3em");
                    
                    focus.append("text")
                        .attr("class", "y2")
                        .attr("dx", 8)
                        .attr("dy", "-.3em");

                    // place the date at the intersection
                    focus.append("text")
                        .attr("class", "y3")
                        .style("stroke", "white")
                        .style("stroke-width", "3.5px")
                        .style("opacity", 0.8)
                        .attr("dx", 8)
                        .attr("dy", "1em");
                
                    focus.append("text")
                        .attr("class", "y4")
                        .attr("dx", 8)
                        .attr("dy", "1em");

                    // append the rectangle to capture mouse
                    svg.append("rect")
                        .attr("width", width)
                        .attr("height", height)
                        .style("fill", "none")
                        .style("pointer-events", "all")
                        .on("mouseover", function() { focus.style("display", null); })
                        .on("mouseout", function() { focus.style("display", "none"); })
                        .on("mousemove", mousemove);

                        function mousemove() {
                            var x0 = x.invert(d3.pointer(event, this)[0]),
                                i = bisectDate(data, x0, 1),
                                d0 = data[i - 1],
                                d1 = data[i],
                                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                      
                          focus.select("circle.y")
                             .attr("transform",
                                   "translate(" + x(d.date) + "," +
                                                  y(d.total_carbon) + ")");
                      
                              focus.select("text.y1")
                                  .attr("transform",
                                        "translate(" + x(d.date) + "," +
                                                       y(d.total_carbon) + ")")
                                  .text(d.total_carbon);
                      
                              focus.select("text.y2")
                                  .attr("transform",
                                        "translate(" + x(d.date) + "," +
                                                       y(d.total_carbon) + ")")
                                  .text(d.total_carbon);
                      
                              focus.select("text.y3")
                                  .attr("transform",
                                        "translate(" + x(d.date) + "," +
                                                       y(d.total_carbon) + ")")
                                  .text(d3.timeFormat("%d.%m.%Y")(d.date));
                      
                              focus.select("text.y4")
                                  .attr("transform",
                                        "translate(" + x(d.date) + "," +
                                                       y(d.total_carbon) + ")")
                                  .text(d3.timeFormat("%d.%m.%Y")(d.date));
                      
                              focus.select(".x")
                                  .attr("transform",
                                        "translate(" + x(d.date) + "," +
                                                       y(d.total_carbon) + ")")
                                             .attr("y2", height - y(d.total_carbon));
                      
                              focus.select(".y")
                                  .attr("transform",
                                        "translate(" + width * -1 + "," +
                                                       y(d.total_carbon) + ")")
                                             .attr("x2", width + width);
                          
                        }



                    // Add the x Axis
                    svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x)
                            .tickFormat(d3.timeFormat("%d.%m.%Y")))
                    .selectAll("text") 
                      .style("text-anchor", "end")
                      .attr("dx", "-.8em")
                      .attr("dy", ".15em")
                      .attr("transform", "rotate(-65)");
                    
                    // text label for the x axis
                    svg.append("text")             
                    .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 60) + ")")
                    .style("text-anchor", "middle")
                    .text("Date");

                    // Add the y Axis
                    svg.append("g")
                    .call(d3.axisLeft(y).scale(y));
                    // text label for the y axis
                    svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - 50)
                    .attr("x",0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .style("fill", "#318f34")
                    .text("Carbon Amount");  

                    // Add the second y Axis (the sum)
                    svg.append("g")
                    .attr("transform", "translate(" + width + " ,0)")
                    .call(d3.axisRight(y).scale(y2));
                    // text label for the y axis
                    svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", width + 30)
                    .attr("x",0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .style("fill", "#0f5380")
                    .text("Total Carbon Sum"); 
                }
                else {
                    console.log("carbon vis error!");
                }
            });
    }
}

build_carbon_visual("daily")