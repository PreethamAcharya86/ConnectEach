import { Router } from "express";
import multer from "multer";
import { addTeamMembers, createTeam, deleteChat, deleteTeam, getChat, getMyTeam, getTeam, postChat, removeTeamMember } from "../controllers/team.js";

const router = Router();

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname);
    }
});

const upload = multer({storage: multerStorage});

router.route("/create-team").post(upload.single("file"),createTeam);
router.route("/get-my-team").get(getMyTeam);
router.route("/get-team").get(getTeam);
router.route("/post-chat").post(postChat);
router.route("/delete-chat").delete(deleteChat);
router.route("/get-chat").get(getChat);
router.route("/delete-team").delete(deleteTeam);
router.route("/add-members").post(addTeamMembers);
router.route("/remove-member").delete(removeTeamMember);

export default router;