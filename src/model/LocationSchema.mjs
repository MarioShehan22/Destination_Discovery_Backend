import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    locationName: {
        type: String,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    accessibility_info: {
        type: String,
        required: false
    },
    best_visit_time: {
        type: String,
        required: true
    },
    facilities: {
        type: String,
        required: false
    },
    is_active: {
        type: Boolean,
        required: true
    },
    to:{
        type:String,
        required:true
    }
});

const Location = mongoose.model('location',LocationSchema);
export default Location;

