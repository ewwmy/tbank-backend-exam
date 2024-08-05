const express = require('express');
const router = express.Router();
const weatherService = require('../services/weather-service');
const cacheService = require('../services/cache-service');

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Получить данные о погоде
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
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Широта и долгота обязательны' });
    }
    const data = await weatherService.getWeather(latitude, longitude);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /weather/cache:
 *   delete:
 *     summary: Очистить кеш
 *     responses:
 *       200:
 *         description: Кеш очищен
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/cache', (req, res, next) => {
  try {
    cacheService.clearCache();
    res.status(200).json({ message: 'Кеш очищен' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /weather/cache/size:
 *   post:
 *     summary: Установить размер кеша
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
    const { size } = req.body;
    if (!size || typeof size !== 'number') {
      return res.status(400).json({ error: 'Размер должен быть числом' });
    }
    cacheService.setCacheSize(size);
    res.status(200).json({ message: 'Размер кеша обновлен' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /weather/cache/status:
 *   get:
 *     summary: Получить статус кеша
 *     responses:
 *       200:
 *         description: Статус кеша
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/cache/status', (req, res, next) => {
  try {
    const status = cacheService.getCacheStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
