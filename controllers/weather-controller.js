const express = require('express')
const router = express.Router()
const weatherService = require('../services/weather-service')
const cacheService = require('../services/cache-service')

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Получить данные о погоде
 *     description: Метод проверяет, есть ли данные с заданными параметрами широты, долготы местоположения, а также временной метки в кеше. Если данных в кеше нет, запрашивает данные из внешнего API, сохраняет в кеш и возвращает их. Если данные в кеше найдены, возвращает данные непосредственно из кеша. Если размер кеша превышен, удаляется самый первый добавленный элемент.
 *     parameters:
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Широта местоположения
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         required: true
 *         description: Долгота местоположения
 *     responses:
 *       200:
 *         description: Данные о погоде
 *       400:
 *         description: Неправильный запрос
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/', async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query
    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: 'Широта и долгота обязательны' })
    }
    const data = await weatherService.getWeather(
      latitude,
      longitude,
    )
    res.json(data)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /weather/cache:
 *   delete:
 *     summary: Очистить кеш
 *     description: Метод очищает все данные, которые были сохранены в кеш.
 *     responses:
 *       200:
 *         description: Кеш очищен
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/cache', (req, res, next) => {
  try {
    cacheService.clearCache()
    res.status(200).json({ message: 'Кеш очищен' })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /weather/cache/size:
 *   post:
 *     summary: Установить размер кеша
 *     description: Метод устанавливает максимальное количество элементов, которые могут храниться в кеше.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               size:
 *                 type: number
 *     responses:
 *       200:
 *         description: Размер кеша обновлен
 *       400:
 *         description: Неправильный запрос
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/cache/size', (req, res, next) => {
  try {
    const { size } = req.body
    if (!size || typeof size !== 'number') {
      return res
        .status(400)
        .json({ error: 'Размер должен быть числом' })
    }
    cacheService.setCacheSize(size)
    res
      .status(200)
      .json({ message: 'Размер кеша обновлен' })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /weather/cache/status:
 *   get:
 *     summary: Получить статус кеша
 *     description: Возвращает информацию о текущем состоянии кеша — текущий и максимальный размеры кеша.
 *     responses:
 *       200:
 *         description: Статус кеша
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 size:
 *                   type: number
 *                   example: 0
 *                   description: Текущий размер кеша
 *                 maxSize:
 *                   type: number
 *                   example: 100
 *                   description: Максимальный размер кеша
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/cache/status', (req, res, next) => {
  try {
    const status = cacheService.getCacheStatus()
    res.json(status)
  } catch (error) {
    next(error)
  }
})

module.exports = router
