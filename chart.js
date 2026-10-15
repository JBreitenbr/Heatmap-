function showMonth(period) {
// URL zu deinen Realdaten
const csvUrl = `https://raw.githubusercontent.com/JBreitenbr/Julias-Charts-Data/refs/heads/main/${period.split(" ")[1]}/${period.split(" ")[0]}/heatmap.csv`;
  // Globale Variablen für Daten und Zustand
let rawData = [];
d3.select("#chart-container").html("");
// Selektoren
const container = d3.select("#chart-container");
const tooltip = d3.select("#tooltip");

// Layout-Konstanten
const margin = { top: 20, right: 30, bottom: 40, left: 140 }; 
let height = 450; 
  const svg = container.append("svg").style("width", "100%");
const chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
const xAxisG = chartGroup.append("g").attr("class", "axis x-axis");
const yAxisG = chartGroup.append("g").attr("class", "axis y-axis");
d3.csv(csvUrl).then(data => {
  let c=Array.from(new Set(data.map(d => d.group)));
  console.log(c);
  rawData = data.map(d => ({
    group: +d.group,
    artist_score: +d.artist_score,
    variable: d.variable,
    daily_score: +d.daily_score,
    n_tracks:+d.n_tracks,
    n_utracks:+d.n_utracks,
    daily_dur:+d.daily_dur,
    value:+d.value 
   }));
  svg.attr("height", height);
  const resizeObserver = new ResizeObserver(() => render());
  resizeObserver.observe(document.getElementById("chart-container"));
 //console.log(rawData);
  }).catch(error => {
  console.error("Fehler beim Laden der CSV-Daten:", 
                error);
  container.html("<p style='color:red;'>Daten konnten nicht geladen werden.</p>");
});
  function render() {
    console.log(chartGroup);
  // Skalen aktualisieren
  const width = parseInt(container.style("width"), 10) - margin.left - margin.right;
  svg.attr("width", width + margin.left + margin.right);

  const x = d3.scaleBand()
    .domain(Array.from(new Set(rawData.map(d => d.group))))
    .range([0, width]);

  const y = d3.scaleBand()
  .domain(Array.from(new Set(rawData.map(d => d.variable))))
  //  .domain(rawData.map(d => d.variable))
    .range([0, height - margin.top - margin.bottom])
   /* .padding(0.1)*/;
    let blues=["#ffffff","#deebf7","#c6dbef",
"#9ecae1","#6baed6","#4292c6","#2171b3","#08519c","#08306b", "#000080"];
function colored(n){
  return blues[n];
}
  // Achsen zeichnen
  xAxisG.attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
    .transition().duration(400)
    .call(d3.axisBottom(x).ticks(Math.max(4, width / 120)));

  yAxisG.transition().duration(400)
    .call(d3.axisLeft(y));
   svg.selectAll("rect")
    .data(rawData, function(d) {return d.group+':'+d.variable;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.group)+margin.left })
      .attr("y", function(d) { return y(d.variable)+margin.top })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return colored(d.value)} )
      .style("opacity", 0.8).on("mouseover", function(event, d) {
   
      tooltip.style("opacity", 1)
        .html(`
          <strong style="color:white;">Artist: ${d.variable}</strong><br/>
          <span>Day: ${d.group}<br/>
            <small>Duration (min): ${d.daily_dur}</small><br/>
          <small>Number of tracks: ${d.n_tracks}</small><br/>
   <small>Number of unique tracks: ${d.n_utracks}</small>
        `);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseleave", function() {
      tooltip.style("opacity", 0);
    });
    }
 }
showMonth("September 2026");
d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(['May 2026','June 2026',"July 2026","August 2026", "September 2026"].reverse())
      .enter()
    	.append('option')
      .text(function (d) { return d; }) 
      .attr("value", function (d) { return d; })
function update(selectedGroup) {   
   showMonth(selectedGroup);
}   
d3.select("#selectButton").on("change", function(d) {
        let selectedOption = d3.select(this).property("value")
        update(selectedOption)});
