// ========================================
// WEATHER DASHBOARD
// ========================================

// Get HTML elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");

const weatherDescription = document.getElementById("weather-description");
const weatherIcon = document.getElementById("weather-icon");
const errorMessage = document.getElementById("error-message");


// ========================================
// WEATHER CONDITION CODES
// ========================================

function getWeatherDetails(code) {

    const weatherConditions = {
        0: { description: "Clear sky", icon: "☀️" },
        1: { description: "Mainly clear", icon: "🌤️" },
        2: { description: "Partly cloudy", icon: "⛅" },
        3: { description: "Overcast", icon: "☁️" },
        45: { description: "Foggy", icon: "🌫️" },
        48: { description: "Rime fog", icon: "🌫️" },
        51: { description: "Light drizzle", icon: "🌦️" },
        53: { description: "Moderate drizzle", icon: "🌦️" },
        55: { description: "Heavy drizzle", icon: "🌧️" },
        61: { description: "Slight rain", icon: "🌧️" },
        63: { description: "Moderate rain", icon: "🌧️" },
        65: { description: "Heavy rain", icon: "🌧️" },
        71: { description: "Slight snowfall", icon: "🌨️" },
        73: { description: "Moderate snowfall", icon: "❄️" },
        75: { description: "Heavy snowfall", icon: "❄️" },
        80: { description: "Rain showers", icon: "🌦️" },
        81: { description: "Moderate rain showers", icon: "🌧️" },
        82: { description: "Heavy rain showers", icon: "⛈️" },
        95: { description: "Thunderstorm", icon: "⛈️" },
        96: { description: "Thunderstorm with hail", icon: "⛈️" },
        99: { description: "Heavy thunderstorm with hail", icon: "⛈️" }
    };

    return weatherConditions[code] || {
        description: "Unknown weather",
        icon: "🌡️"
    };
}


// ========================================
// FETCH WEATHER DATA
// ========================================

async function getWeather(city) {

    try {

        // Clear previous error
        errorMessage.textContent = "";

        // Validate city input
        if (!city.trim()) {
            throw new Error("Please enter a city name!");
        }

        // Show loading message
        searchBtn.disabled = true;
        searchBtn.textContent = "Loading...";

        // STEP 1: Get city coordinates

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to the location service.");
        }

        const geoData = await geoResponse.json();

        // Check whether city exists
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found! Please enter a valid city name.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // STEP 2: Fetch current weather

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        // STEP 3: Extract current weather information

        const current = weatherData.current;

        if (!current) {
            throw new Error("Weather information is unavailable.");
        }

        // Get weather description and icon
        const details = getWeatherDetails(current.weather_code);

        // STEP 4: Display weather information

        cityName.textContent =
            `${location.name}, ${location.country}`;

        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;

        weatherDescription.textContent =
            details.description;

        weatherIcon.textContent =
            details.icon;

        // Show successful result
        console.log("Weather data:", weatherData);

    } catch (error) {

        // Handle errors
        errorMessage.textContent = error.message;

        console.error("Weather error:", error);

    } finally {

        // Restore search button
        searchBtn.disabled = false;
        searchBtn.textContent = "Search 🔍";

    }
}


// ========================================
// SEARCH BUTTON EVENT
// ========================================

searchBtn.addEventListener("click", function () {

    getWeather(cityInput.value);

});


// ========================================
// PRESS ENTER TO SEARCH
// ========================================

cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        getWeather(cityInput.value);
    }

});


// ========================================
// LOAD DEFAULT CITY
// ========================================

getWeather("Chennai");