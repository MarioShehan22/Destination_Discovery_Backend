import express from 'express';
import mongoose from'mongoose';
import cors from'cors';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './utils/swagger-output.json' assert { type: 'json' };

import userRoute from './route/UserRouter.mjs';
import TourRouter from "./route/TourRouter.mjs";
import BookingRouter from "./route/BookingRouter.mjs";
import AdminRouter from "./route/AdminRouter.mjs";
import TouristRouter from "./route/TouristRouter.mjs";
import LocationRouter from "./route/LocationRouter.mjs";
import ReviewRouter from "./route/ReviewRouter.mjs";
import GuideRouter from "./route/GuideRouter.mjs";
import GuideAvailabilityRouter from "./route/GuideAvailabilityRouter.mjs";

const port = process.env.SERVER_PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

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
app.use('/api/v1/tours',TourRouter);
app.use('/api/v1/booking',BookingRouter);
app.use('/api/v1/admin',AdminRouter);
app.use('/api/v1/tourist',TouristRouter);
app.use('/api/v1/location',LocationRouter);
app.use('/api/v1/reviews',ReviewRouter);
app.use('/api/v1/guides',GuideRouter);
app.use('/api/v1/availability',GuideAvailabilityRouter);
//password": "!1234567cls