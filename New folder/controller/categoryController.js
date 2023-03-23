const { getAllCategory, addCategory, findCategoryById, updateCaregory } = require("../services/categoryService");
const { unlinkSync } = require("fs");
const { filterOption } = require("../util/filterOption");


const categoryController = {
    addNewCategory: async (req, res) => {
        try {
            const image = req.file ? req.file.filename : '';
            const categoryInfo = {
                ...req.body,
                image,
                addedBy: {
                    user: req.userId,
                    name: req.name,
                },
            }
            const newCategory = await addCategory(categoryInfo);
            await newCategory.save();
            res.status(200).json({
                message: "Category added successfully",
                success: true,
                data: newCategory,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    getAllCategories: async (req, res) => {
        try {
            const { queries, filters } = filterOption(req);
            const { total, page, categories } = await getAllCategory(filters, queries);
            res.status(200).json({
                success: true,
                message: "All categories",
                data: categories,
                total,
                page,

            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,

            });
        }

    },

    getSingleCategory: async (req, res) => {
        const id = req.params.id;
        try {
            const category = await findCategoryById(id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                })
            }
            res.status(200).json({
                success: true,
                message: "Category found",
                data: category,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    },

    deleteCategory: async (req, res) => {
        const id = req.params.id;
        try {
            const category = await findCategoryById(id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                })
            }
            await category.remove();
            res.status(200).json({
                success: true,
                message: "Category deleted successfully",
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    },

    updateCaregory: async (req, res) => {
        const id = req.params.id;
        try {
            const category = await findCategoryById(id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                })
            }
            const image = req.file?.filename ? req.file.filename : category.image;
            const categoryInfo = {
                ...req.body,
                image,
            };
            const result = await updateCaregory(id, categoryInfo);
            if (result) {
                if (req.file) {
                    unlinkSync(`./public/uploads/${category.image}`)
                }
            }
            res.status(200).json({
                success: true,
                message: "Category updated successfully",
                data: result,
            })
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    },
}

module.exports = categoryController;

