const router = require('express').Router();
const { upload } = require('../middlewares/common/fileUpload');

const reportController = require('../controller/reportController');
const authorization = require('../middlewares/common/authorization');
router.post('/add-report', authorization("student"), upload.fields([{
    name: 'image',
    maxCount: 10
}]), reportController.addReport);

router.get('/get-report/:id', authorization("student", "admin", "teacher", "superAdmin"), reportController.getReportById);
router.get("/single-user-report/:id", authorization("student", "admin", "teacher", "superAdmin"), reportController.getSingleUserReports);

router.get('/get-all-reports', authorization("admin", "superAdmin"), reportController.getAllReports);

module.exports = router;