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

router.route("/").post(authorization("student", "doctor", "admin"), accessChat);
router.route("/").get(authorization("student", "doctor", "admin"), fetchChats);
router.route("/group").post(authorization("student", "doctor", "admin"), createGroupChat);
router.route("/rename").put(authorization("student", "doctor", "admin"), renameGroup);
router.route("/groupremove").put(authorization("student", "doctor", "admin"), removeFromGroup);
router.route("/groupadd").put(authorization("student", "doctor", "admin"), addToGroup);

module.exports = router;