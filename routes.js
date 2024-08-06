import express from 'express'
import weatherController from './controllers/weather-controller.js'

const router = express.Router()

router.use('/weather', weatherController)

export default router
