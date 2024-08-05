class CacheService {
  constructor() {
    this.cache = new Map()
    this.maxSize = 100 // Размер кеша по умолчанию
  }

  get(key) {
    return this.cache.get(key)
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // Удалить самый старый элемент при достижении лимита
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
    this.cache.set(key, value)
  }

  clearCache() {
    this.cache.clear()
  }

  setCacheSize(size) {
    this.maxSize = size
    // Обрезать кеш, если необходимо
    while (this.cache.size > this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
  }

  getCacheStatus() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    }
  }
}

module.exports = new CacheService()
