;(function($, window) {

	$(document).ready(function() {
		// Create the dials for the current data display
		var dialdata = [
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

		var diallayout = {
			width: 900,
			height: 300,
			margin: { t: 10, b: 10, l: 50, r: 50 },
			grid: { rows: 1, columns: 3, pattern: "independent" },
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
				name: 'Air Temp (C)',
				line: {color: '#17BECF'}
			},
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Ground Temp (C)',
				line: {color: '#C8A2C8'}
			}
		];
		var chartlayout = {
			width: 900,
			height: 400,
			title: 'Temperature Last 24 hrs (C)',
			yaxis: {
				autorange: false,
				range: [-30, 40],
				type: 'linear'
			}
		};
		Plotly.newPlot('temperatureChart', chartdata, chartlayout);			  			  

		var lightchartdata = [
			{
				x: [dateString],
				y: [0],
				type: 'scatter',
				mode: "lines",
				name: 'Light Level (lux)',
				line: {color: '#17BECF'}
			}
		];
		var lightchartlayout = {
			width: 900,
			height: 400,
			title: 'Light Level Last 24 hrs (lux)',
			yaxis: {
				autorange: false,
				range: [0, 6000],
				type: 'linear'
			}
		};
		Plotly.newPlot('lightChart', lightchartdata, lightchartlayout);		  			  


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
			//console.log(trailcamdata);
			//console.log(airtempdata_y);
			dialdata[0].value = currenttemp;
			dialdata[0].delta.reference = maxtemp;
			dialdata[2].value = currentlight;
			dialdata[2].delta.reference = maxlight;

			Plotly.react('dials', dialdata, diallayout);

			chartdata[0].x = timedata_x;
			chartdata[0].y = airtempdata_y;
			Plotly.react('temperatureChart', chartdata, chartlayout);			  			  

			lightchartdata[0].x = timedata_x;
			lightchartdata[0].y = lightdata_y;
			Plotly.newPlot('lightChart', lightchartdata, lightchartlayout);		  			  
		})();

		// (async function () {
		// 	solardata = await getdata("espdata");
		// 	solardata.feeds.forEach(item => {
		// 		item['field1'] = parseFloat(item['field1']);
		// 		item['field2'] = parseFloat(item['field2']);
		// 		item['field3'] = parseFloat(item['field3']);
		// 		item['field4'] = parseFloat(item['field4']);
		// 		item['field5'] = parseFloat(item['field5']);
		// 		item['field6'] = parseFloat(item['field6']);
		// 		item['field7'] = parseFloat(item['field7']);
		// 		item['field8'] = parseFloat(item['field8']);
		// 		item['pvpower'] = item['field1'] * item['field2'];
		// 		item['batpower'] = item['field3'] * item['field4'];
		// 	});
		// 	console.log(solardata);
		// })();

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
			//console.log(sensordata);
			dialdata[1].value = currentgroundtemp;
			dialdata[1].delta.reference = maxgroundtemp;
			Plotly.react('dials', dialdata, diallayout);

			chartdata[1].x = timedata_x;
			chartdata[1].y = groundtempdata_y;
			Plotly.react('temperatureChart', chartdata, chartlayout);			  			  

		})();
	}); // End (document).ready
})(jQuery, window);