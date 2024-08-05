const axios = require('axios');
const settings = require('../config/settings');

class WeatherRepository {
  async fetchWeather(latitude, longitude) {
    const response = await axios.get(settings.weatherApiUrl, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,wind_speed_10m',
        hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
      },
    });
    return response.data;
  }
}

module.exports = new WeatherRepository();
