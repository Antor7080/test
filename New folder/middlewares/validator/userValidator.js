const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const { findUserByPhoneNumber, findUserByIdNumber } = require("../../services/userService");
const { unlink } = require('fs')
const path = require('path')
const userValidator = [
    check("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long"),
    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    check("confirmPassword")
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                return Promise.reject("Password  does not matched.!");
            }
            return true;
        }),
    check("phoneNumber")
        .notEmpty()
        .withMessage("Phone Number is required")
        .isLength({ min: 11, max: 11 })
        .withMessage("Phone Number must be at least 11 characters long")
        //check bd valid phone number
        .isMobilePhone("bn-BD", { strictMode: false })
        .withMessage("Phone Number is not valid")
        //check unique phone number
        .custom(async (value) => {
            try {
                const isUser = await findUserByPhoneNumber(value);
                if (isUser) {
                    throw createError("Phone Number is already taken");
                }
            } catch (error) {
                throw createError(error.message);
            }
        }),
    check("IdNumber")
        .notEmpty()
        //201015069
        .withMessage("IdNumber is required")
        .custom(async (value) => {
            try {
                const isUser = await findUserByIdNumber(value);
                if (isUser) {
                    throw createError("Id Number is already taken");
                }
            } catch (error) {
                throw createError(error.message);
            }
        }),
    check("idCardImage")
        .custom((logo, { req }) => {
            if (req.files?.idCardImage === undefined) {
                return Promise.reject("Please only submit .jpg, .jpeg & .png format.!");
            }
            return true;
        })
    ,
    check("image")
        .custom((image, { req }) => {
            if (req.files?.image === undefined) {
                return Promise.reject("Please only submit .jpg, .jpeg & .png format.!");
            }
            return true;
        }),

]

const userValidatorHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        //remove all files
        if (req.files) {
            const { image, idCardImage } = req.files;
            if (image) {
                const filename = image[0].filename;

                unlink(
                    path.join(path.dirname(__dirname), `../public/uploads/${filename}`),
                    (err) => {
                        if (err) console.log(err);
                    }
                );
            }
            if (idCardImage) {
                const filename = idCardImage[0].filename;
                unlink(path.join(path.dirname(__dirname), `../public/uploads/${filename}`),
                    (err) => {
                        if (err) console.log(err);
                    });
            }
        }

        // response the error
        res.status(500).json({
            errors: mappedErrors,
            data: req.body

        });
    }
}

module.exports = {
    userValidator,
    userValidatorHandler
};