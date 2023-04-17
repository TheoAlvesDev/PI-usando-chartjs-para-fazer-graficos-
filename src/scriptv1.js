var chart;
function loadCSV(filename) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var data = xhr.responseText;
      processData(data);
    }
  };
  xhr.open("GET", filename, true);
  xhr.send();
}

function processData(allText) {
  var allLines = allText.split(/\r\n|\n/);
  var headers = allLines[0].split(',');
  var lines = [];
  for (var i = 1; i < allLines.length; i++) {
    var data = allLines[i].split(',');
    if (data.length == headers.length) {
      var tarr = {};
      tarr[headers[0]] = new Date(data[0]);
      tarr[headers[4]] = parseFloat(data[4]);
      lines.push(tarr);
    }
  }
  createChart(lines);
}

function createChart(data) {
  var labels = [];
  var values = [];
  for (var i = 0; i < data.length; i++) {
    labels.push(data[i].Date);
    values.push(data[i].Close);
  }
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Preço de fechamento",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: values,
        fill: false
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function updateChart(newData) {
  var labels = [];
  var values1 = [];
  var values2 = [];

  for (var i = 0; i < newData.length; i++) {
    labels.push(newData[i].label);
    values1.push(newData[i].value1);
    values2.push(newData[i].value2);
  }

  chart.data.labels = labels;
  chart.data.datasets[0].data = values1;
  chart.data.datasets[1].data = values2;
  chart.update(); // Refresh the chart with the new data
}
function loadNewCSVAndUpdateChart(newFilename) {
  loadCSV(newFilename, function (newData) {
    updateChart(newData);
  });
}
function onCSVSelectChange() {
  var selectElement = document.getElementById("csvSelect");
  var selectedFile = selectElement.value;
  loadNewCSVAndUpdateChart(selectedFile);
}

// Add an event listener to the dropdown menu
document.addEventListener("DOMContentLoaded", function(){
document.getElementById("csvSelect").addEventListener("change", onCSVSelectChange);
});



loadCSV("planilha.csv", createChart);