;(function($, window) {

	$(document).ready(function() {

		// Download and clean up our data
		(async function () {
			var trailstatusdata = await getRESTData("https://api.trailstatusapp.com/regions/status?id=da89b866-ef8d-4853-aab3-7c0f3a1c2fbd");
			var tsstatusimg = document.getElementById('tsphotoimg');
			tsstatusimg.src = trailstatusdata.imageUrl;
			var tsstatustext = document.getElementById('tstext');
			tsstatustext.innerHTML="<h2 align='center'>Trails are " + trailstatusdata.status.toUpperCase() + "</h2>";
			var tsmessagetext = document.getElementById('tsmessage');
			tsmessagetext.innerHTML = "<h3 align='center'>" + trailstatusdata.message + "</h3>";
			var tsupdatedtext = document.getElementById('tsupdated');
			var updatedDate = new Date(trailstatusdata.updatedAt);
			tsupdatedtext.innerHTML = "<h3 align='center'>Last Updated: " + updatedDate.toString() + "</h3>";
			
		})();

	}); // End (document).ready
})(jQuery, window);