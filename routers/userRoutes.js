const router = require('express').Router();
const userController = require('../controller/userController');
const { userValidator,
    userValidatorHandler } = require('../middlewares/validator/userValidator');
const authorization = require('../middlewares/common/authorization');
const { upload } = require('../middlewares/common/fileUpload');

/**
 * @swagger
 * /api/user/signup:
 *  post:
 *      description: Use to register user
 *      parameters:
 *        - name: name
 *          description: name of user
 *          in: formData
 *          required: true
 *          type: string
 *        - name: email
 *          description: email of user
 *          in: formData
 *          required: true
 *          type: string
 *        - name: password
 *          description: password of user
 *          in: formData
 *          required: true
 *          type: string
 *        - name: image
 *          description: image of user
 *          in: formData
 *          required: true
 *          type: file
 *        - name: idCardImage
 *          description: idCardImage of user
 *          in: formData
 *          required: true
 *          type: file
 *        - name: role
 *          description: role of user
 *          in: formData
 *          required: false
 *          type: string
 *          default: student
 *        - name: IdNumber
 *          description: IdNumber of user
 *          in: formData
 *          required: true
 *          type: string
 *        - name: phoneNumber
 *          description: phoneNumber of user
 *          in: formData
 *          required: true
 *          type: string
 *        - name: gender
 *          description: gender of user
 *          in: formData
 *          required: true
 *          type: string
 *        - name: shift
 *          description: shift of user
 *          in: formData
 *          required: true
 *          type: string
 *        - name: department
 *          description: department of user
 *          in: formData 
 *          required: true
 *          type: string
 *      responses:
 *         '201':
 *          description: User created successfully
 *         '400':
 *          description: Bad request
 *         '500':
 *          description: Internal server error
 */

router.post('/signup', upload.fields([{ name: 'image', maxCount: 1 },
{ name: "idCardImage", maxCount: 1 }]), userValidator, userValidatorHandler, userController.register);

/**
 * @swagger
 *  /api/user/login:
 *   post:
 *      description: Use to login user
 *      content type: application/json
 *      parameters:
 *       - in : body
 *         name: body
 *         description: user login
 *         schema:
 *           type: object
 *           properties:
 *            IdNumber:
 *             type: string
 *            password:
 *             type: string
 *      responses:
 *        '200':
 *         description: login successfully
 *        '400':
 *         description: Bad request
 *        '500':
 *         description: Internal server error
 */
router.post('/login', userController.login);


/**
 * @swagger
 * /api/user/verifyOTP:
 *  post:
 *     description: Use to verify user phone number
 *     parameters:
 *       - in: body
 *         name: body
 *         description: user verify phone number
 *         schema:
 *           type: object
 *           properties: 
 *            phoneNumber:
 *               type: string
 *            verificationCode:
 *              type: string
 *     responses:
 *       '200':
 *         description: OTP verified successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/verifyOTP", userController.verifyPhoneNumber);

/**
 * @swagger
 *  /api/user/resetPassword:
 *   post:
 *    description: Use to reset user password
 *    parameters:
 *     - in: header
 *       name: authorization
 *       type: string
 *       description: token
 *     - in: body
 *       name: body
 *       description: user reset password
 *       schema:
 *        type: object
 *        properties:
 *         IdNumber:
 *          type: string
 *    responses:
 *       '200':
 *         description: OTP sent successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */      
router.post("/resetPassword", userController.passwordReset);

/**
 * @swagger
 * /api/user/resetPassword/verifyOTP:
 *  post:
 *   description: Use to verify OTP for reset password
 *   parameters:
 *    - in: header
 *      name: authorization
 *      type: string
 *      description: token
 *    - in: body
 *      name: body
 *      description: user verify OTP for reset password
 *      schema:
 *       type: object
 *       properties:
 *         IdNumber:
 *          type: string
 *         verificationCode:
 *          type: string
 *         password:
 *          type: string
 *   responses:
 *    '200':
 *     description: OTP verified successfully
 *    '400':
 *     description: Bad request
 *    '500':
 *     description: Internal server error
 */
router.post("/resetPassword/verifyOTP", userController.passwordResetVerify);

/**
 * @swagger
 * /api/user/changePassword:
 *  patch:
 *      description: Use to change user password
 *      parameters:
 *      - in: header
 *        name: authorization
 *        type: string
 *        description: token
 *      - in: body
 *        name: body
 *        description: user change password 
 *        schema:
 *         type: object
 *         properties:
 *           oldPassword:
 *              type: string
 *           newPassword:
 *              type: string
 *      responses:
 *       '200':
 *            description: Password changed successfully
 *       '400':
 *            description: Bad request
 *       '500':
 *            description: Internal server error
 */
router.patch("/changePassword", authorization("admin", "user", 'superAdmin', 'student', 'doctor', 'staff'), userController.passwordChange);

/**
 * @openapi
 * /api/user/get-all-user:
 *  get:
 *   description: Get all users
 *   parameters:
 *     - in: header
 *       name: authorization
 *       type: string
 *       description: token
 *     - in: query
 *       name: page
 *       description: page number
 *     - in: query
 *       name: limit
 *       description: limit
 *     - in: query
 *       name: name
 *       description: name
 *     - in: query
 *       name: sort
 *       description: sort by name or createdAt or updatedAt or any other field
 *
 *   responses:
 *          '200':
 *             description: A successful response
 *          '500':
 *             description: Internal server error
 */
router.get('/get-all-user', userController.getUsers);

/**
 * @swagger
 * /api/user/get-user/{id}:
 *   get:
 *     description: Use to get single user
 *     parameters:
 *       - in: header
 *         name: authorization
 *         type: string
 *         description: token
 *       - name: id
 *         description: id of user
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 * 
 */
router.get('/get-user/:id', userController .getUser);


/**
 * @swagger
 * /api/user/update-user/{id}:
 *  put:
 *      description: Use to update user
 *      parameters:
 *       - in: header
 *         name: authorization
 *         type: string
 *         description: token
 *       - in: body
 *         name: body
 *         description: give user info to update
 *         schema:
 *          type: object
 *          properties:
 *            name:
 *             type: string
 *            email:
 *             type: string
 *            department:
 *             type: string
 *            shift: 
 *             type: string
 *            phoneNumber:
 *             type: string
 * 
 *      responses:
 *         '200':
 *          description: User updated successfully
 *         '400':
 *          description: Bad request
 *         '500':
 *          description: Internal server error
 */

router.put('/update-user/:id', userController.updateUser);

/**
 * @swagger
 * /api/user/bulk-update:
 *  put:
 *     description: Use to update user
 *     parameters:
 *      - in: header
 *        name: authorization
 *        type: string
 *        description: token
 *      - in: body
 *        name: body
 *        description: give user info to update
 *        schema:
 *         type: object
 *         properties:
 *          ids: 
 *           type: array
 *          status:
 *           type: string
 *     responses:
 *      '200':
 *         description: User updated successfully
 *      '400':
 *         description: Bad request
 *      '500':
 *           description: Internal server error
 */
router.put('/bulk-update', userController.bulkUpdate);


// router.put('change-password', userController.passwordChange);

/**
 * @swagger
 * /api/user/update-user-status/{id}:
 *  patch:
 *      description: Use to update user status
 *      parameters:
 *        - in: header
 *          name: authorization
 *          type: string
 *          description: token
 *        - in: body
 *          name: body
 *          description: give user id and status to update
 *          schema:
 *           type: object
 *           properties:
 *            status:
 *             type: string
 *      responses: 
 *        '200':
 *         description: User status updated successfully
 *        '400':
 *         description: Bad request
 *        '500':
 *         description: Internal server error
 */
router.patch("/update-user-status/:id", userController.statusUpdate);

/**
 * @swagger
 * /api/user/image-logo-change/{id}:
 *  put:
 *     description: Use to update user image and id card image
 *     parameters:
 *     - in: header
 *       name: authorization
 *       type: string
 *       description: token
 *     - in: formData
 *       name: image
 *       description: image of user
 *       type: file
 *     - in: formData
 *       name: idCardImage
 *       description: idCardImage of user
 *       type: file
 *     - in: path
 *       name: id
 *       description: id of user
 *       type: string
 *     consumes:
 *      - multipart/form-data   
 *     security:
 *      - bearerAuth: [] 
 * 
 *     responses:
 *      '200':
 *        description: User image and id card image updated successfully
 *      '400':
 *        description: Bad request
 *      '500':
 *        description: Internal server error
 * 
 */
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

router.get("/",authorization("student", "admin", "doctor"), userController.allUsers)


module.exports = router


