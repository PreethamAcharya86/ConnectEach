import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    body : {
        type: String,
        required: true,
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
            default : 0
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
    media: {
        type: String,
        default: ""
    },
    active : {
        type: Boolean,
        default: true
    },
    fileType : {
        type: String,
        default: ""
    }
})

const Posts = mongoose.model("Posts", PostSchema);
export default Posts;