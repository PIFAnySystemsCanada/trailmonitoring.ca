/**
 * @file Bunch of utilities to handle getting data from Timestream Data API
 * @author Mark Buckaway <mark@buckaway.ca>
 * @version 0.2
 */

/**
 * Sensor ID's
 */
var snyders_weather = "synders_0766BC";
var glasgow_weather = "glasgow_e969EC";
var snyders_solar = "snyders_5e6870";
var glasgow_solar = "glasgow_53F0E0";

var api_url = "https://api.trailrabbit.io/timestream"
var measures = {
    "groundtemperature": "weather",
    "temperature": "weather",
    "lightlevel": "weather",
    "pressure": "weather",
    "current_acc_rain": "weather",
    "event_acc_rain": "weather",
    "mm_per_hour_rain": "weather",
    "humidity": "weather",
    "total_rain": "weather",
    "groundmoisture": "weather",
    "dewpoint": "weather",
    "load_power": "solar",
    "battery_current": "solar",
    "array_power": "solar",
    "array_current": "solar",
    "battery_soc": "solar",
    "array_voltage": "solar",
    "battery_power": "solar",
    "load_voltage": "solar",
    "load_current": "solar",
    "battery_temp": "solar",
    "battery_voltage": "solar"    
}

function getMainUrl(type, location) {
    if (type == "weather") {
        if (location == "snyders") {
            sensorid = snyders_weather
        } else {
            sensorid = glasgow_weather
        }
    } else {
        if (location == "snyders") {
            sensorid = snyders_solar
        } else {
            sensorid = glasgow_solar
        }
    }
    return `${api_url}/${type}/measures/${sensorid}?timerange=6h&order=ASC&timezone=America%2FToronto`
}
/**
  * Gets the Timestream Data URL 
  * @param location Location snyders or glasgow
  * @param measure Name of the measure (temperature, etc)
  * @param len Type of measure: last or series
  */
function getUrl(location, measure, len) 
{
    var sensorid = ""
    var type = measures[measure]
    if (type == undefined) {
        type = "weather"
    }
    if (type == "weather") {
        if (location == "snyders") {
            sensorid = snyders_weather;
        } else {
            sensorid = glasgow_weather;
        }
    } else {
        if (location == "snyders") {
            sensorid = snyders_solar;
        } else {
            sensorid = glasgow_solar;
        }
    }
    var url = "";
    if (len == "last") {
        url = `${api_url}/${type}/sensor/${sensorid}/${measure}/last?timezone=America%2FToronto`
    } else {
        url = `${api_url}/${type}/sensor/${sensorid}/${measure}/series?timerange=6h&order=ASC&timezone=America%2FToronto`
    }
    return url
}
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
  * Gets the json Data from a REST call. This generic and works anywhere.
  * This uses the HTTP GET to retrieve data.
  * Example Usage:
  * async function () {
  *     var trailcamdata = await getRESTData(getThingsSpeakURLLastItem("tempdata"));
  * })();
  * @param url Fullly qualified URL to use
  */

async function getRESTData(url) {
    console.log(`getRESTData: Fetching url: ${url}`)
    try {
        return await ( 
            await fetch(url,
                {
                    headers: { 
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer EYgS8oLU0c7ejT0C9Dhlv6KsF7ePpJad8m1WltxO'
                    },
                    method: "GET"
                }
            )
        ).json();
    } catch(e) { console.log(e); }
}
