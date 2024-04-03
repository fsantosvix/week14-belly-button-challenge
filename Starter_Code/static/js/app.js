// specify the source of the data
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Fetch the JSON data and console log it
d3.json(url).then(data => console.log(data));

//Add data to the drop-down list
d3.json(url).then(data => {
    d3.select("#selDataset")
        .selectAll()
        .data(data.names)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);
});


// Create the graphs
function createGraphs(individual) {
    // Filter the dataset to be used
    d3.json(url).then(data => {
        let samples = data.samples;
        let filteredData = samples.filter(s => s.id === individual);
        let filteredDataValues = filteredData[0];

        // Fetch data to plot the graphs
        let otuIds = filteredDataValues.otu_ids;
        let otuLabels = filteredDataValues.otu_labels;
        let sampleValues = filteredDataValues.sample_values;

        // Create the bar chart
        // Select x and y values
        let yData = otuIds.map(id => `OTU ${id}`).slice(0, 10).reverse();
        let xData = sampleValues.slice(0, 10).reverse()
        let labels = otuLabels.slice(0, 10).reverse()

        // Define the bar data
        let barChartData = [{
            x: xData,
            y: yData,
            text: labels,
            type: "bar",
            orientation: "h"
        }];

        // Add layout details
        let barChartLayout = {
            title: "Top 10 OTU Found in the selected individual",
            xaxis: { title: "Sample Value" },
            yaxis: { title: "OTU ID" },
            margin: { t: 50 }
        };

        Plotly.newPlot("bar", barChartData, barChartLayout);


        // Build the bubble chart
        let bubbleChartData = [{
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: 'Earth'
            }
        }];

        // Add layout details
        let bubbleChartLayout = {
            title: "Sample's Biodiversity",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Value" }
        };

        // Display the charts
        Plotly.newPlot('bubble', bubbleChartData, bubbleChartLayout);
    });
};


// Display the sample metadata, i.e., an individual's information
function createMetadataBlock(individual) {
    d3.json(url).then(data => {
        let metadata = data.metadata;
        let filteredData = metadata.filter(m => m.id == individual);
        let filteredDataValues = filteredData[0];

        // Select the div/class that will present the metadata block
        let metaBlock = d3.select("#sample-metadata");

        // Clear information displayed from previous selections
        metaBlock.html('');

        // Add each key-value pair to the panel
        Object.entries(filteredDataValues).forEach(([key, value]) => {
            // Add paragraphs to the block
            metaBlock.append("p")
                // Add the key-value pairs to the paragraphs created
                .text(`${key}: ${value}`);
        });

    });
};

// Update all plots when a new sample is selected from the dropdown menu
function optionChanged(newSelection) {
    createGraphs(newSelection);
    createMetadataBlock(newSelection);
};

// Initialise page showing plots based on the first item of the dropdown list
function init() {
    d3.json(url).then(data => {
        let firstItem = data.names[0];
        createGraphs(firstItem);
        createMetadataBlock(firstItem);
    })
};

init();
