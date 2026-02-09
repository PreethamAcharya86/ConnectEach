import Team from "../models/groupModel.js";
import User from "../models/userModel.js";

export const createTeam = async(req,res) => {
    const { token, teamName } = req.body;
    if(!token || !teamName) {
        return res.status(400).json({ ErrMsg: "Some parameters are missing" });
    }
    try {
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ ErrMsg: "User not found!"});
        }
        const newTeam = new Team({
            teamName : teamName,
            createdBy : user._id
        })
        if(req.file) {
            newTeam.teamPitcure = req.file.filename;
        }
        await newTeam.save();
        res.status(200).json({ message: "Team Created Successfully"})
    }catch(error) {
        res.status(500).json({ msg: error.message });
    }
}
export const postChat = async(req,res) => {
    const{ token, teamId, body } = req.body;
    try {
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ msg: "User not found!"});
        }
        const team = await Team.findOne({ _id: teamId});
        if(!team) {
            return res.status(404).json({ ErrMsg: "Team not found!"});
        }
        team.chat.push({
            body: body,
            chatBy : user._id
        })
        await team.save()
        return res.status(200).json({ msg: "Chat added successfully"});
    }catch(error) {
        res.status(500).json({ message: error });
    }
}
export const deleteChat = async(req,res) => {
    const {token, teamId, chatId} = req.body;
    try {
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ ErrMsg : "user not found!" })
        }
        const team = await Team.findOne({ _id: teamId});
        if(!team) {
            return res.status(404).json({ ErrMsg: "Team not found!"});
        }
        await Team.findByIdAndUpdate(teamId, { $pull :{ chat :{ _id : chatId }}});
        return res.status(200).json({ message: "Chat deleted successfully"});
    }catch(error) {
        return res.status(500).json({ msg: error });
    }
    
}

export const getChat = async(req,res) =>{
    const { teamId } = req.query;
    const team = await Team.findOne({ _id: teamId }).populate({
        path : "chat",
        populate : {
            path : "chatBy",
        }
    });
    if(!team) {
        return res.status(404).json({ ErrMsg: "Team not found!"});
    }
    return res.json(team.chat)
}

export const deleteTeam = async(req,res) => {
    const {token, teamId} = req.body;
    if(!token || !teamId) {
        return res.status(400).json({ ErrMsg: "Some parameters are missing" });
    }
    try{
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ ErrMsg : "user not found!" })
        }
        const team = await Team.findOne({ _id: teamId});
        if(!team) {
            return res.status(404).json({ ErrMsg: "Team not found!"});
        }
        if(user._id.toString() !== team.createdBy.toString()) {
            return res.status(500).json({ ErrMsg: "You are not the creator of these group" });
        }
        await Team.deleteOne({ _id: teamId});
        return res.status(200).json({ message: "Team deleted successfully"});
    }catch(error) {
        return res.status(500).json({ ErrMsg: error });
    }
}
export const getMyTeam = async(req,res) => {
    const { token } = req.query;
    try {
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ msg : "user not found!" });
        }
        const teams = await Team.find({ 
            $or : [
                { createdBy : user._id },
                { members : user._id }
            ]
        }).populate("members")
        if(teams.length == 0) {
            return res.status(200).json([]);
        }
        return res.status(200).json(teams);
    } catch(error) {
        return res.status(500).json({ msg: error });
    }
}

export const getTeam = async(req,res) => {
    const { teamId } = req.query;
    try {
        const teamData = await Team.findOne({ _id: teamId }).populate("createdBy members")
        return res.json({ teamData });
    }catch(error) {
        return res.status(500).json({msg: error.message});
    }
}


export const addTeamMembers = async(req,res) => {
    const {token, teamId,  members } = req.body;
    if (!token || !teamId || !members) {
        return res.status(400).json({ ErrMsg: "Some parameters are missing" });
    }
    try {
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ ErrMsg : "user not found!" });
        }
        const team = await Team.findOne({ _id: teamId });
        if(!team) {
            return res.status(404).json({ ErrMsg: "Team not found!"});
        }
        if (team.createdBy.toString() !== user._id.toString()) {
            return res.status(403).json({ ErrMsg: "Only team admin can add members!" });
        }
        await Team.findByIdAndUpdate(
            teamId,
            {
                $addToSet: { members: { $each: members } },
            },
            { new: true }
        );
        return res.status(200).json({ message: "Members added successfully!" });
    }catch(error) {
        return res.status(500).json({message: error.message});
    }
}
export const removeTeamMember = async(req,res) => {
    const { token, teamId, memberId } = req.body;
    if(!token || !teamId) {
        return res.status(400).json({ ErrMsg: "Some parameters are missing" });
    }
    try{
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ ErrMsg : "user not found!" })
        }
        const team = await Team.findOne({ _id: teamId});
        if(!team) {
            return res.status(404).json({ ErrMsg: "Team not found!"});
        }
        const isAdmin = user._id.toString() === team.createdBy.toString();
        const isTeamMember = team.members.some((id) => 
            id.toString() === user._id.toString()
        );
        if( !isAdmin && !isTeamMember) {
            return res.status(500).json({ ErrMsg: "You are not allowed to remove members" });
        }
        team.members = team.members.filter(
            (id) => id.toString() !== memberId.toString()
        );
        await team.save();
        return res.status(200).json({ message: "Member removed successfully"});
    }catch(error) {
        return res.status(500).json({ message: error });
    }
}