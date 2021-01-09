async function build_carbon_visual(timespan) {
    switch(timespan) {
        case "daily":
            await retrieve_carbon("daily").then(data => {
                if (data) {
                    data = JSON.parse(data);
        
                    // set the dimensions and margins of the graph dynamically for responsiveness
                    var margin = {top: 20, right: 20, bottom: 100, left: 70},
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

                    console.log(width + "|" + height + "|" + current_height + "|" + current_width);
                    

                    // format the data and summarize carbon two show second line with total sum of co2
                    var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
                    for (i = 0; i < data.length; i++) {
                        data[i]['date'] = parseDate(data[i]['date']);
                        if (i == 0) {
                            data[i]['carbon_sum'] = data[i]['total_carbon'];
                            continue;
                        }
                        data[i]['carbon_sum'] = data[i - 1]['carbon_sum'] + data[i]['total_carbon'];
                    }

                    // set the ranges
                    var x = d3.scaleTime().range([0, width]);
                    var y = d3.scaleLinear().range([height, 0]);

                    // Scale the range of the data
                    x.domain(d3.extent(data, d => { return d.date; }));
                    y.domain([0, d3.max(data, d => { return d.total_carbon; })]);	
                    
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

                    // Add the valueline path
                    svg.append("path")
                    .attr("class", "line")
                    .attr("d", valueline(data));

                    /*
                    svg.append("path")
                    .attr("class", "line")
                    .attr("d", valueline(data_sum));
                    */

                    // add the dots with tooltips
                    var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
                    svg.selectAll("dot")
                        .data(data)
                    .enter().append("circle")
                        .attr("r", 5)
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
                    .call(d3.axisLeft(y));
                    // text label for the y axis
                    svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left)
                    .attr("x",0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Carbon Amount");  

                }
                else {
                    console.log("carbon vis error!");
                }
            });
    }
}

build_carbon_visual("daily")