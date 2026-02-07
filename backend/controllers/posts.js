import Posts from "../models/postsModel.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";


export const createPost = async(req,res) => {
    const { token } = req.body;
    try {
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ ErrMsg: "User not found!"});
        }

        const newPost = new Posts({
            userId: user._id,
            body: req.body.body,
            media: req.file ? req.file.filename : "",
            fileType: req.file ? req.file.mimetype.split("/")[1] : ""
        });
        await newPost.save();
        res.status(200).json({ message: "Post Created Successfully"})
    }catch(error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getAllPost = async(req, res) => {
    try {
        const posts = await Posts.find().populate('userId', 'name username email profilePicture').sort({ createdAt: -1 });
        res.status(200).json({ posts });
    }catch(error) {
        res.status(500).json({msg: error.message});
    }
}

export const deletePost = async(req, res) => {
    const { token, postId } = req.body;
    try {
        const user = await User.findOne({ token }).select("_id");
        if(!user) {
            return res.status(404).json({ ErrMsg: "User not found!" });
        }
        const post = await Posts.findOne({ _id: postId });

        if(!post) {
            return res.status(404).json({ ErrMsg: "Post not found!" });
        }

        if(post.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ ErrMsg: "You are not authorized to delete this post!" });
        }

        await Posts.deleteOne({ _id: postId });
        res.status(200).json({ message: "Post deleted successfully!" });
    }catch(error) {
        res.status(500).json({ msg: error.message });
    }
    
}

export const commentPost = async(req,res) => {
    const { token, postId, body } = req.body;
    try {
        const user = await User.findOne({ token }).select("_id");
        if(!user) {
            return res.status(404).json({ ErrMsg: "User not found!" });
        }
        const post = await Posts.findOne({ _id: postId });
        if(!post) {
            return res.status(404).json({ ErrMsg: "Post not found!" });
        }

        const newComment = new Comment({
            postId: post._id,
            userId: user._id,
            body,
        });
        await newComment.save();
        res.status(200).json({ message: "Comment added successfully!" });
    }catch(error) {
        res.status(500).json({ ErrMsg: error.message });  
    }
}

export const get_comments_by_post = async(req,res) => {
    const  { postId }  = req.query;
    try {
        const post = await Posts.findOne({ _id: postId });
        if(!post) {
            return res.status(404).json({ ErrMsg: "Post not found!" });
        }
        const comments = await Comment.find({ postId: post._id }).populate('userId', 'name username email profilePicture');
        res.status(200).json({ comments });
    }catch(error) {
        res.status(500).json({ msg: error.msg });  
    }
}

export const delete_comment = async(req,res) => {
    const { token, commentId } = req.body;
    try {
        const user = await User.findOne({ token }).select("_id");
        if(!user) {
            return res.status(404).json({ ErrMsg: "User not found!" });
        }
        const comment = await Comment.findOne({ _id: commentId });
        if(!comment) {
            return res.status(404).json({ ErrMsg: "Comment not found!" });
        }
        if(comment.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ ErrMsg: "You are not authorized to delete this comment!" });
        }
        await Comment.deleteOne({ _id: commentId });
        res.status(200).json({ message: "Comment deleted!" });
    }catch(error) {
        res.status(500).json({ msg: error.msg });
    }
}

export const likePost = async(req,res) => {
    const { token, postId } = req.body;
    try {
        const user = await User.findOne({ token }).select("_id");
        if(!user) {
            return res.status(404).json({ ErrMsg: "User not found!" });
        }
        const post = await Posts.findOne({ _id: postId });
        if(!post) {
            return res.status(404).json({ ErrMsg: "Post not found!" });
        }
        const isLiked = post.likes.includes(user._id);
        if(isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== user._id.toString());
        } else {
            post.likes.push(user._id);
        }
        await post.save();
        res.status(200).json({ msg: "Post liked/unliked successfully!" });
    }catch(error) {
        res.status(500).json({ msg: error.message });
    }
}