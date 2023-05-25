const router = require("express").Router();
const {
  addNewNotification,
  deleteNotification,
  getNotification,
} = require("../controller/notificationController");
const authorization = require("../middlewares/common/authorization");
// const auth = require("../middleware/authMiddleware");


router.route("/").post(authorization("student", "doctor", "admin"), addNewNotification).get(authorization("student", "doctor", "admin"), getNotification);
router.route("/:notificationId").delete(authorization("student", "doctor", "admin"), deleteNotification);

module.exports = router;
