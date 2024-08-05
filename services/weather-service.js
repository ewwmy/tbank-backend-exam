const weatherRepository = require('../repositories/weather-repository');
const cacheService = require('./cache-service');

class WeatherService {
  async getWeather(latitude, longitude) {
    const cacheKey = `${latitude},${longitude}`;
    let cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const weatherData = await weatherRepository.fetchWeather(latitude, longitude);
    cacheService.set(cacheKey, weatherData);
    return weatherData;
  }
}

module.exports = new WeatherService();
