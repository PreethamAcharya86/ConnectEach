import { Router } from "express";
import { createPost, getAllPost, deletePost, commentPost, get_comments_by_post, delete_comment, likePost } from "../controllers/posts.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/all-post").get(getAllPost);
router.route("/upload-post").post(upload.single("media"), createPost);
router.route("/delete-post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get-comments").get(get_comments_by_post);
router.route("/delete-comment").delete(delete_comment);
router.route("/like-post").post(likePost);

export default router;