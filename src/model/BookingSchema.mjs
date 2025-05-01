import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
    tourId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: true
    },
    touristId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participantCount: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING","REJECTED","COMPLETED","CANCELLED"],
        default: 'PENDING'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'REFUNDED'],
        default: 'PENDING'
    },
    specialRequests: {
        type: String
    }
});

const Booking = mongoose.model('booking', bookingSchema);
export default Booking;
