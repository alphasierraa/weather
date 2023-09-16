function getWeather() {
    const apiKey = '45455900690ea4c9977b3c1ab6588c85'; // Get your OpenWeatherMap API key
    const city = document.getElementById('city').value;

    // Function to format date as "Day, dd/mm/yyyy"
    function formatDateWithDay(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Fetch current weather data
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const weatherInfo = document.getElementById('weather-info');
            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

            const date = new Date(data.dt * 1000);
            const formattedDate = formatDateWithDay(date);

            weatherInfo.innerHTML = `
                <h2>Current Weather in ${data.name}, ${data.sys.country}</h2>
                <p>Date: ${formattedDate}</p>
                <p>Temperature: ${Math.round(data.main.temp - 273.15)}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <img src="${iconUrl}" alt="Weather Icon">
            `;

            // Add source link
            const sourceLink = document.getElementById('source-link');
            sourceLink.href = `https://openweathermap.org/find?q=${city}`;
            sourceLink.textContent = `Source: OpenWeatherMap | ${data.name}`;

            // Fetch 5-day forecast data
            fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
                .then(response => response.json())
                .then(forecastData => {
                    const forecastInfo = document.getElementById('forecast-info');
                    forecastInfo.innerHTML = '<h2>5-Day Forecast</h2>';

                    // Process forecast data, start loop from index 1 to exclude today
                    for (let i = 1; i < forecastData.list.length; i += 8) {
                        const forecast = forecastData.list[i];
                        const date = new Date(forecast.dt * 1000);
                        const formattedDate = formatDateWithDay(date);
                        const iconCode = forecast.weather[0].icon;
                        const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

                        forecastInfo.innerHTML += `
                            <div class="forecast-day">
                                <p>Date: ${formattedDate}</p>
                                <p>Temperature: ${Math.round(forecast.main.temp - 273.15)}°C</p>
                                <p>Weather: ${forecast.weather[0].description}</p>
                                <img src="${iconUrl}" alt="Weather Icon">
                            </div>
                        `;
                    }
                })
                .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
}
