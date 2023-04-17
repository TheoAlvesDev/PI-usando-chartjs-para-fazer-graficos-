function loadCSV(filename) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
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
      for (var j = 0; j < headers.length; j++) {
        tarr[headers[j]] = data[j];
      }
      lines.push(tarr);
    }
  }
  createChart(lines);
}
var chart;

function createChart(data) {
  if (chart) {
    chart.destroy();
  }

  var labels = [];
  var values = [];
  for (var i = 0; i < data.length; i++) {
    labels.push(data[i].Date);
    values.push(data[i].Close);
  }

  var ctx = document.getElementById("myChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Valor de fechamento",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          data: values,
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              parser: "YYYY-MM-DD",
            },
            scaleLabel: {
              display: true,
              labelString: "Data",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var selector = document.getElementById("csv-selector");
  loadCSV(selector.value);

  selector.addEventListener("change", function () {
    loadCSV(this.value);
  });
});
