import express from "express";
import {
  createTag,
  deleteTag,
  getTags,
  getTagById,
  updateTag,
} from "../controller/tagController.js";

const router = express.Router();

router.get("/tags", getTags);
router.get("/tag/:id", getTagById);
router.post("/tag", createTag);
router.put("/tag/:id", updateTag);
router.delete("/tag/:id", deleteTag);

export default router;
