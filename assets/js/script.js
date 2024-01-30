var key = "c3dc591fe5eb6dff13c9c284f518a60e"
var city;
var lat;
var long;
var weatherUrl;
var date = dayjs().format("(DD/M/YYYY)")
var searchHistory =[];


$("#search-form").on("submit", function(event){
    event.preventDefault();
    if($("#search-input").val() === ""){
        alert("Please enter a city name")
    }else{
    $("#today").empty()
    $("#forecast").empty()
    city = $("#search-input").val()
    getGeoData(city)
    if(!searchHistory.includes(city) && city !== ""){
    searchHistory.push(city)
    }
    localStorage.setItem("searchInput", JSON.stringify(searchHistory))
    renderSearchHistory();
}
})



$(document).on("click",".history-button", function(event){
    event.preventDefault()
    $("#today").empty()
    $("#forecast").empty()
    city = $(this).text()
    getGeoData(city)
})


function renderSearchHistory(){
    var storedSearch = JSON.parse(localStorage.getItem("searchInput"));
    if (storedSearch !== null){
      searchHistory = storedSearch;
    }
    
    $("#history").empty();
    
    for (var i = 0; i < searchHistory.length; i++) {
      if (i === 10){
        alert("Search history is full! Please clear your history");
        break;
      } else {
        var historyButton = $("<button>").text(searchHistory[i]);
        historyButton.addClass("history-button");
        $("#history").prepend(historyButton);
      }
    }
  }

function getGeoData(city){
    var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+ city + "&appid=" + key
    fetch(geoUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        lat = data[0].lat
        long = data[0].lon
        getTodayWeatherData(lat, long)
        getFiveWeatherData(lat, long)
    })
}

function getTodayWeatherData(lat, long){
    weatherUrl  = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&appid=" + key
    fetch(weatherUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
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

function getFiveWeatherData(lat, long){
    weatherUrl  = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&appid=" + key
    fetch(weatherUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        var fiveDayWeather ={};
        $.each(data.list, function (index, item){
            var date = item.dt_txt.split(" ")[0];
            var time = item.dt_txt.split(" ")[1];
            var currentDate = dayjs().format("YYYY-MM-DD")
            if (date !== currentDate && !fiveDayWeather[date] && time === "12:00:00"){
                fiveDayWeather[date] = item;
            }
        })
        $("#forecast").append($("<h4>").text("5 Day Forecast:"))
        $.each(fiveDayWeather, function (index, item){
            var iconCode =item.weather[0].icon
            var iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`
            var icon = $("<img>").attr("src", iconUrl)
            var tempK = item.main.temp
            var tempC = (tempK-273).toFixed(2)
            var temp = $("<p>").text(`Temp: ${tempC} °C`)
            var humidity = $("<p>").text(`Humidity: ${item.main.humidity}%`)
            var windSpeed = $("<p>").text(`Wind: ${item.wind.speed} KPH`)
            var newCard = $("<div>")
            newCard.attr("class", "card bg-primary text-white m-3 p-3")
            newCard.attr("style", "max-width 200px;")
            var cardDate = dayjs.unix(item.dt).format("DD/M/YYYY")
            newCard.append(cardDate, icon, temp, humidity, windSpeed)
            
            $("#forecast").append(newCard)
        })

    })
}
renderSearchHistory()

$("#clearButton").on("click", function(event){
    event.preventDefault()
    searchHistory = [];
    localStorage.removeItem("searchInput");
    $("#today").empty();
    $("#forecast").empty();
    $(".history-button").remove();
  });