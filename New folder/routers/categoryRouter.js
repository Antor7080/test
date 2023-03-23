const router = require('express').Router();
const categoryController = require('../controller/categoryController');
const authorization = require('../middlewares/common/authorization');
const { upload } = require('../middlewares/common/fileUpload');
const { addCategoryValidators,
    addCategoryValidatorHandler } = require('../middlewares/validator/categoryValidator');
router.post("/add-category", authorization("admin", "superAdmin"), upload.single("image"), addCategoryValidators,
    addCategoryValidatorHandler, categoryController.addNewCategory);
    router.get("/get-categories", categoryController.getAllCategories);
    router.get("/get-category/:id", categoryController.getSingleCategory);
    router.delete("/delete-category/:id", authorization("admin", "superAdmin"), categoryController.deleteCategory);
    router.put("/update-category/:id", authorization("admin", "superAdmin"), upload.single("image"), categoryController.updateCaregory);
    
    

module.exports = router