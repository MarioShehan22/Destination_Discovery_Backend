import mongoose from "mongoose"

const RoleSchema = new mongoose.Schema({
    discription:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        unique: true,
    }
});

const Role = mongoose.model("role", RoleSchema);
module.exports = Role;
