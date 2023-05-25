const router = require('express').Router();
const {
    allMessages,
    sendMessage,
  } = require("../controller/messageController");
  const authorization = require('../middlewares/common/authorization');

router.get("/:chatId",authorization("student", "doctor", "superAdmin") , allMessages);
router.post("/", authorization("student", "doctor", "superAdmin"), sendMessage);
  
//   router.route("/:chatId").get(protect, allMessages);
//   router.route("/").post(protect, sendMessage);
  
  module.exports = router;