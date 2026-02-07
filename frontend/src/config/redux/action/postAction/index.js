import clientServer from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
    "post/all-post", 
    async(_, thunkAPI) => {
        try {
            const response = await clientServer.get("/all-post");
            return thunkAPI.fulfillWithValue(response.data)
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const createPost = createAsyncThunk(
    "post/upload-post",
    async(userData, thunkAPI) => {
        const {file,body} = userData;
        try {
            const formData = new FormData();
            formData.append('token', localStorage.getItem("token"));
            formData.append('body', body)
            formData.append('media', file)
            const response = await clientServer.post("/upload-post", formData, {
                headers : {
                    'Content-Type' : 'multipart/form-data'
                }
            })
            if(response.status == 200) {
                thunkAPI.dispatch(getAllPosts());
                return thunkAPI.fulfillWithValue(response.data)
            }
            else {
                return thunkAPI.rejectWithValue(response.data);
            }
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const deletePost = createAsyncThunk(
    "post/delete-post",
    async(postId, thunkAPI) => {
        try {
            const response = await clientServer.delete("/delete-post", {
                data :{
                    token: localStorage.getItem("token"),
                    postId: postId.postId
                }
                
            });
            thunkAPI.dispatch(getAllPosts())
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const likePost = createAsyncThunk(
    "post/like-post",
    async(post, thunkAPI) => {
        try {
            const response = await clientServer.post("/like-post", 
                {
                    token: localStorage.getItem("token"),
                    postId: post.postId
                }
            )
            return thunkAPI.fulfillWithValue(response.data);
        } catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const getComments = createAsyncThunk(
    "post/get-comments",
    async(postData, thunkAPI) => {
        try {
            const response = await clientServer.get("/get-comments", {
                params : { 
                    postId: postData.postId
                }
            })
            return thunkAPI.fulfillWithValue({
                comments: response.data,
                postId: postData.postId
            })
        } catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
        
    }
)

export const postComment = createAsyncThunk(
    "post/comment", 
    async(commentData, thunkAPI) => {
        try {
            const response = await clientServer.post("/comment", {
                token: commentData.token,
                postId: commentData.postId,
                body: commentData.body
            })
            thunkAPI.dispatch(getComments({ postId: commentData.postId }));
            return thunkAPI.fulfillWithValue(response.data)
        }catch(error) {
            thunkAPI.rejectWithValue(error.response.data)
        }
    }
)
export const deleteComment = createAsyncThunk(
    "post/delete-comment",
    async(comment, thunkAPI) => {
        try {
            const response = await clientServer.delete("/delete-comment",{ 
                data : {
                    token : localStorage.getItem("token"),
                    commentId: comment.commentId
                }
            })
            thunkAPI.dispatch(getComments({ postId: comment.postId}));
            return thunkAPI.fulfillWithValue(response.data)

        }catch(error) {
            thunkAPI.rejectWithValue(error.respons.data)
        }
    }
)