import express from "express";
import { signupUser, loginUser, forgotPassword } from "../controller/user-controller.js";
import { uploadImage, getImage } from "../controller/image-controller.js";

import {
  newComment,
  getComments,
  deleteComment,
} from "../controller/comment-controller.js";

import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controller/post-controller.js";
import upload from "../utils/upload.js";

import { authenticateToken } from "../controller/jwt-controller.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/forgotPassword", forgotPassword);
//We need middleware here which helps in weather the file is correct or not and some changes
//Syntax : post("/routerpath",middlewear,function);
//Middle wear in utils which is multer-gridfs-storage which uploads directly to mongodb
router.post("/file/upload", upload.single("file"), uploadImage);
router.get("/file/:filename", getImage);

router.post("/create", authenticateToken, createPost);

router.get("/posts", authenticateToken, getAllPosts);

router.get("/post/:id", authenticateToken, getPost);

router.put("/update/:id", authenticateToken, updatePost);

router.delete("/delete/:id", authenticateToken, deletePost);

router.post("/comment/new", authenticateToken, newComment);

router.get("/comments/:id", authenticateToken, getComments);

router.delete("/comment/delete/:id", authenticateToken, deleteComment);
export default router;
