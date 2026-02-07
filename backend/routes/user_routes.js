import { Router } from "express";
import { register, login, uploadProfilePicture, updateUserProfile, getUserAndProfile,updateProfileData, getAllProfiles, downloadProfile, sendConnectionRequest, acceptConnectionRequest, getConnectionRequests, myConnections, getUser_Profile, deleteEducation, deleteWorkHistory, uploadBackgroundImage, searchUser, addSkills, removeSkills } from "../controllers/user.js";
import multer from "multer";

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

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/upload-profile-picture").post(upload.single("file"),uploadProfilePicture);
router.route("/upload-background-image").post(upload.single("file"),uploadBackgroundImage);
router.route("/update-profile").post(updateUserProfile);
router.route("/get-user-and-profile").get(getUserAndProfile);
router.route("/profile-update").post(updateProfileData);
router.route("/get-all-profiles").get(getAllProfiles);
router.route("/download-resume").get(downloadProfile);
router.route("/send-connection-request").post(sendConnectionRequest);
router.route("/get-connection-requests").get(getConnectionRequests);
router.route("/accept-connection-request").post(acceptConnectionRequest);
router.route("/getUserProfile").get(getUser_Profile);
router.route("/my-connections").get(myConnections);
router.route("/delete-Education").post(deleteEducation);
router.route("/delete-work-history").post(deleteWorkHistory);
router.route("/search-users").get(searchUser);
router.route("/add-skill").post(addSkills);
router.route("/remove-skill").delete(removeSkills);

export default router;