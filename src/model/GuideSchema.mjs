import mongoose from "mongoose";

const GuideSchema = new mongoose.Schema({
    profilePhoto: {
        type: String
    },
    expertise: [
        { type: String }
    ],
    languages: [
        { type: String }
    ],
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
});

const Guide = new mongoose.model('guide',GuideSchema);
export default Guide;
