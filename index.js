
const weatherApi = "https://api.weather.gov/alerts/active?area=";


const input = document.getElementById("state-input");
const button = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

// FETCH DATA
function fetchWeatherData(state) {
  if (!state) {
    displayError("Please enter a state abbreviation.");
    return;
  }

  fetch(weatherApi + state)
    //check if response is ok, if not throw error, otherwise parse json
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch weather data.");
      }
      return response.json();
    })
    //check if data has features array, if not throw error, otherwise display weather
    .then((data) => {
      const alerts = data.features;

      if (!alerts || alerts.length === 0) {
        displayError("No weather alerts found for this state.");
        return;
      }

      displayWeather(alerts);
    })
    .catch((error) => {
      displayError(error.message || "Network error occurred.");
    });
}

// DISPLAY WEATHER
function displayWeather(alerts) {
  alertsDisplay.innerHTML = "";
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");

  const header = document.createElement("h2");
  header.textContent = `Weather Alerts: ${alerts.length}`;
  //display header with number of alerts
  alertsDisplay.appendChild(header);

  alerts.forEach((alert) => {
    const card = document.createElement("div");
    card.classList.add("alert-card");
    //Display title and description, with fallback if not available
    const title = alert.properties.headline || "No title available";
    const description =
      alert.properties.description || "No description available";

    card.textContent = `${title}: ${description}`;

    alertsDisplay.appendChild(card);
  });
}

// DISPLAY ERROR
function displayError(message) {
  alertsDisplay.innerHTML = "";
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

// CLICK EVENT
button.addEventListener("click", () => {
  const state = input.value.trim().toUpperCase();

  fetchWeatherData(state);
  //reset input field
  input.value = "";
});
