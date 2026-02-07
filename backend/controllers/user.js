import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";
import ConnectionRequest from "../models/connectionModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from 'pdfkit'
import fs from 'fs'
import sharp from "sharp";

const convertUserDataToPDF = async (userData) => {
    const doc = new PDFDocument({ margin: 50 });
    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);
    doc.pipe(stream);

    const primaryColor = "#1F4ED8";
    const gray = "#6B7280";

    const originalImgPath = "uploads/" + userData.userId.profilePicture;
    const convertedImgPath = "uploads/" + crypto.randomBytes(16).toString("hex") + ".png";

    try {
        await sharp(originalImgPath).png().toFile(convertedImgPath);
        doc.image(convertedImgPath, 50, 50, { width: 100, height: 100 });
        stream.on("finish", () => fs.unlink(convertedImgPath, () => {}));
    } catch {
        doc.fontSize(10).fillColor(gray).text("Profile picture not available", 50, 90);
    }

    doc
        .fontSize(26)
        .fillColor(primaryColor)
        .text(userData.userId.name, 170, 50);

    doc
        .fontSize(12)
        .fillColor(gray)
        .text(userData.userId.currentPost || "", 170, 80);

    doc.moveTo(50, 170).lineTo(550, 170).strokeColor(primaryColor).stroke();

    doc.moveDown();
    doc.fontSize(11).fillColor("black");
    doc.text(`Username: ${userData.userId.username}`);
    doc.text(`Email: ${userData.userId.email}`);

    doc.moveDown();
    doc.fontSize(14).fillColor(primaryColor).text("PROFILE");
    doc.fontSize(11).fillColor("black").text(userData.bio || "No bio provided", {
        width: 500,
        align: "left",
    });

    doc.moveDown();
    doc.fontSize(14).fillColor(primaryColor).text("SKILLS");
    doc.fontSize(11).fillColor("black");

    userData.skills.forEach((skill, index) => {
        doc.text(`• ${skill}`);
    });
    if(Array.isArray(userData.pastWork) && userData.pastWork.length > 0) {
        doc.moveDown();
        doc.fontSize(14).fillColor(primaryColor).text("EXPERIENCE");
        doc.fillColor("black");
        doc.moveDown(0.5);
        userData.pastWork.forEach((work) => {
            doc.fontSize(13).font("Helvetica-Bold").text(work.company);

            doc.fontSize(11).font("Helvetica")
            .text(`${work.position} | ${work.years}`, { indent: 10 });
            doc.moveDown(0.5);
        });
    }
    
    doc.end();
    return outputPath;
};


export const register = async(req,res) => {
    try {
        const { username, name, email, password, } = req.body;
        if(!username || !name || !email || !password) {
            return res.status(400).json({ErrMsg: "Please fill all the details"});
        }

        const user =  await User.findOne({email});

        if (user) {
            return res.status(400).json({ErrMsg: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);  // Password hashing

        const newUser = new User({
            username,
            name,
            email,
            password: hashedPassword,
        })
        await newUser.save();
        const profile = new Profile({userId: newUser._id});
        await profile.save();
        res.status(201).json({message: "User registered successfully"});
    }catch(error) {
        res.status(500).json({ErrMsg: error.message});   
    }
}

export const login = async(req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({ErrMsg: "Please fill all the details"});
        }
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({ErrMsg: "User not found"});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ErrMsg: "Invalid password"});
        }
        
        const token = crypto.randomBytes(32).toString("hex");
        await User.updateOne({_id: user._id}, { token });

        res.json({ token: token });
    }catch(error) {
        res.status(500).json({ErrMsg: error.message});
    }
}

export const uploadProfilePicture = async(req,res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({token});
        if(!user) {
            return res.status(404).json({ErrMsg: "User not found"});
        }
        user.profilePicture = req.file.filename;
        await user.save();
        return res.status(200).json({message: "Profile picture updated"});
    }catch(error) {
        return res.status(500).json({msg: error.message});
    }
}
export const uploadBackgroundImage = async(req,res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({token});
        if(!user) {
            return res.status(404).json({ErrMsg: "User not found"});
        }
        user.backgroundImage = req.file.filename;
        await user.save();
        return res.status(200).json({message: "Background Image updated"});
    }catch(error) {
        return res.status(500).json({msg: error.message});
    }
}

export const updateUserProfile = async(req,res) => {
    const {token, ...newUserData} = req.body;
    try { 
        const user = await User.findOne({token: token});
        if(!user) {
            return res.status(404).json({ErrMsg : "User not found!"});
        }
        const { name, username, email } = newUserData;
        const existingUser = await User.findOne({
            $or: [
                { name },
                { username },
                { email }
            ],
            _id: { $ne: user._id }
        });
    
        if (existingUser && String(existingUser._id) !== String(user._id)) {
            return res.status(500).json({ ErrMsg: "User already exists!" });
        }
        Object.assign(user, newUserData);
        await user.save();

        res.json({ message: "User Updated"});

    }catch(error) {
        res.status(500).json({msg: error.message})
    }
}

export const getUserAndProfile = async(req,res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({token: token})
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const profile = await Profile.findOne({userId: user._id})
            .populate('userId', 'name email username profilePicture backgroundImage')
            
        await profile.save();
        res.status(200).json({ profile });
    }catch(error) {
        res.status(500).json({message: error.message});
    }
}

export const updateProfileData = async(req, res) => {
    try {
        const { token, ...newProfileData } = req.body;
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({message : "User not found!"});
        }
        const profile = await Profile.findOne({userId: user._id});
        if(!profile) {
            return res.status(404).json({message : "Profile not found!"});
        }
        if(newProfileData.education) {
            profile.education.push(...newProfileData.education)
        }
        if(newProfileData.pastWork) {
            profile.pastWork.push(...newProfileData.pastWork)
        }
        Object.assign(profile, { ...newProfileData, education: profile.education, pastWork: profile.pastWork });
        await profile.save();
        res.json({ message: "Profile Updated"});

    }catch(error) {
        res.status(500).json({message: error.message});
    }
}
export const deleteEducation = async(req,res) => {
    try {
        const { token, eduId} = req.body;
        if(!token || !eduId) {
            return res.status(400).json({ message: "Some parameters missing" });
        }
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({message : "Profile not found!"});
        }
        const profile = await Profile.findOne({ userId: user._id })
        if(!profile) {
            return res.status(404).json({message : "Profile not found!"});
        }
        profile.education = profile.education.filter((element) => element._id.toString() !== eduId)
        await profile.save();
        res.json({ message: "Education deleted successfully", education: profile.education });
    }catch(error) {
        res.status(500).json({message: error.message});
    }
    
}
export const deleteWorkHistory = async(req,res) => {
    try {
        const { token, workId} = req.body;
        if(!token || !workId) {
            return res.status(400).json({ message: "Some parameters missing" });
        }
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({message : "Profile not found!"});
        }
        const profile = await Profile.findOne({ userId: user._id })
        if(!profile) {
            return res.status(404).json({message : "Profile not found!"});
        }
        profile.pastWork = profile.pastWork.filter((element) => element._id.toString() !== workId)
        await profile.save();
        res.json({ message: "Education deleted successfully", pastWork: profile.pastWork });
    }catch(error) {
        res.status(500).json({message: error.message});
    }
    
}

export const getAllProfiles = async(req,res) => {
    try {
        const profiles = await Profile.find().populate('userId', 'name email username profilePicture backgroundImage').sort({ createdAt: -1 })
        res.json({ profiles });
    }catch(error) {
        res.status(500).json({message: error.message});
    }
}

export const downloadProfile = async(req,res) => {
    const user_id = req.query.id;
    try {
        const profile = await Profile.findOne({ userId: user_id }).populate('userId', 'name username email profilePicture');
        const convert_data =  await convertUserDataToPDF(profile);
        return res.json({ convert_data });
    }catch(error) {
        res.status(500).json({msg: error.message});
    }
}

export const sendConnectionRequest = async(req,res) => {
    const { token, connectionId } = req.body;
    try {
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ErrMsg: "User not found"});
        }
        const connectionUser = await User.findOne({_id: connectionId});

        if(!connectionUser) {
            return res.status(404).json({ErrMsg: "Connection user not found"});
        }

        const existingRequest = await ConnectionRequest.findOne({ userId: user._id, connectionId: connectionUser._id });
        if(existingRequest) {
            return res.status(400).json({ErrMsg: "Connection request already sent"});
        }

        const newRequest = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
        });
        
        await newRequest.save();
        res.status(200).json({message: "Connection request sent successfully"});
        
    }catch(error) {
        res.status(500).json({msg: error.message});
    }
}

export const getConnectionRequests = async(req,res) => {
    const { token } = req.query;
    try {
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ErrMsg: "User not found"});
        }
        const connections = await ConnectionRequest.find({ userId: user._id }).populate('connectionId', 'name username email profilePicture');
        return res.json({ connections });
    }catch(error) {
        res.status(500).json({msg: error.message});
    }
}

export const myConnections = async(req,res) => {
    const { token } = req.query;
    try {
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ErrMsg: "User not found"});
        }

        const connections = await ConnectionRequest.find({ connectionId: user._id }).populate('userId', 'name username email profilePicture');
        res.json({ connections });
    }catch(error) {
        res.status(500).json({msg: error.message});
    }
}

export const acceptConnectionRequest = async(req,res) => {
    const { token, requestId, action_type } = req.body;
    try {
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ErrMsg: "User not found"});
        }  
        const connection = await ConnectionRequest.findOne({ connectionId: user._id, userId: requestId });
        if(!connection) {
            return res.status(404).json({ErrMsg: "Connection request not found"});
        }
        
        if(action_type === "accept") {
            connection.status_accepted = true;
            const userConnection = await ConnectionRequest.findOne({ connectionId : requestId, userId: user._id});
            if(!userConnection) {
                const newRequest = new ConnectionRequest({
                    userId: user._id,
                    connectionId: requestId
                });
                newRequest.status_accepted = true;
                await newRequest.save()
            } 
            else {
                userConnection.status_accepted = true;
                await userConnection.save()
            }
            await connection.save();
            return res.status(200).json({message : "Connection request accepetd"})
        }else {
            await ConnectionRequest.deleteOne({userId :requestId, connectionId: user._id})
            return res.status(200).json({ErrMsg : "Connection rejected"})           
        }
    }catch(error) {
        return res.status(500).json({msg: error.message});
    }
}

export const getUser_Profile = async(req,res) => {
    const { username } = req.query;
    try {
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(404).json({ message: "User not found!"});
        }
        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name username email profilePicture backgroundImage');
        return res.json({ userProfile });
    }catch(error) {
        return res.status(500).json({message: error.message});
    }
}
export const searchUser = async(req,res) => {
    const { userData } = req.query;
    try {
        if (!userData || userData.trim() === "") {
            return res.status(400).json({ ErrMsg: "Search content is required" });
        }
        const users = await User.find({
            $or: [
                { "username": { $regex: userData, $options: "i" } },
                { "name": { $regex: userData, $options: "i" } },
                { "email": { $regex: userData, $options: "i" } },
            ],
        }).select("_id");

        const userIds = users.map((u) => u._id);

        const profiles = await Profile.find({
            userId: { $in: userIds },
        }).populate("userId", "name username email profilePicture backgroundImage").sort({ createdAt: -1 });
        res.status(200).json(profiles);
    } catch(error) {
        return res.status(500).json({msg: error.message});
    }
}
export const addSkills = async(req,res) => {
    const {token, skill} = req.body;
    if(!skill) {
        return res.status(400).json({ Err: "Please fill skill" });
    }
    try {
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ ErrMsg : "User not found!"})
        }
        
        const profile = await Profile.findOne({ userId : user._id });
        if(!profile) {
            return res.status(404).json({ ErrMsg: "Profile not found!"});
        }
        if (profile.skills.includes(skill)) {
            return res.status(200).json({ ErrMsg: "Skill already exists" });
        }
        profile.skills.push(skill);
        await profile.save();
        return res.status(200).json({ message : "Skill added!"})
    }catch(error) {
        return res.status(500).json({msg: error.message});
    }
}
export const removeSkills = async(req,res) => {
    const {token, skill} = req.body;
    if(!skill) {
        return res.status(400).json({ Err: "Please fill skill" });
    }
    try {
        const user = await User.findOne({ token });
        if(!user) {
            return res.status(404).json({ ErrMsg : "User not found!"})
        }
        
        const profile = await Profile.findOne({ userId : user._id });
        if(!profile) {
            return res.status(404).json({ ErrMsg: "Profile not found!"});
        }
        await Profile.updateOne(
            { userId : user._id },
            { $pull : {skills : skill}}
        )
        return res.status(200).json({ message : "Skill removed!"})
    }catch(error) {
        return res.status(500).json({msg: error.message});
    }
}