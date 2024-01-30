var key = "c3dc591fe5eb6dff13c9c284f518a60e";
var city;
var lat;
var long;
var weatherUrl;
var date = dayjs().format("(DD/M/YYYY)");
var searchHistory =[];

/*On submit for search form, empty the today and forecast displays, assign the city variable to what was entered into the search input, and pass the city name into the getGeoData function. 
The city is then pushed into the searchHistory array if it is not already present, then the array is saved to localStorage and renderSearchHistory function is called. Empty values in the search input are ignored*/
$("#search-form").on("submit", function(event){
    event.preventDefault();
    if($("#search-input").val() === ""){
        alert("Please enter a city name");
    }else{
    $("#today").empty();
    $("#forecast").empty();
    city = $("#search-input").val();
    getGeoData(city);
    if(!searchHistory.includes(city) && city !== ""){
    searchHistory.push(city);
    }
    localStorage.setItem("searchInput", JSON.stringify(searchHistory));
    renderSearchHistory();
}
})

//Render buttons with city names that have been saved to localStorage. searchHistory array is populated with city names that have been saved to localStorage. Maximum of 10 cities will be displayed.
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
            historyButton.addClass("history-button btn btn-secondary m-1");
            $("#history").prepend(historyButton);
        }
    }
}

//When history-button is clicked, display is emptied and the city name is passed to the getGeoData function.
$(document).on("click",".history-button", function(event){
    event.preventDefault();
    $("#today").empty();
    $("#forecast").empty();
    city = $(this).text();
    getGeoData(city);
})

//Url is constructed with city name as a parameter. Gets city longitude and latitude information from openweathermap and passes it through getTodayWeatherData and getFiveWeatherData functions.
function getGeoData(city){
    var geoUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+ city + "&appid=" + key;
    fetch(geoUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        lat = data[0].lat;
        long = data[0].lon;
        getTodayWeatherData(lat, long);
        getFiveWeatherData(lat, long);
    })
}

//Url is constructed with latitude and longitute as parameters. Gets weather data from openweathermap and constructs website visuals using the returned object.
function getTodayWeatherData(lat, long){
    weatherUrl  = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&appid=" + key;
    fetch(weatherUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        var iconCode =data.list[0].weather[0].icon;
        var iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
        var icon = $("<img>").attr("src", iconUrl);
        var cityName = $("<h3>").text(data.city.name + " " +date);
        cityName.append(icon);
        var tempK = data.list[0].main.temp;
        var tempC = (tempK-273).toFixed(2);
        var temp = $("<p>").text(`Temp: ${tempC} °C`);
        var humidity = $("<p>").text(`Humidity: ${data.list[0].main.humidity}%`);
        var windSpeed = $("<p>").text(`Wind: ${data.list[0].wind.speed} KPH`);
        var todayContent = $("<div>").addClass("today-content");
        todayContent.append(cityName, temp, humidity, windSpeed);
        $("#today").append(todayContent);
    })
}

//Url is constructed with latitude and longitude as parameters. Gets weather data from openweathermap and constructs 5 cards to display weather info over the next 5 days. Ignores current date, and takes weather with the timestap of 12:00:00 for each day.
function getFiveWeatherData(lat, long){
    weatherUrl  = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&appid=" + key
    fetch(weatherUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        var fiveDayWeather ={};
        $.each(data.list, function (index, item){
            var date = item.dt_txt.split(" ")[0];
            var time = item.dt_txt.split(" ")[1];
            var currentDate = dayjs().format("YYYY-MM-DD");
            if (date !== currentDate && !fiveDayWeather[date] && time === "12:00:00"){
                fiveDayWeather[date] = item;
            }
        })
        $("#forecast").append($("<h4>").text("5 Day Forecast:"))
        $.each(fiveDayWeather, function (index, item){
            var iconCode =item.weather[0].icon;
            var iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
            var icon = $("<img>").attr("src", iconUrl);
            var tempK = item.main.temp;
            var tempC = (tempK-273).toFixed(2);
            var temp = $("<p>").text(`Temp: ${tempC} °C`);
            var humidity = $("<p>").text(`Humidity: ${item.main.humidity}%`);
            var windSpeed = $("<p>").text(`Wind: ${item.wind.speed} KPH`);
            var newCard = $("<div>");
            newCard.attr("class", "card bg-primary text-white m-3 p-3");
            newCard.attr("style", "max-width 200px;");
            var cardDate = dayjs.unix(item.dt).format("DD/M/YYYY");
            newCard.append(cardDate, icon, temp, humidity, windSpeed);
            
            $("#forecast").append(newCard);
        })

    })
}
//renderSearchHistory called to construct buttons from any previous searched upon page load
renderSearchHistory()

//Clear button to clear all visuals, empty search history, remove all generated buttons and empty search input.
$("#clearButton").on("click", function(event){
    event.preventDefault()
    searchHistory = [];
    localStorage.removeItem("searchInput");
    $("#today").empty();
    $("#forecast").empty();
    $(".history-button").remove();
    $("#search-input").val("");
  });