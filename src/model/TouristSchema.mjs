import mongoose from "mongoose";

const TouristSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    preferences: [
        { type: String }
    ],
    nationality: {
        type: String
    },
    languages: [
        { type: String }
    ],
    specialRequirement: {
        type: String
    },
    whatsapp: {
        type: String
    },
    touristId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
});

const Tourist = new mongoose.model('tourist',TouristSchema);
export default Tourist;
