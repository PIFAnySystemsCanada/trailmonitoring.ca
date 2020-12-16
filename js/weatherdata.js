class WeatherWidgets
{
	constructor()
	{
		this.dialDiv = 'dials';
		this.lightChartDiv = 'lightChart';
		this.temperatureChartDiv = 'temperatureChart';
		// Create the dials for the current data display
		this.dialData = [
			{
				domain: { row: 0, column: 0 },
				value: 0,
				title: { text: "Current Air Temp (C)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [-30, 30] } }
			},
			{
				domain: { row: 0, column: 1 },
				value: 0,
				title: { text: "Current Ground Temp (C)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [-30, 30] } }
			  },
			  {
				domain: { row: 0, column: 2 },
				value: 0,
				title: { text: "Current Light Level (lux)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 5000] } }
			  },
			];

		this.dialLayout = {
			width: 900,
			height: 300,
			margin: { t: 10, b: 10, l: 50, r: 50 },
			grid: { rows: 1, columns: 3, pattern: "independent" },
			font: { color: "#ffffff" },
			plot_bgcolor: 'rgba(0,0,0,0)',
			paper_bgcolor: 'rgba(0,0,0,0)',
			template: {
				data: {
				indicator: [
					{
					mode: "number+delta+gauge",
					}
				]
				}
			}
		};

		// Create the charts for the historical display
		var dateString = getDateString();
		this.chartData = [
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Air Temp (C)',
				line: {color: '#FFE900'}
			},
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Ground Temp (C)',
				line: {color: '#08FF08'}
			}
		];
		this.chartLayout = {
			width: 900,
			height: 400,
			title: 'Temperature Last 24 hrs (C)',
			font: { color: "#ffffff" },
			plot_bgcolor: 'rgba(0,0,0,0)',
			paper_bgcolor: 'rgba(0,0,0,0)',
			yaxis: {
				autorange: false,
				range: [-30, 40],
				type: 'linear'
			}
		};

		this.lightchartData = [
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Light Level (lux)',
				line: {color: '#17BECF'},
				}
		];
		this.lightchartLayout = {
			width: 900,
			height: 400,
			font: { color: "#ffffff" },
			plot_bgcolor: 'rgba(0,0,0,0)',
			paper_bgcolor: 'rgba(0,0,0,0)',
			title: 'Light Level Last 24 hrs (lux)',
			yaxis: {
				autorange: false,
				range: [0, 6000],
				type: 'linear'
			}
		};
	}

	setAirTempDials(value, reference)
	{
		this.dialData[0].value = value;
		this.dialData[0].delta.reference = reference;
	}

	setGroundTempDials(value, reference)
	{
		this.dialData[1].value = value;
		this.dialData[1].delta.reference = reference;
	}

	setLightLevelDials(value, reference)
	{
		this.dialData[2].value = value;
		this.dialData[2].delta.reference = reference;
	}

	setAirTempChart(timedata, ydata)
	{
		this.chartData[0].x = timedata;
		this.chartData[0].y = ydata;
	}

	setGroundTempChart(timedata, ydata)
	{
		this.chartData[1].x = timedata;
		this.chartData[1].y = ydata;
	}

	setLightLevelChart(timedata, ydata)
	{
		this.lightchartData[0].x = timedata;
		this.lightchartData[0].y = ydata;
	}

	drawWidgets()
	{
		Plotly.react(this.dialDiv,this.dialData, this.dialLayout, { responsive: true });
		Plotly.react(this.temperatureChartDiv, this.chartData, this.chartLayout);
		Plotly.react(this.lightChartDiv, this.lightchartData, this.lightchartLayout);		  			  
	}

}

var alreadyInitialized = false;

function updateSolarWidgets()
{
		var weatherWidgets = new WeatherWidgets();
		if (!alreadyInitialized)
		{
			weatherWidgets.drawWidgets();
			alreadyInitialized = true;
		}
		var loading = document.getElementById("status_loading");
		loading.hidden = false;
		var loaded = document.getElementById("status_loaded");
		loaded.hidden = true;

		// Download and clean up our data
		(async function () {
			var trailcamdata = await getRESTData(getThingsSpeakURLByDate("tempdata"));
			var timedata_x = new Array();
			var airtempdata_y = new Array();
			var lightdata_y = new Array();
			var maxtemp = 0.0;
			var currenttemp = 0.0;
			var maxlight = 0;
			var currentlight = 0;
			trailcamdata.feeds.forEach(item => {
				var temp = parseFloat(item['field3'])
				var light = parseFloat(item['field4'])
				timedata_x.push(item['created_at']);
				airtempdata_y.push(temp);
				lightdata_y.push(light);
				if (temp>maxtemp)
				{
					maxtemp = temp;
				}
				if (light>maxlight)
				{
					maxlight = light;
				}

			});
			currenttemp = airtempdata_y[airtempdata_y.length-1];
			currentlight = lightdata_y[lightdata_y.length-1];

			weatherWidgets.setAirTempDials(currenttemp, maxtemp);
			weatherWidgets.setLightLevelDials(currentlight, maxlight);
			weatherWidgets.setAirTempChart(timedata_x, airtempdata_y);
			weatherWidgets.setLightLevelChart(timedata_x, lightdata_y);
			weatherWidgets.drawWidgets();
			loading.hidden = true;
			loaded.hidden = false;
		})();

		(async function () {
			var sensordata = await getRESTData(getThingsSpeakURLByDate("espdata"));
			var timedata_x = new Array();
			var groundtempdata_y = new Array();
			var maxgroundtemp = 0.0;
			var currentgroundtemp = 0.0;
			sensordata.feeds.forEach(item => {
				// Clean up field2 and field5 because nothing else is actually used
				var groundtemp = parseFloat(item['field2']);
				var rainlevel = parseFloat(item['field5']);
				timedata_x.push(item['created_at']);
				groundtempdata_y.push(groundtemp);
				if (groundtemp>maxgroundtemp)
				{
					maxgroundtemp = groundtemp;
				}
			});
			currentgroundtemp = groundtempdata_y[groundtempdata_y.length-1];

			weatherWidgets.setGroundTempDials(currentgroundtemp, maxgroundtemp);
			weatherWidgets.setGroundTempChart(timedata_x, groundtempdata_y);
			weatherWidgets.drawWidgets();
		})();

		(async function() {
			var espage = await getRESTData(getThingsSpeakURL("espage"));
			var loaded_text = document.getElementById("status_text");
			if (espage.last_data_age>3600)
			{
				loaded_text.innerHTML="Loaded but Stale (offline?)";
			}
			else if (espage.last_data_age>600)
			{
				loaded_text.innerHTML="Loaded but Old";
			}
			else 
			{
				loaded_text.innerHTML="Loaded and Up to Date";
			}
		})();
}


;(function($, window) {

	$(document).ready(function() {
		updateSolarWidgets();
		window.setInterval(updateSolarWidgets, 60000);
	}); // End (document).ready
})(jQuery, window);