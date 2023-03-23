const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");
const Category = require("../../models/category.model");

// validator
const addCategoryValidators = [
    check("name")
        .isLength({ min: 1 })
        .withMessage("Name is required.!")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Name must not contain anything other than alphabet.!")
        .trim(),


];

const addCategoryValidatorHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        // response the error
        if (req.file) {
            unlink(path.join(__dirname, `../../public/uploads/${req.file.filename}`), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        res.status(500).json({
            success: false,
            errors: mappedErrors,
            data: req.body
        });
    }
}

module.exports = {
    addCategoryValidators,
    addCategoryValidatorHandler
};
