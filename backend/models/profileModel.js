import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    school : {
        type: String,
        default:"",
        required : true
    },
    degree : {
        type: String,
        default:"",
        required : true
    },
    fieldOfStudy : {
        type: String,
        default:"",
        required : true
    }
});

const workSchema = new mongoose.Schema({
    company: {
        type :String,
        default:"",  
        required : true
    },
    position: {
        type: String,
        default:"",
        required : true
    },
    years: {
        type: String,
        default:"",
        required : true
    }
})

const profileSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    bio : {
        type : String,
        default :""
    },
    currentPost : {
        type :String,
        default :""
    },
    skills : {
        type : [String],
        default : []
    },
    education : {
        type: [educationSchema],
        default: []
    },
    pastWork : {
        type :[workSchema],
        default: []
    }
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;