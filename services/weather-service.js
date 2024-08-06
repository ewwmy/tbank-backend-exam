import weatherRepository from '../repositories/weather-repository.js'
import cacheService from './cache-service.js'

class WeatherService {
  async getWeather(latitude, longitude) {
    const d = new Date()
    // Временная метка с "округлением" до часа
    const timestamp = `${d.getFullYear()}${d.getMonth()}${d.getDate()}${d.getHours()}`
    const cacheKey = `${latitude},${longitude},${timestamp}`
    let cachedData = cacheService.get(cacheKey)
    if (cachedData) {
      return cachedData
    }
    const weatherData =
      await weatherRepository.fetchWeather(
        latitude,
        longitude,
      )
    cacheService.set(cacheKey, weatherData)
    return weatherData
  }
}

export default new WeatherService()
