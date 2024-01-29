var key = "c3dc591fe5eb6dff13c9c284f518a60e"
var country = "Telford"
var lat;
var long;
var weatherUrl;
var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+ country + "&appid=" + key


fetch(geoUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        lat = data[0].lat
        long = data[0].lon
        getWeatherData(lat, long)
    })

function getWeatherData(lat, long){
    weatherUrl  = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&appid=" + key
    console.log(weatherUrl)
    fetch(weatherUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        console.log(data)
    })
}