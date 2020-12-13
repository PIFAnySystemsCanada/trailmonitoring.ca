;(function($, window) {

	$(document).ready(function() {
		// Create the dials for the current data display
		var dialdata = [
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
				title: { text: "Current Battery Panel Voltage (V)" },
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

		var diallayout = {
			width: 750,
			height: 500,
			margin: { t: 30, b: 10, l: 50, r: 50 },
			grid: { rows: 2, columns: 2, pattern: "independent" },
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
		Plotly.newPlot('dials', dialdata, diallayout);

		// Create the charts for the historical display
		var dateString = getDateString();
		var chartdata = [
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Solar Panel Power',
				line: {color: '#17BECF'}
			},
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Battery Power',
				line: {color: '#C8A2C8'}
			}
		];
		var chartlayout = {
			width: 900,
			height: 400,
			title: 'Power Output 24 hrs (C)',
			yaxis: {
				autorange: false,
				range: [0, 100],
				type: 'linear'
			}
		};
		Plotly.newPlot('powerChart', chartdata, chartlayout);			  			  

		var socchartdata = [
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Battery Start of Charge (%)',
				line: {color: '#17BECF'}
			}
		];
		var socchartlayout = {
			width: 900,
			height: 400,
			title: 'Battery Start of Charge Last 24 hrs (%)',
			yaxis: {
				autorange: false,
				range: [0, 100],
				type: 'linear'
			}
		};
		Plotly.newPlot('batsocChart', socchartdata, socchartlayout);		  			  

		(async function () {
			var timedata_x = new Array();
			var pvpowerdata_y = new Array();
			var batpowerdata_y = new Array();
			var batsocdata_y = new Array();
			var maxpvpower = 0.0;
			var maxpvvoltage = 0.0;
			var maxbatvoltage = 0.0;
			var maxbatsoc = 0;
			solardata = await getRESTData(getThingsSpeakURLByDate("solardata"));
			solardata.feeds.forEach(item => {
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

			dialdata[0].value = currentpvvoltage;
			dialdata[0].delta.reference = maxpvvoltage;
			dialdata[1].value = currentbatvoltage;
			dialdata[1].delta.reference = maxbatvoltage;
			dialdata[2].value = currentpvpower;
			dialdata[2].delta.reference = maxpvpower;
			dialdata[3].value = currentbatsoc;
			dialdata[3].delta.reference = maxbatsoc;

			Plotly.react('dials', dialdata, diallayout);

			chartdata[0].x = timedata_x;
			chartdata[0].y = pvpowerdata_y;
			chartdata[1].x = timedata_x;
			chartdata[1].y = batpowerdata_y;
			Plotly.react('powerChart', chartdata, chartlayout);			  			  

			socchartdata[0].x = timedata_x;
			socchartdata[0].y = batsocdata_y;
			Plotly.newPlot('batsocChart', socchartdata, socchartlayout);		  			  

		})();

	}); // End (document).ready
})(jQuery, window);