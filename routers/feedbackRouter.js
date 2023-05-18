const router = require('express').Router();
const feedbackController = require('../controller/feedbackController');
const { upload } = require('../middlewares/common/fileUpload');
const authorization = require('../middlewares/common/authorization');

router.post("/", authorization("admin", "superAdmin", "student"), upload.array("images", 10), feedbackController.addFeedback);

module.exports= router;