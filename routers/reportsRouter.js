const router = require('express').Router();
const { upload } = require('../middlewares/common/fileUpload');

const reportController = require('../controller/reportController');
const authorization = require('../middlewares/common/authorization');

/**
 * @swagger
 *  /api/reports/add-report:
 *   post:
 *    description: Use to add report
 *    parameters:
 *      - in : header
 *        name: Authorization
 *        description: The auth token generated from backend
 *        required: true
 *        type: string
 *      - in : formData
 *        name: title
 *        description: title of report
 *        required: true
 *        type: string
 *      - in : formData
 *        name: description
 *        description: description of report
 *        required: true
 *        type: string
 *      - in : formData
 *        name: category
 *        description: category of report
 *        required: true
 *        type: string
 *      - in : formData
 *        name: images
 *        description: images of report
 *        required: false
 *        type: file
 *      - in : formData
 *        name: filesLinks
 *        description: filesLinks of report
 *        required: false
 *        type: array
 *      - in : formData
 *        name: building
 *        description: which building the report is about
 *        required: false
 *        type: string
 *      - in : formData
 *        name: room
 *        description: which room the report is about
 *        required: false
 *        type: string
 *      - in : formData
 *        name: floor 
 *        description: which floor the report is about
 *        required: false
 *        type: string
 *      - in : formData
 *        name: deskNumber
 *        description: which deskNumber the report is about
 *        required: false
 *        type: string
 *      - in : formData
 *        name: isAnonymous
 *        description: user want to isAnonymous or not
 *        required: false
 *        type: boolean
 *    responses:
 *     '200':
 *      description: successfully added report
 *     '400':
 *       description: Bad request
 *     '401':
 *       description: Unauthorized
 *     '500':
 *       description: Internal server error
 * 
 */
router.post('/add-report', authorization("student"), upload.fields([{
    name: 'image',
    maxCount: 10
}]), reportController.addReport);


/**
 * @swagger
 * /api/reports/get-report/{id}:
 *  get:
 *   description: Use to get report by id
 *   parameters:
 *     - in : header
 *       name: Authorization
 *       description: The auth token generated from backend
 *       required: true
 *       type: string
 *     - in : path
 *       name: id
 *       description: id of report
 *       required: true
 *       type: string
 *   responses:
 *    '200':
 *       description: successfully get report
 *    '400':
 *       description: Bad request
 *    '401':
 *       description: Unauthorized
 *    '500':
 *       description: Internal server error
 */
router.get('/get-report/:id', /* authorization("student", "admin", "teacher", "superAdmin") */ reportController.getReportById);

/**
 * @swagger
 *  /api/reports/single-user-report/{id}:
 *   get:
 *     description: Use to get all reports of a user
 *     parameters:
 *      - in : header
 *        name: Authorization
 *        description: The auth token generated from backend
 */
router.get("/single-user-report/:id",/*  authorization("student", "admin", "teacher", "superAdmin"), */ reportController.getSingleUserReports);

/**
 * @swagger
 *  /api/reports/add-comment/{id}:
 *   post:
 *       description: Use to add comment to report
 *       parameters:
 *         - in : header
 *           name: Authorization
 *           description: The auth token generated from backend
 *           required: true
 *           type: string
 *         - in : path
 *           name: id
 *           description: id of report
 *           required: true
 *           type: string
 *         - in : body
 *           name: body
 *           description: comment information
 *           required: true
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *             isAnonymous: 
 *               type: boolean
 *       responses:
 *       '200':
 *          description: successfully added comment
 *       '400':
 *          description: Bad request
 *       '401':
 *          description: Unauthorized
 *       '500':
 *          description: Internal server error
 */

router.post("/add-comment/:id", authorization("admin", "superAdmin", "student"), reportController.addComment);

/**
 * @swagger
 *  /api/reports/get-all-reports:
 *    get:
 *     description: Use to get all reports
 *     parameters:
 *      - in : header
 *        name: Authorization
 *        description: The auth token generated from backend
 *        required: true
 *        type: string
 *      - in : query
 *        name: page
 *        description: page number
 *      - in : query
 *        name: limit
 *        description: limit
 *      - in : query
 *        name: title
 *        description: title
 *      - in : query
 *        name: sort
 *        description: you can sort by title or createdAt or updatedAt or anythings that you want
 *      - in : query
 *        name: fields
 *        description: you can select fields that you want to show
 *      - in : query
 *     responses:
 *           '200':
 *             description: A successful response
 *           '500':
 *             description: Internal server error
 *           '401':
 *             description: Unauthorized
 *           '400':
 *             description: Bad request
 * 
 */

router.get('/get-all-reports', authorization("admin", "superAdmin", "student"), reportController.getAllReports);

module.exports = router;