class SolarWidgets
{
	constructor()
	{
		this.dialDiv = 'dials';
		this.powerChartDiv = 'powerChart';
		this.batsocChartDiv = 'batsocChart';

		// Create the dials for the current data display
		this.dialData = [
			{
				domain: { row: 0, column: 0 },
				value: 0,
				title: { text: "Array Voltage (V)" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 40] } }
			},
			{
				domain: { row: 0, column: 1 },
				value: 0,
				title: { text: "Battery Voltage (V)" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 40] } }
			},
			{
				domain: { row: 0, column: 2 },
				value: 0,
				title: { text: "Load Power (W)" },
				type: "indicator",
				mode: "number+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 40] } }
			},
			{
				domain: { row: 1, column: 0 },
				value: 0,
				title: { text: "Array Power Output (W)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 250] } }
			},
			{
				domain: { row: 1, column: 1 },
				value: 0,
				title: { text: "Battery SOC (%)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 100] } }
			},
			];

		this.dialLayout = {
			width: 1100,
			height: 500,
			margin: { t: 30, b: 10, l: 50, r: 50 },
			grid: { rows: 2, columns: 3, pattern: "independent" },
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
				name: 'Array Power',
				line: {color: '#FFE900'}
			}
		];
		this.chartLayout = {
			width: 900,
			height: 400,
			title: 'Array Power 6hrs (W)',
			plot_bgcolor: 'rgba(0,0,0,0)',
			paper_bgcolor: 'rgba(0,0,0,0)',
			font: { color: "#ffffff" },
			yaxis: {
				autorange: false,
				range: [0, 100],
				type: 'linear',
			}
		};
		this.socChartData = [
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Battery SOC Last 6hrs (%)',
				line: {color: '#FFE900'}
			}
		];
		this.socChartLayout = {
			width: 900,
			height: 400,
			title: 'Battery SOC Last 6hrs (%)',
			plot_bgcolor: 'rgba(0,0,0,0)',
			paper_bgcolor: 'rgba(0,0,0,0)',
			font: { color: "#ffffff" },
			yaxis: {
				autorange: false,
				range: [0, 100],
				type: 'linear'
			}
		};
	}

	setPVVoltageDials(value)
	{
		this.dialData[0].value = value;
	}

	setBatVoltageDials(value)
	{
		this.dialData[1].value = value;
	}

	setLoadPowerDials(value)
	{
		this.dialData[2].value = value;
	}

	setArrayPowerDials(value, reference)
	{
		this.dialData[3].value = value;
		this.dialData[3].delta.reference = reference;
	}

	setSOCDials(value, reference)
	{
		this.dialData[4].value = value;
		this.dialData[4].delta.reference = reference;
	}

	setArrayPowerSeries(timedata, ydata)
	{
		this.chartData[0].x = timedata;
		this.chartData[0].y = ydata;
	}

	seBatPowerSeries(ydata)
	{
		this.chartData[1].y = ydata;
	}

	setSOCSeries(timedata, ydata)
	{
		this.socChartData[0].x = timedata;
		this.socChartData[0].y = ydata;
	}

	drawWidgets()
	{
		Plotly.react(this.dialDiv,this.dialData, this.dialLayout, { responsive: true });
		Plotly.react(this.powerChartDiv, this.chartData, this.chartLayout);
		Plotly.react(this.batsocChartDiv, this.socChartData, this.socChartLayout);		  			  
	}
} // End of SolarWidgets class

var alreadyInitialized = false;

function updateSolarWidgets()
{
	var lasttime = new Date()
	var solarWidgets = new SolarWidgets();
	// First time threw, just draw empty widgets
	if (!alreadyInitialized)
	{
		solarWidgets.drawWidgets();
		alreadyInitialized = true;
	}

	var loading = document.getElementById("status_loading");
	loading.hidden = false;
	var loaded = document.getElementById("status_loaded");
	loaded.hidden = true;

	(async function () {
		var solardata = await getRESTData(getUrl("glasgow", "array_voltage", "last"));
		var currentitem = solardata["items"]["value"];
		solarWidgets.setPVVoltageDials(currentitem);
		solarWidgets.drawWidgets();
		loading.hidden = true;
		loaded.hidden = false;
	})();

	(async function () {
		var solardata = await getRESTData(getUrl("glasgow", "battery_voltage", "last"));
		var currentitem = solardata["items"]["value"];
		solarWidgets.setBatVoltageDials(currentitem);
		solarWidgets.drawWidgets();
		loading.hidden = true;
		loaded.hidden = false;
	})();

	(async function () {
		var solardata = await getRESTData(getUrl("glasgow", "load_power", "last"));
		var currentitem = solardata["items"]["value"];
		solarWidgets.setLoadPowerDials(currentitem);
		solarWidgets.drawWidgets();
		loading.hidden = true;
		loaded.hidden = false;
	})();

	(async function () {
		var seriesdata = await getRESTData(getUrl("glasgow", "array_power", "series"));
		var timedata_x = new Array();
		var seriesdata_y = new Array();
		var currentlevel = seriesdata["items"]["last"]["value"];
		var maxlevel = seriesdata["items"]["max"]["value"]
		seriesdata.items.data.forEach( item => {
			var temp = parseFloat(item['value']);
			 timedata_x.push(item['time']);
			 seriesdata_y.push(temp);
		});

		solarWidgets.setArrayPowerDials(currentlevel, maxlevel);
		solarWidgets.setArrayPowerSeries(timedata_x, seriesdata_y);
		solarWidgets.drawWidgets();
		loading.hidden = true;
		loaded.hidden = false;
	})();

	(async function () {
		var seriesdata = await getRESTData(getUrl("glasgow", "battery_soc", "series"));
		var timedata_x = new Array();
		var seriesdata_y = new Array();
		var currentlevel = seriesdata["items"]["last"]["value"];
		var maxlevel = seriesdata["items"]["max"]["value"]
		seriesdata.items.data.forEach( item => {
			var value = parseInt(item['value']);
			timedata_x.push(item['time']);
			seriesdata_y.push(value);
		});

		solarWidgets.setSOCDials(currentlevel, maxlevel);
		solarWidgets.setSOCSeries(timedata_x, seriesdata_y);
		solarWidgets.drawWidgets();
		loading.hidden = true;
		loaded.hidden = false;
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
		updateSolarWidgets();
		window.setInterval(updateSolarWidgets, 60000);
	}); // End (document).ready
})(jQuery, window);