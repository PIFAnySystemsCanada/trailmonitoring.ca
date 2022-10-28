class WeatherWidgets
{
	constructor()
	{
		this.dialDiv = 'dials';
		this.lightChartDiv = 'lightChart';
		this.rainChartDiv = 'rainChart'
		this.temperatureChartDiv = 'temperatureChart';
		this.humidityChartDiv = 'humidityChart';
		this.airPressureChartDiv = 'airPressureChart';
		// Create the dials for the current data display
		this.dialData = [
			{
				domain: { row: 0, column: 0 },
				value: 0,
				title: { text: "Current Air Temp (C)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [-30, 40] } }
			},
			{
				domain: { row: 0, column: 1 },
				value: 0,
				title: { text: "Current Humidity (%)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 100] } }
			  },
			{
				domain: { row: 0, column: 2 },
				value: 0,
				title: { text: "Current Ground Temp (C)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [-30, 40] } }
			  },
			  {
				domain: { row: 0, column: 3 },
				value: 0,
				title: { text: "Current Light Level (lux)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 5000] } }
			  },
			  {
				domain: { row: 1, column: 0 },
				value: 0,
				title: { text: "Humidex (C)" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [-30, 50] } }
			  },
			  {
				domain: { row: 1, column: 1 },
				value: 0,
				title: { text: "Rain per Hour (mm)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 100] } }
			  },
			  {
				domain: { row: 1, column: 2 },
				value: 0,
				title: { text: "Ground Moisture" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 2500] } }
			  },
			  {
				domain: { row: 1, column: 3 },
				value: 0.0,
				title: { text: "Air Pressure (hpa)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [900, 1200] } }
			  },
			  {
				domain: { row: 2, column: 0 },
				value: 0,
				title: { text: "Event Rainfall (mm)" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 100] } }
			  },
			  {
				domain: { row: 2, column: 1 },
				value: 0,
				title: { text: "Period Rainfall (mm)" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 100] } }
			  },
			  {
				domain: { row: 2, column: 2 },
				value: 0,
				title: { text: "Dewpoint (C)" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [-10, 40] } }
			  },
			];

		this.dialLayout = {
			width: 1200,
			height: 750,
			margin: { t: 10, b: 10, l: 40, r: 50 },
			grid: { rows: 3, columns: 4, pattern: "independent" },
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
		this.rainChartLayout = {
			width: 1200,
			height: 400,
			title: 'Rain 6hrs (mm)',
			font: { color: "#ffffff" },
			plot_bgcolor: 'rgba(0,0,0,0)',
			paper_bgcolor: 'rgba(0,0,0,0)',
			yaxis: {
				autorange: false,
				range: [0, 40],
				type: 'linear'
			}
		};

		this.rainChartData = [
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Rain (mm)',
				line: {color: '#FFE900'}
			}
		];
		this.chartLayout = {
			width: 1200,
			height: 400,
			title: 'Temperature Last 6hrs (C)',
			font: { color: "#ffffff" },
			plot_bgcolor: 'rgba(0,0,0,0)',
			paper_bgcolor: 'rgba(0,0,0,0)',
			yaxis: {
				autorange: false,
				range: [-30, 40],
				type: 'linear'
			}
		};

		this.humidityChartData = [
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Humidity (%)',
				line: {color: '#17BECF'},
				}
		];
		this.humidityChartLayout = {
			width: 1200,
			height: 400,
			font: { color: "#ffffff" },
			plot_bgcolor: 'rgba(0,0,0,0)',
			paper_bgcolor: 'rgba(0,0,0,0)',
			title: 'Humidity Last 6hrs (%)',
			yaxis: {
				autorange: false,
				range: [0, 100],
				type: 'linear'
			}
		};

		this.airPressureChartData = [
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Air Pressure (hpa)',
				line: {color: '#17BECF'},
				}
		];
		this.airPressureChartLayout = {
			width: 1200,
			height: 400,
			font: { color: "#ffffff" },
			plot_bgcolor: 'rgba(0,0,0,0)',
			paper_bgcolor: 'rgba(0,0,0,0)',
			title: 'Air Pressure Last 6hrs (hpa)',
			yaxis: {
				autorange: false,
				range: [900, 1100],
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
			width: 1200,
			height: 400,
			font: { color: "#ffffff" },
			plot_bgcolor: 'rgba(0,0,0,0)',
			paper_bgcolor: 'rgba(0,0,0,0)',
			title: 'Light Level Last 6hrs (lux)',
			yaxis: {
				autorange: false,
				range: [0, 50000],
				type: 'linear'
			}
		};
	}

	setAirTempDials(value, reference)
	{
		this.dialData[0].value = value;
		this.dialData[0].delta.reference = reference;
	}

	setHumidityDials(value, reference)
	{
		this.dialData[1].value = value;
		this.dialData[1].delta.reference = reference;
	}

	setGroundTempDials(value, reference)
	{
		this.dialData[2].value = value;
		this.dialData[2].delta.reference = reference;
	}

	setLightLevelDials(value, reference)
	{
		this.dialData[3].value = value;
		this.dialData[3].delta.reference = reference;
	}

	setHumidexDials(value)
	{
		this.dialData[4].value = value;
	}

	setRainPerHourDials(value, reference)
	{
		this.dialData[5].value = value;
		this.dialData[5].delta.reference = reference;
	}

	setGroundMoistureDials(value)
	{
		this.dialData[6].value = value;
	}

	setAirPressureDials(value, reference)
	{
		this.dialData[7].value = value;
		this.dialData[7].delta.reference = reference;
	}

	setEventRainfallDials(value)
	{
		this.dialData[8].value = value;
	}

	setPeriodRainfallDials(value)
	{
		this.dialData[9].value = value;
	}

	setDewpointDials(value)
	{
		this.dialData[10].value = value;
	}

	setRainPerHourChart(timedata, ydata)
	{
		this.rainChartData[0].x = timedata;
		this.rainChartData[0].y = ydata;
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

	setHumidityChart(timedata, ydata)
	{
		this.humidityChartData[0].x = timedata;
		this.humidityChartData[0].y = ydata;
	}

	setAirPressureChart(timedata, ydata)
	{
		this.airPressureChartData[0].x = timedata;
		this.airPressureChartData[0].y = ydata;
	}

	setLightLevelChart(timedata, ydata)
	{
		this.lightchartData[0].x = timedata;
		this.lightchartData[0].y = ydata;
	}

	drawWidgets()
	{
		Plotly.react(this.dialDiv,this.dialData, this.dialLayout, { responsive: true });
		Plotly.react(this.temperatureChartDiv, this.chartData, this.chartLayout, { responsive: true });
		Plotly.react(this.humidityChartDiv, this.humidityChartData, this.humidityChartLayout, { responsive: true });
		Plotly.react(this.airPressureChartDiv, this.airPressureChartData, this.airPressureChartLayout, { responsive: true });
		Plotly.react(this.rainChartDiv, this.rainChartData, this.rainChartLayout, { responsive: true });		  			  
		Plotly.react(this.lightChartDiv, this.lightchartData, this.lightchartLayout, { responsive: true });		  			  
	}

}

var alreadyInitialized = false;

function updateWeatherWidgets()
{
		var lasttime = new Date()
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
			var lightdata = await getRESTData(getUrl("snyders", "lightlevel", "series"));
			var timedata_x = new Array();
			var lightdata_y = new Array();
			var currentlight = lightdata["items"]["last"]["value"];
			lightdata.items.data.forEach( item => {
				var temp = parseFloat(item['value']);
			 	timedata_x.push(item['time']);
			 	lightdata_y.push(temp);
			});

			weatherWidgets.setLightLevelDials(currentlight, 5500);
			weatherWidgets.setLightLevelChart(timedata_x, lightdata_y);
			weatherWidgets.drawWidgets();
			loading.hidden = true;
			loaded.hidden = false;
		})();

		(async function () {
			var raindata = await getRESTData(getUrl("snyders", "mm_per_hour_rain", "series"));
			var timedata_x = new Array();
			var raindata_y = new Array();
			var currentrain = raindata["items"]["last"]["value"];
			var maxrain = raindata["items"]["max"]["value"];
			raindata.items.data.forEach( item => {
				var temp = parseFloat(item['value']);
			 	timedata_x.push(item['time']);
			 	raindata_y.push(temp);
			});

			weatherWidgets.setRainPerHourDials(currentrain, maxrain);
			weatherWidgets.setRainPerHourChart(timedata_x, raindata_y);
			weatherWidgets.drawWidgets();
			loading.hidden = true;
			loaded.hidden = false;
		})();

		(async function () {
			var temperaturedata = await getRESTData(getUrl("snyders", "temperature", "series"));
			var timedata_x = new Array();
			var airtempdata_y = new Array();
			var maxtemp = temperaturedata.items.max.value;
			var currenttemp = temperaturedata["items"]["last"]["value"];
			lasttime = temperaturedata["items"]["last"]["time"];
			temperaturedata.items.data.forEach( item => {
				var temp = parseFloat(item['value']);
			 	timedata_x.push(item['time']);
			 	airtempdata_y.push(temp);
			});

			weatherWidgets.setAirTempDials(currenttemp, maxtemp);
			weatherWidgets.setAirTempChart(timedata_x, airtempdata_y);
			weatherWidgets.drawWidgets();
			loading.hidden = true;
			loaded.hidden = false;
		})();

		(async function () {
			var humiditydata = await getRESTData(getUrl("snyders", "humidity", "series"));
			var timedata_x = new Array();
			var humiditydata_y = new Array();
			var maxhumidiy = humiditydata.items.max.value;
			var currenthumidity = humiditydata["items"]["last"]["value"];
			humiditydata.items.data.forEach( item => {
				var temp = parseFloat(item['value']);
			 	timedata_x.push(item['time']);
			 	humiditydata_y.push(temp);
			});

			weatherWidgets.setHumidityDials(currenthumidity, maxhumidiy);
			weatherWidgets.setHumidityChart(timedata_x, humiditydata_y);
			weatherWidgets.drawWidgets();
			loading.hidden = true;
			loaded.hidden = false;
		})();

		(async function () {
			var airpressuredata = await getRESTData(getUrl("snyders", "pressure", "series"));
			var timedata_x = new Array();
			var airpressuredata_y = new Array();
			var maxairpressure = airpressuredata.items.max.value;
			var currentairpressure = airpressuredata["items"]["last"]["value"];
			airpressuredata.items.data.forEach( item => {
				var temp = parseFloat(item['value']);
			 	timedata_x.push(item['time']);
			 	airpressuredata_y.push(temp);
			});

			weatherWidgets.setAirPressureDials(currentairpressure, maxairpressure);
			weatherWidgets.setAirPressureChart(timedata_x, airpressuredata_y);
			weatherWidgets.drawWidgets();
			loading.hidden = true;
			loaded.hidden = false;
		})();

		(async function () {
			var sensordata = await getRESTData(getUrl("snyders", "groundtemperature", "series"));
			var ok = sensordata["properties"]["ok"]
			if (ok != "1") {
				console.log("unable to get ground temp data")
			}
			var timedata_x = new Array();
			var groundtempdata_y = new Array();
			var maxgroundtemp = sensordata["items"]["max"]["value"];
			var currentgroundtemp = sensordata["items"]["last"]["value"];
			sensordata.items.data.forEach(item => {
				var groundtemp = parseFloat(item['field2']);
				timedata_x.push(item['time']);
				groundtempdata_y.push(groundtemp);
			});
			weatherWidgets.setGroundTempDials(currentgroundtemp, maxgroundtemp);
			weatherWidgets.setGroundTempChart(timedata_x, groundtempdata_y);
			weatherWidgets.drawWidgets();
		})();

		(async function () {
			var sensordata = await getRESTData(getUrl("snyders", "event_acc_rain", "last"));
			var ok = sensordata["properties"]["ok"]
			if (ok != "1") {
				console.log("unable to get ground temp data");
			}
			var currenteventrain = sensordata["items"]["value"];
			weatherWidgets.setEventRainfallDials(currenteventrain);
			weatherWidgets.drawWidgets();
		})();

		(async function () {
			var sensordata = await getRESTData(getUrl("snyders", "current_acc_rain", "last"));
			var ok = sensordata["properties"]["ok"]
			if (ok != "1") {
				console.log("unable to get ground temp data");
			}
			var currenteventrain = sensordata["items"]["value"];
			weatherWidgets.setPeriodRainfallDials(currenteventrain);
			weatherWidgets.drawWidgets();
		})();

		(async function () {
			var sensordata = await getRESTData(getUrl("snyders", "dewpoint", "last"));
			var ok = sensordata["properties"]["ok"]
			if (ok == "1") {
				var currenteventrain = sensordata["items"]["value"];
				weatherWidgets.setDewpointDials(currenteventrain);
				weatherWidgets.drawWidgets();
			} else {
				console.log("unable to get dewpoint data");
			}
		})();

		(async function () {
			var sensordata = await getRESTData(getUrl("snyders", "humidex", "last"));
			var ok = sensordata["properties"]["ok"]
			if (ok == "1") {
				var currentvalue = sensordata["items"]["value"];
				weatherWidgets.setHumidexDials(currentvalue);
				weatherWidgets.drawWidgets();
			} else {
				console.log("unable to get dewpoint data");
			}
		})();

		(async function () {
			var sensordata = await getRESTData(getUrl("snyders", "groundmoisture", "last"));
			var ok = sensordata["properties"]["ok"]
			if (ok == "1") {
				var currentvalue = sensordata["items"]["value"];
				weatherWidgets.setGroundMoistureDials(currentvalue);
				weatherWidgets.drawWidgets();
			} else {
				console.log("unable to get dewpoint data");
			}
		})();

		(async function() {
			var loaded_text = document.getElementById("status_text");
			var age = Date.now() - lasttime;
			if (age>3600000)
			{
				loaded_text.innerHTML="Loaded but Stale (offline?)";
			}
			else if (age>600000)
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
		updateWeatherWidgets();
		window.setInterval(updateWeatherWidgets, 60000);
	}); // End (document).ready
})(jQuery, window);