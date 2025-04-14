import mongoose from "mongoose";

const TouristSchema = new mongoose.Schema({
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

const Tourist = new mongoose.model('tourist',TouristSchema);
export default Tourist;
