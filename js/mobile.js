class WeatherWidgetsMobile
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
				title: { text: "Ground Moisture" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 2500] } }
			},
			{
				domain: { row: 0, column: 1 },
				value: 0,
				title: { text: "Current Air Temp (C)" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [-30, 40] } }
			},
			{
				domain: { row: 1, column: 0 },
				value: 0,
				title: { text: "Current Ground Temp (C)" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [-30, 40] } }
			},
			{
				domain: { row: 1, column: 1 },
				value: 0,
				title: { text: "Rain per Hour (mm)" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 100] } }
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
				domain: { row: 3, column: 0 },
				value: 0,
				title: { text: "Dewpoint (C)" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [-10, 40] } }
			}
		];

		this.dialLayout = {
			width: 600,
			height: 1000,
			margin: { t: 10, b: 10, l: 40, r: 50 },
			grid: { rows: 4, columns: 2, pattern: "independent" },
			font: { color: "#ffffff" },
			plot_bgcolor: 'rgba(0,0,0,0)',
			paper_bgcolor: 'rgba(0,0,0,0)',
			template: {
				data: {
				indicator: [
					{
					mode: "number+gauge",
					}
				]}
			}
		};
	}

	setGroundMoistureDials(value)
	{
		this.dialData[0].value = value;
	}
	
	setAirTempDials(value)
	{
		this.dialData[1].value = value;
	}

	setGroundTempDials(value)
	{
		this.dialData[2].value = value;
	}

	setRainPerHourDials(value)
	{
		this.dialData[3].value = value;
	}

	setEventRainfallDials(value)
	{
		this.dialData[4].value = value;
	}

	setPeriodRainfallDials(value)
	{
		this.dialData[5].value = value;
	}

	setDewpointDials(value)
	{
		this.dialData[6].value = value;
	}

	drawWidgets()
	{
		Plotly.react(this.dialDiv,this.dialData, this.dialLayout, { responsive: true });
	}
}

var alreadyInitialized = false;

function updateWeatherWidgets()
{
		var lasttime = new Date()
		var weatherWidgets = new WeatherWidgetsMobile();
		if (!alreadyInitialized)
		{
			weatherWidgets.drawWidgets();
			alreadyInitialized = true;
		}
		var loading = document.getElementById("status_loading");
		loading.hidden = false;
		var loaded = document.getElementById("status_loaded");
		loaded.hidden = true;

		(async function () {
			var raindata = await getRESTData(getUrl("snyders", "mm_per_hour_rain", "last"));
			var currentrain = raindata["items"]["value"];
			weatherWidgets.setRainPerHourDials(currentrain);
			weatherWidgets.drawWidgets();
			loading.hidden = true;
			loaded.hidden = false;
		})();

		(async function () {
			var temperaturedata = await getRESTData(getUrl("snyders", "temperature", "last"));
			var currenttemp = temperaturedata["items"]["value"];
			weatherWidgets.setAirTempDials(currenttemp);
			weatherWidgets.drawWidgets();
			loading.hidden = true;
			loaded.hidden = false;
		})();

		(async function () {
			var sensordata = await getRESTData(getUrl("snyders", "groundtemperature", "last"));
			var currentgroundtemp = sensordata["items"]["value"];
			weatherWidgets.setGroundTempDials(currentgroundtemp);
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