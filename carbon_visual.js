visuals_built = [];

function build_carbon_visual(timespan) {
    if(!visuals_built[timespan]){
        if(timespan == "daily"){
            build_daily_vis();
        }else if(timespan == "monthly"){
            build_monthly_vis();
        }else if(timespan == "yearly"){
            build_yearly_vis();
        }else{
            build_table();
        }
    }
}

function rebuild_carbon_visuals() {
    if (visuals_built["daily"]) { $("#carbon_vis_daily").html(''); build_daily_vis(); }
    if (visuals_built["monthly"]) { $("#carbon_vis_monthly").html(''); build_monthly_vis(); }
    if (visuals_built["yearly"]) { $("#carbon_vis_yearly").html(''); build_yearly_vis(); }
}

function getModalInnerWidth(){
    let maxWidth = $(".modal-lg").css("max-width");
    if(maxWidth == "none"){
        maxWidth = window.innerWidth - parseFloat(getComputedStyle(document.documentElement).fontSize); //device width - 1rem
    }else{
        maxWidth = maxWidth.substring(0, maxWidth.length-2);
    }
    return parseInt(maxWidth-2*parseFloat(getComputedStyle(document.documentElement).fontSize));
}

async function build_daily_vis() {
    await retrieve_carbon("daily").then(data => {
        if (data) {
            visuals_built["daily"] = true;
            data = JSON.parse(data);

            // set the dimensions and margins of the graph dynamically for responsiveness
            let margin = {top: 20, right: 70, bottom: 100, left: 70},
            default_ratio = 1.2
            current_width = getModalInnerWidth();
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

            //console.log("Daily: " + width + "|" + height + "|" + current_height + "|" + current_width);

            // format the data and summarize carbon two show second line with total sum of co2
            let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
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
            let x = d3.scaleTime().range([0, width]);
            let y = d3.scaleLinear().range([height, 0]);
            let y2 = d3.scaleLinear().range([height, 0]);

            // Scale the range of the data
            x.domain(d3.extent(data, d => { return d.date; }));
            y.domain([0, d3.max(data, d => { return parseFloat(d.total_carbon); })]);
            y2.domain([0, d3.max(data, d => { return parseFloat(d.carbon_sum); })]);

            // add svg to html body
            let svg = d3.select("#carbon_vis_daily")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // define the line
            let valueline = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.total_carbon); });

            // define the 2nd line
            let valueline_sum = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y2(d.carbon_sum); });

            // Add the valueline path
            svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));                    
            svg.append("path")
            .attr("class", "line2")
            .attr("d", valueline_sum(data));
            
            // line that can be dragged to specific location on the graph (tooltip)
            let focus = svg.append("g") 
            .style("display", "none");

            // append the x line
            focus.append("line")
                .attr("class", "x")
                .style("stroke", "black")
                .style("stroke-dasharray", "3,3")
                .style("opacity", 0.5)
                .attr("y1", 0)
                .attr("y2", height);

            // append the y line
            focus.append("line")
                .attr("class", "y")
                .style("stroke", "black")
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
                .attr("dx", 8)
                .attr("dy", "-.3em");

            // place the date at the intersection
            focus.append("text")
                .attr("class", "y2")
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
                    let x0 = x.invert(d3.pointer(event, this)[0]),
                        i = bisectDate(data, x0, 1),
                        d0 = data[i - 1],
                        d1 = data[i],
                        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                
                    focus.select("circle.y")
                        .attr("transform",
                            "translate(" + x(d.date) + "," + y(d.total_carbon) + ")");
                
                    focus.select("text.y1")
                        .attr("transform",
                            "translate(" + x(d.date) + "," + y(d.total_carbon) + ")")
                        .text(d.total_carbon + " kg");
            
                    focus.select("text.y2")
                        .attr("transform",
                            "translate(" + x(d.date) + "," + y(d.total_carbon) + ")")
                        .text(d3.timeFormat("%d.%m.%Y")(d.date));
            
                    focus.select(".x")
                        .attr("transform",
                            "translate(" + x(d.date) + "," + y(d.total_carbon) + ")")
                        .attr("y2", height - y(d.total_carbon));
            
                    focus.select(".y")
                        .attr("transform",
                            "translate(" + width * -1 + "," + y(d.total_carbon) + ")")
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
            .text("Day");

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
            .text("Daily Carbon in kg");  

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
            .text("Total Carbon Amount in kg"); 
        }
    });
}

async function build_monthly_vis() {
    await retrieve_carbon("monthly").then(data => {
        if (data) {
            data = JSON.parse(data);
            visuals_built["monthly"] = true;
            
            // set the dimensions and margins of the graph dynamically for responsiveness
            let margin = {top: 20, right: 70, bottom: 100, left: 70},
            default_ratio = 1.2
            current_width = getModalInnerWidth();
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

            //console.log("Monthly: " + width + "|" + height + "|" + current_height + "|" + current_width);

            // format the data and summarize carbon two show second line with total sum of co2
            let parseDate = d3.timeParse("%Y-%m");
            bisectDate = d3.bisector(function(d) { return d.date; }).left;
            for (i = 0; i < data.length; i++) {
                data[i]['date'] = parseDate(data[i]['date']);
                if (i == 0) {
                    data[i]['carbon_sum'] = parseFloat(data[i]['total_carbon']);
                    data[i]['total_carbon'] = parseFloat(data[i]['total_carbon']).toFixed(3);
                    continue;
                }
                data[i]['carbon_sum'] = parseFloat(data[i - 1]['carbon_sum']) + parseFloat(data[i]['total_carbon']);
                data[i]['total_carbon'] = parseFloat(data[i]['total_carbon']).toFixed(3);
            }

            // set the ranges
            let x = d3.scaleTime().range([0, width]);
            let y = d3.scaleLinear().range([height, 0]);
            let y2 = d3.scaleLinear().range([height, 0]);

            // Scale the range of the data
            x.domain(d3.extent(data, d => { return d.date; }));
            y.domain([0, d3.max(data, d => { return parseFloat(d.total_carbon); })]);
            y2.domain([0, d3.max(data, d => { return parseFloat(d.carbon_sum); })]);

            // add svg to html body
            let svg = d3.select("#carbon_vis_monthly")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // define the line
            let valueline = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.total_carbon); });

            // define the 2nd line
            let valueline_sum = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y2(d.carbon_sum); });

            // Add the valueline path
            svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));                    
            svg.append("path")
            .attr("class", "line2")
            .attr("d", valueline_sum(data));
            
            // line that can be dragged to specific location on the graph (tooltip)
            let focus = svg.append("g") 
            .style("display", "none");

            // append the x line
            focus.append("line")
                .attr("class", "x")
                .style("stroke", "black")
                .style("stroke-dasharray", "3,3")
                .style("opacity", 0.5)
                .attr("y1", 0)
                .attr("y2", height);

            // append the y line
            focus.append("line")
                .attr("class", "y")
                .style("stroke", "black")
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
                .attr("dx", 8)
                .attr("dy", "-.3em");

            // place the date at the intersection
            focus.append("text")
                .attr("class", "y2")
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
                    let x0 = x.invert(d3.pointer(event, this)[0]),
                        i = bisectDate(data, x0, 1),
                        d0 = data[i - 1],
                        d1 = data[i],
                        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                
                    focus.select("circle.y")
                        .attr("transform",
                            "translate(" + x(d.date) + "," + y(d.total_carbon) + ")");
                
                    focus.select("text.y1")
                        .attr("transform",
                            "translate(" + x(d.date) + "," + y(d.total_carbon) + ")")
                        .text(d.total_carbon + " kg");
            
                    focus.select("text.y2")
                        .attr("transform",
                            "translate(" + x(d.date) + "," + y(d.total_carbon) + ")")
                        .text(d3.timeFormat("%B - %Y")(d.date));
            
                    focus.select(".x")
                        .attr("transform",
                            "translate(" + x(d.date) + "," + y(d.total_carbon) + ")")
                        .attr("y2", height - y(d.total_carbon));
            
                    focus.select(".y")
                        .attr("transform",
                            "translate(" + width * -1 + "," + y(d.total_carbon) + ")")
                        .attr("x2", width + width);
                }

            // Add the x Axis
            svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%m.%Y"))
                .ticks(data.length))
            .selectAll("text") 
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
            
            // text label for the x axis
            svg.append("text")             
            .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 60) + ")")
            .style("text-anchor", "middle")
            .text("Month");

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
            .text("Monthly Carbon in kg");  

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
            .text("Total Carbon Amount in kg"); 
        }
    });
}

async function build_yearly_vis() {
    await retrieve_carbon("yearly").then(data => {
        if (data) {
            data = JSON.parse(data);
            visuals_built["yearly"] = true;

            // set the dimensions and margins of the graph dynamically for responsiveness
            let margin = {top: 20, right: 70, bottom: 100, left: 70},
            default_ratio = 1.2
            current_width = getModalInnerWidth();
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

            //console.log("Yearly: " + width + "|" + height + "|" + current_height + "|" + current_width);

            // format the data and summarize carbon two show second line with total sum of co2
            let parseDate = d3.timeParse("%Y");
            bisectDate = d3.bisector(function(d) { return d.date; }).left;
            for (i = 0; i < data.length; i++) {
                data[i]['date'] = parseDate(data[i]['date']);
                if (i == 0) {
                    data[i]['carbon_sum'] = parseFloat(data[i]['total_carbon']);
                    data[i]['total_carbon'] = parseFloat(data[i]['total_carbon']).toFixed(3);
                    continue;
                }
                data[i]['carbon_sum'] = parseFloat(data[i - 1]['carbon_sum']) + parseFloat(data[i]['total_carbon']);
                data[i]['total_carbon'] = parseFloat(data[i]['total_carbon']).toFixed(3);
            }

            // set the ranges
            let x = d3.scaleTime().range([0, width]);
            let y = d3.scaleLinear().range([height, 0]);
            let y2 = d3.scaleLinear().range([height, 0]);

            // Scale the range of the data
            x.domain(d3.extent(data, d => { return d.date; }));
            y.domain([0, d3.max(data, d => { return parseFloat(d.total_carbon); })]);
            y2.domain([0, d3.max(data, d => { return parseFloat(d.carbon_sum); })]);

            // add svg to html body
            let svg = d3.select("#carbon_vis_yearly")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // define the line
            let valueline = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.total_carbon); });

            // define the 2nd line
            let valueline_sum = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y2(d.carbon_sum); });

            // Add the valueline path
            svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));                    
            svg.append("path")
            .attr("class", "line2")
            .attr("d", valueline_sum(data));
            
            // line that can be dragged to specific location on the graph (tooltip)
            let focus = svg.append("g") 
            .style("display", "none");

            // append the x line
            focus.append("line")
                .attr("class", "x")
                .style("stroke", "black")
                .style("stroke-dasharray", "3,3")
                .style("opacity", 0.5)
                .attr("y1", 0)
                .attr("y2", height);

            // append the y line
            focus.append("line")
                .attr("class", "y")
                .style("stroke", "black")
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
                .attr("dx", 8)
                .attr("dy", "-.3em");

            // place the date at the intersection
            focus.append("text")
                .attr("class", "y2")
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
                    let x0 = x.invert(d3.pointer(event, this)[0]),
                        i = bisectDate(data, x0, 1),
                        d0 = data[i - 1],
                        d1 = data[i],
                        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                
                    focus.select("circle.y")
                        .attr("transform",
                            "translate(" + x(d.date) + "," + y(d.total_carbon) + ")");
                
                    focus.select("text.y1")
                        .attr("transform",
                            "translate(" + x(d.date) + "," + y(d.total_carbon) + ")")
                        .text(d.total_carbon + " kg");
            
                    focus.select("text.y2")
                        .attr("transform",
                            "translate(" + x(d.date) + "," + y(d.total_carbon) + ")")
                        .text(d3.timeFormat("%Y")(d.date));
            
                    focus.select(".x")
                        .attr("transform",
                            "translate(" + x(d.date) + "," + y(d.total_carbon) + ")")
                        .attr("y2", height - y(d.total_carbon));
            
                    focus.select(".y")
                        .attr("transform",
                            "translate(" + width * -1 + "," + y(d.total_carbon) + ")")
                        .attr("x2", width + width);
                }

            // Add the x Axis
            svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%Y"))
                .ticks(data.length))
            .selectAll("text") 
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
            
            // text label for the x axis
            svg.append("text")             
            .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 60) + ")")
            .style("text-anchor", "middle")
            .text("Year");

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
            .text("Yearly Carbon in kg");  

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
            .text("Total Carbon Amount in kg");
        }
    });
}

function build_table() {
    retrieve_items().then(items => {
        if(items){
            items = JSON.parse(items).map(item => {
                item.add_date = new Date(item.add_date).getTime();
                item.carbon = item.carbon * Math.pow(10, numbers.accuracy);
                return item;
            });
            console.log(items);
            $("#all_table").bootstrapTable({data: items, classes: "table table-sm", sortName: "add_date", sortOrder: "desc", pagination: true, pageSize: 15, paginationParts: ["pageInfo", "pageList"]});
        }else{
            $("#carbon_vis_all").html("<p>So far, you have not tracked any data. Start Tracking now!</p>");
        }
    });
}
/*
function fillDB() {
    for(var i = 0; i < 100; i++){
        add_item("Test", "This is fake", 100+i).then(ans => {
            console.log(ans);
        });
    }
}*/