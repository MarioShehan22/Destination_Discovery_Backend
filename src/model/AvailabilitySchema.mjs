import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema({
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guide',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlots: [{
        startTime: {
            type: String, // Format: "HH:MM" in 24-hour format
            required: true
        },
        endTime: {
            type: String, // Format: "HH:MM" in 24-hour format
            required: true
        },
        isBooked: {
            type: Boolean,
            default: false
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            default: null
        }
    }],
    recurrence: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'biweekly', 'monthly'],
        default: 'none'
    },
    recurrenceEndDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Compound index for efficiently querying guide availability by date
AvailabilitySchema.index({ guideId: 1, date: 1 });

const Availability = mongoose.model('Availability', AvailabilitySchema);
export default Availability;