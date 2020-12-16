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
				title: { text: "Current Solar Panel Voltage (V)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 40] } }
			},
			{
				domain: { row: 0, column: 1 },
				value: 0,
				title: { text: "Current Battery Voltage (V)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 40] } }
			},
			{
				domain: { row: 1, column: 0 },
				value: 0,
				title: { text: "Current Solar Power Output (W)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 250] } }
			},
			{
				domain: { row: 1, column: 1 },
				value: 0,
				title: { text: "Current Battery State of Charge (%)" },
				type: "indicator",
				mode: "number+delta+gauge",
				delta: { reference: 0 },
				gauge: { axis: { range: [0, 100] } }
			},
			];

		this.dialLayout = {
			width: 800,
			height: 500,
			margin: { t: 30, b: 10, l: 50, r: 50 },
			grid: { rows: 2, columns: 2, pattern: "independent" },
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
				name: 'Solar Panel Power',
				line: {color: '#FFE900'}
			},
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Battery Power',
				line: {color: '#08FF08'}
			}
		];
		this.chartLayout = {
			width: 900,
			height: 400,
			title: 'Power Output Today (C)',
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
				name: 'Battery Start of Charge Last 24hrs (%)',
				line: {color: '#FFE900'}
			}
		];
		this.socChartLayout = {
			width: 900,
			height: 400,
			title: 'Battery Start of Charge Last 24hrs (%)',
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

	setPVVoltageDials(value, reference)
	{
		this.dialData[0].value = value;
		this.dialData[0].delta.reference = reference;
	}

	setBatVoltageDials(value, reference)
	{
		this.dialData[1].value = value;
		this.dialData[1].delta.reference = reference;
	}

	setSolarPowerDials(value, reference)
	{
		this.dialData[2].value = value;
		this.dialData[2].delta.reference = reference;
	}

	setSOCDials(value, reference)
	{
		this.dialData[3].value = value;
		this.dialData[3].delta.reference = reference;
	}

	setChartTime(timedata)
	{
		this.chartData[0].x = timedata;
		this.chartData[1].x = timedata;
		this.socChartData[0].x = timedata;
	}

	setSolarPowerSeries(ydata)
	{
		this.chartData[0].y = ydata;
	}

	seBatPowerSeries(ydata)
	{
		this.chartData[1].y = ydata;
	}

	setSOCSeries(ydata)
	{
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
	var solarWidgets = new SolarWidgets();
	// First time threw, just draw empty widgets
	if (!alreadyInitialized)
	{
		console.log("Drawing windows the first time....");
		solarWidgets.drawWidgets();
		alreadyInitialized = true;
	}
	console.log("Updating...");

	(async function() {
		var loading = document.getElementById("status_loading");
		loading.hidden = false;
		var loaded = document.getElementById("status_loaded");
		loaded.hidden = true;

		var timedata_x = new Array();
		var pvpowerdata_y = new Array();
		var batpowerdata_y = new Array();
		var batsocdata_y = new Array();
		var maxpvpower = 0.0;
		var maxpvvoltage = 0.0;
		var maxbatvoltage = 0.0;
		var maxbatsoc = 0;
		var solardata = await getRESTData(getThingsSpeakURLByDate("solardata"));
		solardata.feeds.forEach(item => {
			//var date = new Date(item['created_at']);
			//var dateString = date.toISOString()
			timedata_x.push(item['created_at']);
			var pvvoltage = parseFloat(item['field1']);
			var pvpower = pvvoltage * parseFloat(item['field2']);
			pvpowerdata_y.push(pvpower);
			var batvoltage = parseFloat(item['field3']);
			var batpower =  batvoltage * parseFloat(item['field4']);
			batpowerdata_y.push(batpower);
			var batsoc = parseInt(item['field7']);
			batsocdata_y.push(batsoc);
			if (pvpower>maxpvpower)
			{
				maxpvpower = pvpower;
			}
			if (pvvoltage>maxpvvoltage)
			{
				maxpvvoltage = pvvoltage;
			}
			if (batvoltage>maxbatvoltage)
			{
				maxbatvoltage = batvoltage;
			}
			if (batsoc>maxbatsoc)
			{
				maxbatsoc = batsoc;
			}
		});
		var lastitem = solardata.feeds[solardata.feeds.length-1];
		var currentpvvoltage = parseFloat(lastitem['field1']);
		var currentbatvoltage = parseFloat(lastitem['field3']);
		var currentbatsoc = parseInt(lastitem['field7']);
		var currentpvpower = currentpvvoltage * parseFloat(lastitem['field2']);

		solarWidgets.setPVVoltageDials(currentpvvoltage, maxpvvoltage);
		solarWidgets.setBatVoltageDials(currentbatvoltage, maxbatvoltage);
		solarWidgets.setSolarPowerDials(currentpvpower, maxpvpower);
		solarWidgets.setSOCDials(currentbatsoc, maxbatsoc);

		solarWidgets.setChartTime(timedata_x);
		solarWidgets.setSolarPowerSeries(pvpowerdata_y);
		solarWidgets.seBatPowerSeries(batpowerdata_y);

		solarWidgets.setSOCSeries(batsocdata_y);

		solarWidgets.drawWidgets();				
		loading.hidden = true;
		loaded.hidden = false;
	})();

	(async function() {
		var solarage = await getRESTData(getThingsSpeakURL("solarage"));
		var loaded_text = document.getElementById("status_text");
		if (solarage.last_data_age>3600)
		{
			loaded_text.innerHTML="Loaded but Stale (offline?)";
		}
		else if (solarage.last_data_age>600)
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