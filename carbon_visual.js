async function build_carbon_visual(timespan) {
    switch(timespan) {
        case "daily":
            await retrieve_carbon("daily").then(data => {
                if (data) {
                    data = JSON.parse(data);
                    
 /*
                    console.log("data: ");
                    console.log(data);
                    return;
*/
                    // set the dimensions and margins of the graph
                    var margin = {top: 10, right: 30, bottom: 70, left: 60},
                    width = 460 - margin.left - margin.right,
                    height = 400 - margin.top - margin.bottom;
         
                    // set the ranges
                    var x = d3.scaleTime().range([0, width]);
                    var y = d3.scaleLinear().range([height, 0]);

                    // define the line
                    var valueline = d3.line()
                        .x(function(d) { return x(d.date); })
                        .y(function(d) { return y(d.close); });

                    var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

                    // format the data
                    data.forEach(d => {
                        d.date = parseDate(d.date);
                    });
        
                    console.log(data);

                    // Scale the range of the data
                    x.domain(d3.extent(data, d => { return d.date; }));
                    y.domain([0, d3.max(data, d => { return d.carbon; })]);

                    var svg = d3.select("#carbon_vis_daily")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    // Add the valueline path.
                    svg.append("path")
                    .data([data])
                    .attr("class", "line")
                    .attr("d", valueline);

                    // Add the x Axis
                    svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                    // Add the y Axis
                    svg.append("g")
                    .call(d3.axisLeft(y));

                    return;


                    // append the svg object to the body of the page
                    var svg = d3.select("#carbon_vis_daily")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        
                    // helper function
                    function getDate(d) {
                        return new Date(d.date);
                    }
        
                    // get max and min dates - this assumes data is sorted
                    var minDate = getDate(data[0]),
                        maxDate = getDate(data[data.length-1]);
        
                    // Add X axis
                    var x = d3.scaleTime().domain([minDate, maxDate]).range([0, w]);
                    svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m-%Y")))
                    .selectAll("text") 
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");;
        
        
        
                    // Add Y axis
                    var y = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) { return + d.total_carbon; })])
                    .range([ height, 0 ]);
                    svg.append("g")
                    .call(d3.axisLeft(y));
        
                    // Add the line
                    svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line().x(function(d) { return x(d.date) }).y(function(d) { return y(d.total_carbon) }));
        
                    return;
        
                }
                else {
                    console.log("carbon vis error!");
                }
            });
    }
}