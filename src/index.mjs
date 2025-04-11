import express from 'express';
import mongoose from'mongoose';
import cors from'cors';
import bodyParser from'body-parser';
import 'dotenv/config'; // Correct import for dotenv
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './utils/swagger-output.json' assert { type: 'json' };

import userRoute from './route/UserRouter.mjs';

const port = process.env.SERVER_PORT || 3000;

const app = express();
bodyParser.json();
bodyParser.urlencoded({ extended: false });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// const customerRoute = require('./routes/CustomerRouter');
// const orderRoute = require('./routes/OrderRoute');
// const productRoute = require('./routes/ProductRoute');
// const employeeRoute = require('./routes/EmployeeRouter');

mongoose.connect('mongodb://127.0.0.1:27017/bookingApp')
    .then(() => {
        app.listen(port, () => {
            console.log(`Server started & running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

app.get('/test-api', (req, resp) => {
    return resp.json({ 'message': 'Server started!' });
});

app.use('/api/v1/users', userRoute);
// app.use('/api/v1/orders',orderRoute);
// app.use('/api/v1/products',productRoute);
// app.use('/api/v1/customers',customerRoute);
// app.use('/api/v1/employee',employeeRoute);
