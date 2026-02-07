import clientServer from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { teamReset } from "../../reducer/teamReducer";
import { getAboutUser } from "../authAction";

export const createTeam = createAsyncThunk(
    "teams/create-team",
    async(teamData, thunkAPI) => {
        try {
            const response = await clientServer.post("/create-team", {
                token : teamData.token,
                teamName : teamData.teamName,
                file : teamData.file
            }, 
            {
                headers : {
                    'Content-Type' : 'multipart/form-data'
                }
            })
            thunkAPI.dispatch(getMyTeam({ token: teamData.token }))
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error) {
            console.log(error.message)
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const getMyTeam = createAsyncThunk(
    "teams/get-my-team",
    async(userData, thunkAPI) => {
        try {
            const response = await clientServer.get("/get-my-team", {
                params : {
                    token : userData.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data);
        } catch(error) {
            console.log(error.message)
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const deleteTeam = createAsyncThunk(
    "teams/delete-team",
    async(teamData, thunkAPI) => {
        try {
            const response = await clientServer.delete("/delete-team", {
                data : {
                    token : teamData.token,
                    teamId : teamData.teamId
                }
            })
            thunkAPI.dispatch(getMyTeam({ token: teamData.token }))
            return thunkAPI.fulfillWithValue(response.data);
        } catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
        
    }
)
export const postChat = createAsyncThunk(
    "team/post-chat",
    async(chatData, thunkAPI) => {
        try {
            const response = await clientServer.post("/post-chat", {
                token : chatData.token,
                teamId : chatData.teamId,
                body : chatData.body
            })
            thunkAPI.dispatch(getChat({ teamId : chatData.teamId }))
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const getChat = createAsyncThunk(
    "team/get-chat",
    async(chatData, thunkAPI) => {
        try {
            const response = await clientServer.get("/get-chat",{
                params : {
                    teamId : chatData.teamId
                }
            })
            return thunkAPI.fulfillWithValue(response.data);
        } catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
        
    }
)
export const deleteChat = createAsyncThunk(
    "team/delete-chat",
    async(chatData, thunkAPI) => {
        try {
            const response = await clientServer.delete("/delete-chat",{
                data : {
                    token : chatData.token,
                    teamId : chatData.teamId,
                    chatId : chatData.chatId
                }
            })
            thunkAPI.dispatch(getChat({ teamId : chatData.teamId }))
            return thunkAPI.fulfillWithValue(response.data);
        } catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
        
    }
)
export const getTeam =createAsyncThunk(
    "team/get-team",
    async(data,thunkAPI) => {
        try {
            const response = await clientServer.get("/get-team", {
            params :{
                teamId: data.teamId
            }})
            return thunkAPI.fulfillWithValue(response.data);
        } catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const addMembers = createAsyncThunk(
    "team/add-members",
    async(data, thunkAPI) => {
        try {
            const response = await clientServer.post("/add-members", {
                token : data.token,
                teamId : data.teamId,
                members : data.members
            })
            thunkAPI.dispatch(getTeam({ teamId : data.teamId }))
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const removeMember = createAsyncThunk(
    "team/remove-member",
    async(data, thunkAPI) => {
        try {
            const response = await clientServer.delete("/remove-member", {
                data : {
                    token : data.token,
                    teamId : data.teamId,
                    memberId : data.memberId
                }
            })
            thunkAPI.dispatch(getTeam({ teamId : data.teamId }))
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)