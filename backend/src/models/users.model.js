// const mongoose = require('mongoose');
import mongoose from "mongoose";
// user schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    },
})
const User = mongoose.model('User', userSchema)
// module.exports = User;
export default User;
