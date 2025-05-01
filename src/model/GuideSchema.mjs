import mongoose from "mongoose";

const GuideSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profilePhoto: {
        type: String
    },
    expertise: [
        { type: String }
    ],
    languages: [
        { type: String }
    ],
    bio:{
        type: String,
    },
    education:{
        type: String
    },
    phoneNumber: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
});

const Guide = new mongoose.model('guide',GuideSchema);
export default Guide;