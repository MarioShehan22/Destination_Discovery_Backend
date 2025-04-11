import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'My API',
        description: 'Description'
    },
    host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = [
    '../route/UserRouter.mjs',
    // './route/userRoute.mjs',
    // './route/ReviewRouter.mjs',
    // './route/BookingRouter.mjs'
];

swaggerAutogen()(outputFile, routes, doc);
