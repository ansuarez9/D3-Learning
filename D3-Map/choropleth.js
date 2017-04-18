d3.json('data/final.json', function(error, data) {
    if(error){
        console.error(error);
    }

    var w = window,
        doc = document,
        el = doc.element,
        body = doc.getElementsByTagName('body')[0],
        width = w.innerWidth || el.clientWidth || body.clientWidth,
        height = w.innerHeight || el.clientHeight || body.clientHeight;

    var counties = topojson.feature(data, data.objects.counties).features;
    var meanDensity = d3.mean(counties, function(d) {
        return d.properties.density;
    });

    var scaleDensity = d3.scaleLinear()
        .domain([0,meanDensity])
        .range([0,1]);

    var color = d3.scaleSequential(d3.interpolateReds);

    var svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g');

    var projection = d3.geoAlbersUsa();

    var path = d3.geoPath()
        .projection(projection);

    svg.selectAll('.county')
        .data(counties)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'county')
        .attr('fill', function(d) {
            var countyDensity = d.properties.density;
            var density = countyDensity ? countyDensity : 0;
            return color(scaleDensity(density));
        })
});