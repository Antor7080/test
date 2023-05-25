const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controller/chatController");
const authorization = require('../middlewares/common/authorization');
const router = express.Router();

router.route("/").post(authorization("student", "doctor"), accessChat);
router.route("/").get(authorization("student", "doctor"), fetchChats);
router.route("/group").post(authorization("student", "doctor"), createGroupChat);
router.route("/rename").put(authorization("student", "doctor"), renameGroup);
router.route("/groupremove").put(authorization("student", "doctor"), removeFromGroup);
router.route("/groupadd").put(authorization("student", "doctor"), addToGroup);

module.exports = router;