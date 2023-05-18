const router = require('express').Router();
const categoryController = require('../controller/categoryController');
const authorization = require('../middlewares/common/authorization');
const { upload } = require('../middlewares/common/fileUpload');
const { addCategoryValidators,
    addCategoryValidatorHandler } = require('../middlewares/validator/categoryValidator');

  /**
 * @swagger
 * /api/category/add-category:
 *   post:
 *     description: Use to add category
 *     parameters:
 *      - name: name
 *        description: name of category
 *        in: formData
 *        required: true
 *        type: string
 *      - name: image
 *        description: image of category
 *        in: formData
 *        required: false
 *        type: file
 *      - name: description
 *        description: description of category
 *        in: formData
 *        type: string
 * 
 *     responses:
 *       201:
 *         description: Created
 *       500:
 *        description: Internal Server Error
 * 
 */

router.post("/add-category", authorization("admin", "superAdmin"), upload.single("image"), addCategoryValidators,
    addCategoryValidatorHandler, categoryController.addNewCategory);

        /**
     * @openapi
     * /api/category/get-categories:
     *  get:
     *   description: Get all categories
     *   parameters:
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
     *       description: sort by name or createdAt or updatedAt or addedBy.name 
     *
     *   responses:
     *          '200':
     *             description: A successful response
     *          '500':
     *             description: Internal server error
     */
    router.get("/get-categories", categoryController.getAllCategories);
   
/**
 * @swagger
 * /api/category/get-category/{id}:
 *   get:
 *     description: Use to get single category
 *     parameters:
    *     - name: id
    *       description: id of category
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 * 
 */
    router.get("/get-category/:id", categoryController.getSingleCategory);

/**
 * @openapi
 * /api/category/delete-category/{id}:
 *      delete:
 *           description: Use to delete category
 *           parameters:
 *             - name: id
 *               description: id of category
 *               in: path
 *               required: true
 *               type: string
 * 
 *           responses:
 *             '200':
 *               description: A successful response
 *             '500':
 *               description: Internal server error
 */
    router.delete("/delete-category/:id", authorization("admin", "superAdmin"), categoryController.deleteCategory);

/**
 * @swagger
 * /api/category/update-category/{id}:
 *  put:
 *       description: Use to update category
 *       parameters:
 *        - name: id
 *          description: id of category
 *          in: path
 *          required: true
 *          type: string
 *        - name: name
 *          description: name of category
 *          in: formData
 *          type: string
 *        - name: image
 *          description: image of category
 *          in: formData
 *          required: false
 *          type: file
 *        - name: description
 *          description: description of category
 *          in: formData
 *          type: string
 *       responses:
 *             '200':
 *               description: A successful response
 *             '500':
 *               description: Internal server error
 */
    router.put("/update-category/:id", authorization("admin", "superAdmin"), upload.single("image"), categoryController.updateCaregory);
    
    

module.exports = router