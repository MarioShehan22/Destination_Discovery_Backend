import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in hours
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    maxParticipants: {
        type: Number,
        required: true
    },
    currentParticipants: {
        type: Number,
        default: 0
    },
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: true
    }
    ,
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'active'
    },
    cancellationPolicy: {
        type: String, required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Tour = mongoose.model('tour',tourSchema);
export default Tour;
