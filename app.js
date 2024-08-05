const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const routes = require('./routes');
const errorHandler = require('./middleware/error');
const app = express();
const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Weather Cache API',
      version: '1.0.0',
      description: 'API для кеширования данных о погоде',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
        description: `Локальный сервер, использующий порт ${PORT}`,
      },
    ],
  },
  apis: ['./controllers/*.js'],
};

const specs = swaggerJsdoc(options);

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
