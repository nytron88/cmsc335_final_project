const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

async function fetchJson(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}.`);
    }

    return response.json();
  } catch (error) {
    const { stdout } = await execFileAsync("curl", ["-sL", String(url)]);
    return JSON.parse(stdout);
  }
}

async function getWeatherForCity(city) {
  const weatherUrl = new URL(`https://wttr.in/${encodeURIComponent(city)}`);
  weatherUrl.searchParams.set("format", "j1");

  const weatherData = await fetchJson(weatherUrl);

  if (!weatherData.current_condition || !weatherData.current_condition[0]) {
    throw new Error("The weather API did not return current weather data.");
  }

  const current = weatherData.current_condition[0];
  const nearestArea = weatherData.nearest_area && weatherData.nearest_area[0];
  const areaName = nearestArea && nearestArea.areaName && nearestArea.areaName[0];
  const region = nearestArea && nearestArea.region && nearestArea.region[0];
  const country = nearestArea && nearestArea.country && nearestArea.country[0];
  const description = current.weatherDesc && current.weatherDesc[0];

  return {
    city: [
      areaName && areaName.value,
      region && region.value,
      country && country.value
    ].filter(Boolean).join(", ") || city,
    temperature: Number(current.temp_F),
    weatherDescription: (description && description.value.trim()) || "Unknown conditions",
    windSpeed: Number(current.windspeedMiles)
  };
}

module.exports = {
  getWeatherForCity
};
