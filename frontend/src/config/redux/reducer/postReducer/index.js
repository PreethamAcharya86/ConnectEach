import { createSlice } from "@reduxjs/toolkit";
import { createPost, deleteComment, deletePost, getAllPosts, getComments } from "../../action/postAction";


const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    message: "",
    comments: [],
    postId: "",
    logedIn: false,
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = ""
        },
        postEmptyMessage : (state) => {
            state.message = ""
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllPosts.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.postFetched= true;
            state.posts = action.payload.posts;
        })
        .addCase(getAllPosts.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.message = action.payload;
        })
        .addCase(getComments.fulfilled, (state,action) => {
            state.postId = action.payload.postId;
            state.comments = action.payload.comments.comments;
        })
        .addCase(createPost.pending, (state) => {
            state.isLoading = true
        })
        .addCase(createPost.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.message = action.payload;
        })
        .addCase(createPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.message = action.payload;
        })
        .addCase(deletePost.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deletePost.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.message = action.payload;
        })
        .addCase(deletePost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.postFetched= true;
            state.message = action.payload;
        })
        .addCase(deleteComment.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deleteComment.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.message = action.payload;
        })
        .addCase(deleteComment.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.message = action.payload;
        })
    }
})
export const { resetPostId, postEmptyMessage } = postSlice.actions;
export default postSlice.reducer