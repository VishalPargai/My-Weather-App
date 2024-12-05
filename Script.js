const apikey = "c769c03850c734a6597844608b1208b3";
const geoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";

const searchbox = document.querySelector(".search input");
const searchbtn = document.querySelector(".search button");
const suggestionsBox = document.getElementById("suggestions");
const weathericon = document.querySelector(".weather-icon");

async function checkweather(city) {
    const apiurl = `https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city}&appid=${apikey}`;
    const response = await fetch(apiurl);

    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        if (data.weather[0].main === "Clouds") {
            weathericon.src = "images/clouds.png";
        } else if (data.weather[0].main === "Clear") {
            weathericon.src = "images/clear.png";
        } else if (data.weather[0].main === "Rain") {
            weathericon.src = "images/rain.png";
        } else if (data.weather[0].main === "Drizzle") {
            weathericon.src = "images/drizzle.png";
        } else if (data.weather[0].main === "Mist") {
            weathericon.src = "images/mist.png";
        }
        
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";

        console.log(data);
    }

    

}

// Fetch city names for autocomplete
async function fetchCityNames(query) {
    const response = await fetch(`${geoApiUrl}${query}&limit=5&appid=${apikey}`);
    const data = await response.json();

    suggestionsBox.innerHTML = ""; // Clear previous suggestions

    if (data.length > 0) {
        data.forEach((city) => {
            const suggestionDiv = document.createElement("div");
            suggestionDiv.textContent = `${city.name}, ${city.country}`;

            // Handle suggestion click
            suggestionDiv.addEventListener("click", () => {
                searchbox.value = city.name;
                suggestionsBox.style.display = "none";
            });

            suggestionsBox.appendChild(suggestionDiv);
        });

        suggestionsBox.style.display = "block";
    } else {
        suggestionsBox.style.display = "none";
    }

    // console.log(response);

}

// Event listeners
searchbtn.addEventListener("click", () => {
    checkweather(searchbox.value);
});

searchbox.addEventListener("input", () => {
    const query = searchbox.value.trim();
    if (query.length > 2) fetchCityNames(query); // Fetch suggestions for meaningful input
});

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
    if (!document.querySelector(".search").contains(e.target)) {
        suggestionsBox.style.display = "none";
    }
});
