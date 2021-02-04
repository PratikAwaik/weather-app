const Chart = require("chart.js");

const API_KEY = "6804e4dbbd394e87886608ef7622919c";

const searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", function (e) {
    handleForm(e);
    
    fetchCurrentData()
    .then((data) => {
        removePrevData();
        displayCurrentWeather(data);

        fetchForecastData()
        .then((data) => {
            console.log(data);
            displayChart(data);
        });
    })
    .catch(() => {
        removePrevData();
        const errorMsg = document.getElementById("error-msg");
        errorMsg.style.display = "block";
    });
});

async function fetchCurrentData() {
    const searchInput = document.getElementById("search-input");
    const url = `https://api.weatherbit.io/v2.0/current?city=${searchInput.value}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function fetchForecastData() {
    const searchInput = document.getElementById("search-input");
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchInput.value}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function displayCurrentWeather(data) {
    const currData = data.data[0];
    
    const weatherInfo = document.querySelector("#weather-info");

    // display city name
    const cityName = document.getElementById("city-name");
    cityName.textContent = `${currData.city_name}`;

    // container for displaying the current weather info
    const currWeatherInfo = document.createElement("div");
    currWeatherInfo.setAttribute("class", "curr-weather-info");
    weatherInfo.appendChild(currWeatherInfo);

    // display the current temp
    const tempDiv = document.createElement("div");
    tempDiv.setAttribute("class", "temp-div");
    tempDiv.textContent = `${currData.temp}°C | ${convertCtoF(currData.temp)}°F`;
    currWeatherInfo.appendChild(tempDiv);

    // display humidity
    const humidityDiv = document.createElement("div");
    humidityDiv.setAttribute("class", "humidity-div");

    const humidityImg = document.createElement("img");
    humidityImg.setAttribute("id", "humidity-img");
    humidityImg.setAttribute("src", "images/humidity.svg");
    humidityImg.setAttribute("alt", "Humidity Icon");
    humidityDiv.appendChild(humidityImg);

    const humidityText = document.createElement("div");
    humidityText.setAttribute("id", "humidity-text");
    humidityText.textContent = `Humidity`;
    humidityDiv.appendChild(humidityText);

    const humidityVal = document.createElement("p");
    humidityVal.setAttribute("id", "humidity-val");
    humidityVal.textContent = `${parseInt(currData.rh)}%`;
    humidityText.appendChild(humidityVal);

    currWeatherInfo.appendChild(humidityDiv);

    // display air pressure
    const pressureDiv = document.createElement("div");
    pressureDiv.setAttribute("class", "pressure-div");

    const pressureImg = document.createElement("img");
    pressureImg.setAttribute("id", "pressure-img");
    pressureImg.setAttribute("src", "images/pressure.svg");
    pressureImg.setAttribute("alt", "Air Pressure Icon");
    pressureDiv.appendChild(pressureImg);

    const pressureText = document.createElement("div");
    pressureText.setAttribute("id", "pressure-text");
    pressureText.textContent = `Air Pressure`;
    pressureDiv.appendChild(pressureText);

    const pressureVal = document.createElement("p");
    pressureVal.setAttribute("id", "pressure-val");
    pressureVal.textContent = `${parseInt(currData.pres)} mb`;
    pressureText.appendChild(pressureVal);

    currWeatherInfo.appendChild(pressureDiv);

    // display visibility
    const visibilityDiv = document.createElement("div");
    visibilityDiv.setAttribute("class", "visibility-div");

    const visibilityImg = document.createElement("img");
    visibilityImg.setAttribute("id", "visibility-img");
    visibilityImg.setAttribute("src", "dist/images/visibility.svg");
    visibilityImg.setAttribute("alt", "Eye Icon");
    visibilityDiv.appendChild(visibilityImg);

    const visibilityText = document.createElement("div");
    visibilityText.setAttribute("id", "visibility-text");
    visibilityText.textContent = `Visibility`;
    visibilityDiv.appendChild(visibilityText);

    const visibilityVal = document.createElement("p");
    visibilityVal.setAttribute("id", "visibility-val");
    visibilityVal.textContent = `${parseInt(currData.vis)} km`;
    visibilityText.appendChild(visibilityVal);

    currWeatherInfo.appendChild(visibilityDiv);

    // display wind speed
    const windDiv = document.createElement("div");
    windDiv.setAttribute("class", "wind-div");

    const windImg = document.createElement("img");
    windImg.setAttribute("id", "wind-img");
    windImg.setAttribute("src", "dist/images/wind.svg");
    windImg.setAttribute("alt", "Wind Icon");
    windDiv.appendChild(windImg);

    const windText = document.createElement("div");
    windText.setAttribute("id", "wind-text");
    windText.textContent = `Wind Speed`;
    windDiv.appendChild(windText);

    const windVal = document.createElement("p");
    windVal.setAttribute("id", "wind-val");
    windVal.textContent = `${Number(currData.wind_spd.toFixed(3))} m/s`;
    windText.appendChild(windVal);

    currWeatherInfo.appendChild(windDiv);   
}

function displayChart(data) {
    const weatherInfo = document.querySelector("#weather-info");

    const p = document.createElement("p");
    p.setAttribute("id", "chart-heading")
    p.textContent = "Weather Forecast Chart"
    weatherInfo.appendChild(p);

    // create Chart Container
    const chartContainer = document.createElement("div");
    chartContainer.setAttribute("class", "chart-container");
    weatherInfo.appendChild(chartContainer);

    // canvas for displaying chart
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "chart");
    canvas.style.width = "85%";
    canvas.style.height = "85%";
    chartContainer.appendChild(canvas);

    createChart(data);
}

function createChart(data) {

    const temps = {};
    data.data.forEach((day) => {
        const date = day.datetime.split("-"); 
        temps[`${date[2]}-${date[1]}`] = day.temp; 
    });

    const ctx = document.getElementById("chart").getContext("2d");
    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: Object.keys(temps),
            datasets: [{
                label: "16 Days Forecast Temperature",
                data: Object.values(temps),
                backgroundColor: "rgba(245, 245, 245, 0.2)",
                borderColor: "rgba(240, 240, 240, 1)",
                borderWidth: 2,
                fill: false,
                pointHoverBackgroundColor: "rgba(255, 0, 0, 0.7)",
                pointHoverRadius: 8,
                pointRadius: 6,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true, 
                        labelString: "Temperature (°C)",
                        fontSize: 20,
                        fontColor: "#ffffff",
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return value + "°";
                        },
                        fontSize: 20,
                        fontColor: "#ffffff",
                        padding: 6,
                    },
                }], 
                xAxes: [{
                    scaleLabel: {
                        display: true, 
                        labelString: "Day",
                        fontSize: 20,
                        fontColor: "#ffffff",
                    },
                    ticks: {
                        beginAtZero: true, 
                        fontSize: 20, 
                        fontColor: "#ffffff",
                    },
                }],
            },
            legend: {
                labels: {
                    fontColor: "#ffffff",
                    fontSize: 20,
                },
                boxWidth: 30,
            },
            tooltips: {
                titleFontSize: 20,
                bodyFontSize: 18,
                callbacks: {
                    label: function(tooltipItem, data) {
                        return `Temperature: ${tooltipItem.yLabel}°C`;
                    }
                }
            }
        }
    });
}

function convertCtoF(temp) {
    return (temp * (9 / 5) + 32).toFixed(1);
}

function removePrevData() {
    const errorMsg = document.getElementById("error-msg");
    errorMsg.style.display = "none";

    const cityName = document.getElementById("city-name");
    cityName.textContent = "";

    const weatherInfo = document.getElementById("weather-info");
    while (weatherInfo.hasChildNodes()) {
        weatherInfo.removeChild(weatherInfo.childNodes[0]);
    }
}

// prevent the form from submitting
function handleForm(e) {
    e.preventDefault();
}