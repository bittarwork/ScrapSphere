const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// إعدادات Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation for the API',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./routes/*.js'], // المسار إلى ملفات التوجيه الخاصة بك
};

const specs = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerUi, specs };
