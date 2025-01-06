// Constants and Elements
const apiKey = '65ccbb48ecf5b58c6e44cdbd4d13f93c';
const searchButton = document.getElementById('searchButton');
const locationInput = document.getElementById('locationInput');
const weatherDisplay = document.getElementById('weatherDisplay');

// Function to get weather condition text from OpenWeather code
function getWeatherCondition(code) {
    const conditions = {
        "Clear": "Clear",
        "Clouds": "Cloudy",
        "Rain": "Rain",
        "Drizzle": "Light Rain",
        "Thunderstorm": "Thunderstorm",
        "Snow": "Snow",
        "Mist": "Mist",
        "Fog": "Fog",
    };
    return conditions[code] || "Unknown";
}

// Update the background according to weather condition
function updateBackground(weatherCode) {
    const body = document.querySelector('body');
    body.className = ""; // Reset
    switch (weatherCode) {
        case "Clear":
            body.classList.add("sunny");
            break;
        case "Cloudy":
            body.classList.add("cloudy");
            break;
        case "Rain":
            body.classList.add("rainy");
            break;
        case "Thunderstorm":
            body.classList.add("stormy");
            break;
        default:
            body.classList.add("cloudy");
    }
}

// Fetch weather data and update the UI
function getWeather(location) {
    weatherDisplay.innerHTML = '<p class="loading">Loading weather data...</p>';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response:", data); // Debugging: log API response

            const weatherCode = data.weather[0].main;
            updateBackground(weatherCode);

            const currentTime = new Date().toLocaleTimeString();

            // Handle undefined fields
            const pressure = data.main.pressure ? `${data.main.pressure} hPa` : 'Not available';
            const sunriseTime = data.sys.sunrise ? new Date(data.sys.sunrise * 1000).toLocaleTimeString() : 'Not available';
            const sunsetTime = data.sys.sunset ? new Date(data.sys.sunset * 1000).toLocaleTimeString() : 'Not available';

            // Create detailed weather display
            weatherDisplay.innerHTML = `
                <div class="card">
                    <i class="fas fa-cloud card-icon"></i>
                    <h2>${location}</h2>
                    <p><strong>Current Time:</strong> ${currentTime}</p>
                    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                    <p><strong>Feels Like:</strong> ${data.main.feels_like}°C</p>
                    <p><strong>Condition:</strong> ${getWeatherCondition(weatherCode)}</p>
                    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
                    <p><strong>Visibility:</strong> ${data.visibility / 1000} km</p>
                    <p><strong>Pressure:</strong> ${pressure}</p>
                    
                    <p><strong>Sunrise:</strong> ${sunriseTime}</p>
                    <p><strong>Sunset:</strong> ${sunsetTime}</p>
                </div>`;
        })
        .catch(err => {
            console.error("Error fetching weather data:", err);
            weatherDisplay.innerHTML = `<p>Error: ${err.message}</p>`;
        });
}

// Add event listeners
locationInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') getWeather(locationInput.value.trim());
});

searchButton.addEventListener('click', () => {
    getWeather(locationInput.value.trim());
});
