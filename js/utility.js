
/**
 * @file Bunch of utilities to handle getting data from ThingsSpeak channels
 * @author Mark Buckaway <mark@buckaway.ca>
 * @version 0.1
 */

/**
  * List of thingsspeak urls for out channels
  */
var thingspeakurls =
    {
        "tempdata": "https://api.thingspeak.com/channels/738696/feeds.json",
        "solardata": "https://api.thingspeak.com/channels/1228246/feeds.json",
        "espdata": "https://api.thingspeak.com/channels/1191345/feeds.json",
        "espage": "https://api.thingspeak.com/channels/1191345/feeds/last_data_age.json",
        "solarage": "https://api.thingspeak.com/channels/1228246/feeds/last_data_age.json",
        "tempage": "https://api.thingspeak.com/channels/738696/feeds/last_data_age.json",
    };


/**
  * Gets the current date as a UTC date string (only the date, the time is 00:00:00)
  */
function getDateString()
{
    var datetoday = new Date();
    // Use yesterday's date for testing
    //datetoday.setDate(datetoday.getDate() - 1)
    var dateString = datetoday.getFullYear() + "-" + (datetoday.getMonth()+1) + "-" + datetoday.getDate() + "T00:00:00.000Z";
    return dateString;
}

/**
  * Gets the Thingspeak URL with the date filter
  * @param urlname Name of the URL from the thinkspeakurls hash
  */
function getThingsSpeakURLByDate(urlname)
{
    var dateString = getDateString();
//    var result = thingspeakurls[urlname] + "?days=1&start=" + dateString;
    var result = thingspeakurls[urlname] + "?days=1&timezone=America%2FNew_York";
    //var result = thingspeakurls[urlname] + "?count=1440";
    return result;
}

/**
  * Gets the Thingspeak URL with the date filter
  * @param urlname Name of the URL from the thinkspeakurls hash
  */
 function getThingsSpeakURLLastItem(urlname)
 {
     var result = thingspeakurls[urlname] + "?results=1";
     return result;
 }

/**
  * Gets the Thingspeak URL without any filter
  * @param urlname Name of the URL from the thinkspeakurls hash
  */
 function getThingsSpeakURL(urlname)
 {
     var result = thingspeakurls[urlname];
     return result;
 }

 /**
  * Gets the json Data from a REST call. This generic and works anywhere.
  * This uses the HTTP GET to retrieve data.
  * Example Usage:
  * async function () {
  *     var trailcamdata = await getRESTData(getThingsSpeakURLLastItem("tempdata"));
  * })();
  * @param url Fullly qualified URL to use
  */

async function getRESTData(url) {
    try {
        return await ( 
            await fetch(url,
                {
                    headers: { "Content-Type": "application/json" },
                    method: "GET"
                }
            )
        ).json();
    } catch(e) { console.log(e); }
}
