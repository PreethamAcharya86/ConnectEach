import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "@/config";
import { getMyTeam } from "../teamAction";
import { setTokenIsNotThere } from "../../reducer/authReducer";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/login", {
                email : user.email,
                password: user.password
            });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            } else {
                return thunkAPI.rejectWithValue({
                    message: "Login failed"
                });
            }
            console.log("Successfull");
            return thunkAPI.fulfillWithValue(response.data.token);
            
        }catch(error) {
            console.log(error.message)
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/register", {
                username: user.username,
                name: user.name,
                email : user.email,
                password: user.password
            })
            thunkAPI.dispatch(loginUser({
                email : user.email,
                password: user.password
            }))
            return thunkAPI.fulfillWithValue(response.data);
            
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(user, thunkAPI) => {
        try {
            const response = await clientServer.get("/get-user-and-profile", {
                params: {
                    token: user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error) {
            thunkAPI.dispatch(setTokenIsNotThere())
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "user/getAllUser",
    async(_, thunkAPI) => {
        try {
            const response = await clientServer.get("/get-all-profiles")
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async(user, thunkAPI) => {
        console.log(user.token, user.connectionId)
        try {
            const response = await clientServer.post("/send-connection-request", {
                token: user.token,
                connectionId: user.connectionId,
            })
            thunkAPI.dispatch(getConnectionRequest({ token: user.token }))
            return thunkAPI.fulfillWithValue(response.data)
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const getConnectionRequest = createAsyncThunk(
    "user/getConnectionRequest",
    async(user, thunkAPI) => {
        try {
            const response = await clientServer.get("/get-connection-requests", {
                params: {
                    token: user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data)
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const getMyConnections = createAsyncThunk(
    "user/myConnections",
    async(user, thunkAPI) => {
        try {
            const response = await clientServer.get("/my-connections", {
                params: {
                    token: user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data)
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const acceptConnection = createAsyncThunk(
    "user/acceptConnection",
    async(user, thunkAPI) => {
        try {
            const response = await clientServer.post("/accept-connection-request", {
                token: user.token,
                requestId :user.requestId,
                action_type: user.action
              
            })
            thunkAPI.dispatch(getConnectionRequest({ token: user.token }));
            thunkAPI.dispatch(getMyConnections({ token: user.token }));
            return thunkAPI.fulfillWithValue(response.data);
            
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const updateProfilePicture = createAsyncThunk(
    "user/upload-profile-picture",
    async(formData, thunkAPI) => {
        try {
            const response = await clientServer.post("upload-profile-picture", formData, {
                headers : {
                    'Content-Type' : 'multipart/form-data'
                }
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const updateBackgroundImage = createAsyncThunk(
    "user/upload-background-image",
    async(formData, thunkAPI) => {
        try {
            const response = await clientServer.post("upload-background-image", formData, {
                headers : {
                    'Content-Type' : 'multipart/form-data'
                }
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const updateUser = createAsyncThunk(
    "user/update-profile",
    async(data, thunkAPI) => {
        try {
            const response = await clientServer.post("update-profile", data);
            thunkAPI.dispatch(updateProfile({
                        token : data.token,
                        bio : data.bio,
                        currentPost: data.currentPost
            }))
            data.router.push("/profile");
            thunkAPI.dispatch(getAboutUser({ token: data.token}))
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const updateProfile = createAsyncThunk(
    "user/profile-update",
    async(data, thunkAPI) => {
        try {
            const response = await clientServer.post("profile-update", data);
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const deleteEducation = createAsyncThunk(
    "user/delete-Education",
    async(data, thunkAPI) => {
        try {
            const response = await clientServer.post("delete-Education", data);
            thunkAPI.dispatch(getAboutUser({ token: data.token }))
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const deleteWorkHistory = createAsyncThunk(
    "user/delete-work-history",
    async(data, thunkAPI) => {
        try {
            const response = await clientServer.post("delete-work-history", data);
            thunkAPI.dispatch(getAboutUser({ token: data.token }))
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const searchUsers = createAsyncThunk(
    "user/search-users",
    async(data, thunkAPI) => {
        try {
            const response = await clientServer.get("search-users", {
                params :{
                    userData : data.userData
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const addSkill = createAsyncThunk(
    "user/add-skill",
    async(data, thunkAPI) => {
        try {
            const response = await clientServer.post("add-skill", {
                token : data.token,
                skill : data.skill
            });
            thunkAPI.dispatch(getAboutUser({ token: data.token }));
            
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const removeSkill = createAsyncThunk(
    "user/remove-skill",
    async(data, thunkAPI) => {
        try {
            const response = await clientServer.delete("remove-skill", {
                data : {
                    token : data.token,
                    skill : data.skill
                }
            });
            thunkAPI.dispatch(getAboutUser({ token: data.token }));
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)