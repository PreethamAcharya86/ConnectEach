import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    teamName : {
        type : String,
        required : true,
    },
    teamPitcure : {
        type: String,
        default: "default_group_img.png"
    },
    createdBy :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    members : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    chat :[
        {
            body : {
                type : String,
            },
            chatBy : {
                type: mongoose.Schema.Types.ObjectId,
                ref : "User"
            },
            createdAt : {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt : {
        type: Date,
        default: Date.now
    },
    updatedAt : {
        type: Date,
        default: Date.now
    },
})
const Team = mongoose.model("Team", teamSchema);
export default Team;