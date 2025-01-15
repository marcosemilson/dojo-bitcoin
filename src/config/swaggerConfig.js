const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: '\Bitcoin Explorer API',
            version: '1.0.0',
            description: 'API to interact with Bitcoin Core in Regtest mode',
            contact: {
                name: 'Marcos E N Pereira',
                email: 'marcosenpereira@gmail.com',
            },
            servers: [
                { url: 'http://localhost:5000' }, // API base URL
            ],
        },
    },
    apis: ['src/app.js'], // Path to Swagger annotated route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;