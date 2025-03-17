const apiKey = "9f923c0271626dfcc6ab26dfe9cf399d"; // Replace with your OpenWeather API key
const apiUrl = "https://api.openweathermap.org/data/2.5/";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.querySelector(".btn-outline-success");
  const locationButton = document.getElementById("current-location-btn"); 
  searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city) {
      fetchWeather(city);
    }
  });

  // Fetch weather data for default location
  fetchWeather("Athens");

  // Fetch weather using geolocation
  document.getElementById("checkbox").addEventListener("change", function () {
    if (this.checked) {
      getLocationWeather();
    }
  });
});

async function fetchWeather(city) {
  try {
    const response = await fetch(`${apiUrl}weather?q=${city}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    if (data.cod !== 200) {
      alert("City not found!");
      return;
    }

    updateWeatherUI(data);
    fetchForecast(data.coord.lat, data.coord.lon);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

async function fetchForecast(lat, lon) {
  try {
    const response = await fetch(`${apiUrl}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const data = await response.json();

    updateForecastUI(data);
  } catch (error) {
    console.error("Error fetching forecast:", error);
  }
}

function updateWeatherUI(data) {
  document.getElementById("city-name").innerText = data.name;
  document.getElementById("temperature").innerHTML = `${Math.round(data.main.temp)}&deg;C`;
  document.getElementById("feels-like").innerText = `Feels like: ${Math.round(data.main.feels_like)}°C`;
  document.getElementById("humidity").innerText = `${data.main.humidity}%`;
  document.getElementById("wind-speed").innerText = `${data.wind.speed} km/h`;
  document.getElementById("pressure").innerText = `${data.main.pressure} hPa`;

  const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
  document.getElementById("sunrise").innerHTML = `<i class="fas fa-arrow-up"></i> Sunrise: ${sunriseTime}`;
  document.getElementById("sunset").innerHTML = `<i class="fas fa-arrow-down"></i> Sunset: ${sunsetTime}`;

  document.getElementById("weather-desc").innerText = data.weather[0].description;
 // document.getElementById("weather-icon").className = getWeatherIcon(data.weather[0].main);
 const iconCode = data.weather[0].icon;  // Get OpenWeather icon code
 const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Construct icon URL
 const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.src = iconUrl;
  weatherIcon.alt = data.weather[0].description;

 
  updateTimeAndDate();
}

function updateTimeAndDate() {
  const now = new Date();
  document.getElementById("current-time").innerText = now.toLocaleTimeString();
  document.getElementById("current-date").innerText = now.toDateString();
}

function updateForecastUI(data) {
  const fiveDayForecast = document.getElementById("five-day-forecast");
  fiveDayForecast.innerHTML = "";

  const forecastMap = {};
  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!forecastMap[date]) {
      forecastMap[date] = item;
    }
  });

  Object.values(forecastMap).slice(0, 5).forEach((forecast) => {
    const temp = Math.round(forecast.main.temp);
   // const weatherIcon = getWeatherEmoji(forecast.weather[0].main);
   const iconCode = forecast.weather[0].icon; 
   const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const dateStr = new Date(forecast.dt_txt).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

    const forecastItem = document.createElement("li");
    forecastItem.className = "forecast-item";
   // forecastItem.innerHTML = `<span class="emoji">${weatherIcon}</span> <span class="temp">${temp}&deg;C</span> <span class="date">${dateStr}</span>`;
   forecastItem.innerHTML = `
  <img src="${iconUrl}" alt="${forecast.weather[0].description}" width="50" height="50">
  <span class="temp">${temp}&deg;C</span>
  <span class="date">${dateStr}</span>
`;

    fiveDayForecast.appendChild(forecastItem);
  });

  updateHourlyForecast(data.list.slice(0, 5));
}

function updateHourlyForecast(hourlyData) {
  const hourlyForecast = document.getElementById("hourly-forecast");
  hourlyForecast.innerHTML = "";

  hourlyData.forEach((hour) => {
    const time = new Date(hour.dt_txt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const temp = Math.round(hour.main.temp);
   // const weatherIcon = getWeatherEmoji(hour.weather[0].main);
   const iconCode = hour.weather[0].icon; 
const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const windSpeed = `${hour.wind.speed} km/h`;

    const hourlyBox = document.createElement("div");
    hourlyBox.className = "hourly-box text-center";
   // hourlyBox.innerHTML = `<p>${time}</p><span class="emoji">${weatherIcon}</span><p>${temp}&deg;C</p><p>${windSpeed}</p>`;
   hourlyBox.innerHTML = `
  <p>${time}</p>
  <img src="${iconUrl}" alt="${hour.weather[0].description}" width="50" height="50">
  <p>${temp}&deg;C</p>
  <img src="Wind.png" alt="Wind Speed" width="20">
  <p>${windSpeed}</p>
`;


    hourlyForecast.appendChild(hourlyBox);
  });
}
/*
function getWeatherEmoji(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌁",
  };
  return icons[condition] || "❓";
}
  
function getWeatherIcon(condition) {
  const icons = {
    Clear: "fas fa-sun fa-5x text-warning",
    Clouds: "fas fa-cloud fa-5x text-white",
    Rain: "fas fa-cloud-showers-heavy fa-5x text-primary",
    Drizzle: "fas fa-cloud-rain fa-5x text-primary",
    Thunderstorm: "fas fa-bolt fa-5x text-danger",
    Snow: "fas fa-snowflake fa-5x text-light",
    Mist: "fas fa-smog fa-5x text-secondary",
    Fog: "fas fa-smog fa-5x text-secondary",
  };
  return icons[condition] || "fas fa-question-circle fa-5x text-muted";
}
  */

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        alert("Unable to retrieve location.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(`${apiUrl}weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    updateWeatherUI(data);
    fetchForecast(lat, lon);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
