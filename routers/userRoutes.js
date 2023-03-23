const router = require('express').Router();
const userController = require('../controller/userController');
const { userValidator,
    userValidatorHandler } = require('../middlewares/validator/userValidator');
const authorization = require('../middlewares/common/authorization');
const { upload } = require('../middlewares/common/fileUpload');

router.post('/signup', upload.fields([{ name: 'image', maxCount: 1 },
{ name: "idCardImage", maxCount: 1 }]), userValidator, userValidatorHandler, userController.register);
router.post('/login', userController.login);
router.post("/verifyOTP", userController.verifyPhoneNumber);
router.post("/resetPassword", userController.passwordReset);
router.post("/resetPassword/verifyOTP", userController.passwordResetVerify);
router.patch("/changePassword", authorization("admin", "user", 'superAdmin', 'shopOwner'), userController.passwordChange);
router.get('/get-all-user', userController.getUsers);
router.get('/get-user/:id', userController.getUser);
router.put('/update-user/:id', userController.updateUser);
router.put('/bulk-update', userController.bulkUpdate);
router.put('change-password', userController.passwordChange);
router.patch("/update-user-status/:id", userController.statusUpdate);
router.put("/image-logo-change/:id", upload.fields([
    {
        name: 'image',
        maxCount: 1
    },
    {
        name: 'idCardImage',
        maxCount: 1
    }
]), userController.imageAndIdCardUpdate)


module.exports = router