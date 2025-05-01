import swaggerAutogen from 'swagger-autogen';
import { fileURLToPath } from 'url';
import {basename, dirname, resolve} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const doc = {
    info: {
        title: 'My API',
        description: 'Description'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    basePath: '/api/v1',
    consumes: ['application/json'],
    produces: ['application/json']
};

const outputFile = './swagger-output.json';

const routes = [
    '../route/UserRouter.mjs',
    '../route/TourRouter.mjs',

    { path: resolve(__dirname, '../route/UserRouter.mjs'), baseRoute: '/users' },
    { path: resolve(__dirname, '../route/TourRouter.mjs'), baseRoute: '/tours' },
    { path: resolve(__dirname, '../route/LocationRouter.mjs'), baseRoute: '/location' },
    { path: resolve(__dirname, '../route/BookingRouter.mjs'), baseRoute: '/booking' },
    { path: resolve(__dirname, '../route/TouristRouter.mjs'), baseRoute: '/tourist' },
    { path: resolve(__dirname, '../route/AdminRouter.mjs'), baseRoute: '/admin' },
    { path: resolve(__dirname, '../route/ReviewRouter.mjs'), baseRoute: '/reviews' },
];

swaggerAutogen(outputFile, routes, doc).then(() => {
    console.log('Resolved route paths:', routes.map(r => r.path));

    console.log('Swagger docs generated successfully!');
}).catch(error => {
    console.error('Error generating swagger docs:', error);
});