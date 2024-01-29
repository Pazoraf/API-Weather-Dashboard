var key = "c3dc591fe5eb6dff13c9c284f518a60e"
var country = "Telford"
var lat;
var long;
var weatherUrl;
var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+ country + "&appid=" + key
var date = dayjs().format("(DD/M/YYYY)")


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
    fetch(weatherUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        console.log(data)
        var iconCode =data.list[0].weather[0].icon
        var iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`
        var icon = $("<img>").attr("src", iconUrl)
        var cityName = $("<h3>").text(data.city.name + " " +date)
        cityName.append(icon)
        var tempK = data.list[0].main.temp
        var tempC = (tempK-273).toFixed(2)
        var temp = $("<p>").text(`Temp: ${tempC} °C`)
        var humidity = $("<p>").text(`Humidity: ${data.list[0].main.humidity}%`)
        var windSpeed = $("<p>").text(`Wind: ${data.list[0].wind.speed} KPH`)
        var todayContent = $("<div>").addClass("today-content")
        todayContent.append(cityName, temp, humidity, windSpeed)
        $("#today").append(todayContent)
    })
}