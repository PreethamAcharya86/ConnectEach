import { createSlice } from "@reduxjs/toolkit";
import { addMembers,  createTeam,  deleteChat,  deleteTeam,  getChat,  getMyTeam,  getTeam,  removeMember,} from "../../action/teamAction";
const initialState = {
  myTeams: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  teamCreated : false,
  message: "",
  all_teams: [],
  team_chat: [],
  teamMembers: [],
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    teamReset: () => initialState,
    teamEmptyMessage: (state) => {
      state.message = "";
    },
    emptyIsError: (state) => {
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.teamCreated = false;
        state.message = action.payload;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teamCreated = true;
        state.isError = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(getMyTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.team = false;
        state.myTeams = action.payload;
      })
      .addCase(getMyTeam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.teamCreated = false;
      })
      .addCase(getChat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChat.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.team_chat = action.payload;
      })
      .addCase(getTeam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.teamMembers = action.payload.teamData;
      })
      .addCase(deleteTeam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload;
      })
      .addCase(deleteChat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload;
      })
      .addCase(addMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload;
      })
      .addCase(removeMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload;
      })

  },
});

export const { teamEmptyMessage, emptyIsError, teamReset } = teamSlice.actions;
export default teamSlice.reducer;
