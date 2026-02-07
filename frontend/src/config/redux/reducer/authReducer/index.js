import { createSlice } from "@reduxjs/toolkit";
import { acceptConnection, getAboutUser, getAllUsers, getConnectionRequest, getMyConnections, loginUser, registerUser, searchUsers, sendConnectionRequest, updateBackgroundImage, updateProfile, updateProfilePicture } from "../../action/authAction/index.js";


const initialState = {
    user: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
    logedIn: false,
    isTokenThere: false,
    profileFetched: false,
    connections: [],
    myConnections: [],
    all_users : [],
    get_users : [],
    all_profile_fetched: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "Logged in";
        },
        authEmptyMessage : (state) => {
            state.message = ""
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.logedIn = true;
            state.message = {
                message: "Login Successfull"
            };
            state.user = action.payload;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload
            state.isError = false;
            state.logedIn = true;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getAboutUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload.profile;
            
        })
        .addCase(getAboutUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAllUsers.fulfilled, (state,action) => {
            state.isLoading = false;
            state.isError = false;
            state.all_profile_fetched = true;
            state.all_users = action.payload.profiles;
        })
        .addCase(getConnectionRequest.rejected, (state,action) => {
            state.message = action.payload
        })
        .addCase(getConnectionRequest.fulfilled, (state,action) => {
            state.connections = action.payload.connections
        })
        .addCase(getMyConnections.rejected, (state,action) => {
            state.isError = true;

        })
        .addCase(getMyConnections.fulfilled, (state,action) => {
            state.myConnections = [...action.payload.connections];
            
        })
        .addCase(sendConnectionRequest.fulfilled, (state,action) => {
            state.message = action.payload;
        })
        .addCase(sendConnectionRequest.rejected, (state,action) => {
            state.message = action.payload
        })
        .addCase(searchUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(searchUsers.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(searchUsers.fulfilled, (state,action) => {
            state.isLoading = false;
            state.isError = false;
            state.all_profile_fetched = true;
            state.get_users = action.payload;
        })
        .addCase(updateProfilePicture.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateProfilePicture.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(updateProfilePicture.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload
        })
        .addCase(updateBackgroundImage.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateBackgroundImage.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(updateBackgroundImage.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload;
        })
        .addCase(updateProfile.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload;
        })
        .addCase(acceptConnection.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(acceptConnection.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(acceptConnection.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload;
        })

    }

})
export const{ reset, authEmptyMessage, setTokenIsThere, setTokenIsNotThere } = authSlice.actions
export default authSlice.reducer;