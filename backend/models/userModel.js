import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    username : {
        type :String,
        required : true,
        unique : true
    },
    active : {
        type : Boolean,
        default: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "default_profile.jpg",
    },
    backgroundImage : {
        type : String,
        default : "default_background.jpg"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    token : {
        type : String,
        default : ""
    }
});

const User = mongoose.model("User", UserSchema);
export default User;