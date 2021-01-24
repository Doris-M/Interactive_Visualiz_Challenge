var data;

function init(){
    var dataSet = d3.select("#selDataset");

    d3.json("static/data/samples.json").then((importedData) =>{
        
      data = importedData;
        var namesID = data.names;
        namesID.forEach((ID) => { 
                                dataSet.append('option').text(ID).property('value', ID);
                                });

    var   initialValue = namesID[0];
    displayCharts(initialValue);
    displayMetadata(initialValue);

    });
}

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function displayCharts(initialValue) {

    d3.json("static/data/samples.json").then((importedData) =>{

        var samples = importedData.samples; //Use sample_values as the values for the bar chart.
        var filterNames = samples.filter(nameid => nameid.id == initialValue);
        var NamesFiltered = filterNames[0];
        var sample_values = NamesFiltered.sample_values;
        var otu_ids = NamesFiltered.otu_ids;
        var otu_labels = NamesFiltered.otu_labels;   		
       

        // Create the Trace for a Bar Chart
        var trace1 = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };

        // Create the data array for the plot
        var dataTrace = [trace1];
        
        // Define the plot layout
        var layout = {
            title: "Top 10 OTUs",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTus Ids" },
            font: { color: "Green", family: "Arial" }
        };
        
        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("bar", dataTrace, layout);



        //////Bubble chart
        var trace1 = {
            x: otu_ids, // otu_ids for the x values.
            y: sample_values, // sample_values for the y values.
            text: otu_labels, //otu_labels for the text values.
            mode: 'markers',
            marker: {
                size: sample_values, //sample_values for the marker size.
                color: otu_ids, //otu_ids for the marker colors.
                
                colorscale:"Portland",
                opacity: [1, 0.8, 0.6, 0.4],
                
              }
          };
          
          var data = [trace1];
          
          var layout = {
            xaxis: {title:`OTU ${initialValue}`},
            showlegend: false,
            height: 600,
            width: 1000,
            font: { color: "darkblue", family: "Arial" }
            
          };
          
          Plotly.newPlot('bubble', data, layout);
        ///end Bubble chart
    });
}

function displayMetadata(initialValue) {
    d3.json("static/data/samples.json").then((importedData) =>{
        var metadata = importedData.metadata;
        var filtermetadata= metadata.filter(dataid => dataid.id == initialValue);
        var datavalues = filtermetadata[0];
        var table = d3.select("#sample-metadata");

        //clear any metadata 
        table.html("");

        Object.entries(datavalues).forEach(([key, value]) => {
            table.append("h6").text(`${key}: ${value}`)
        })
        
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: datavalues.wfreq,
                title: { text: 'Belly Button Washing Frequency <br> Scrubs per Week' },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
                    bar: { color: "darkblue" },
                    steps: [
                        { range: [0, 4.5], color: "cyan" },
                        { range: [4.5, 9], color: "royalblue" }
                      ],
                    borderwidth: 2,
                    bordercolor: "gray"},  
            }
        ];
        
        var layout = { width: 400, height: 300, margin: { t: 0, b: 0 },
                        paper_bgcolor: "lavender",
                        font: { color: "darkblue", family: "Arial" }
                      };
        Plotly.newPlot('gauge', data, layout);
    });
 }

function optionChanged(newID) {
    displayMetadata(newID);
    displayCharts(newID);
}

init();
