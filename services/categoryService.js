const Category = require('../models/category.model');

exports.addCategory = async (categoryInfo) => {
    const category = await new Category(categoryInfo);
    return category;
};
exports.getAllCategory = async (filters, queries) => {
    const categories = await Category.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.fields)
        .sort(queries.sortBy)
        .populate('addedBy', 'name')
    const total = await Category.countDocuments(filters)
    const page = Math.ceil(total / queries.limit)
    return { total, page, categories };
};

exports.findCategoryById = async (id) => {
    return await Category.findById(id)
};

exports.updateCaregory = async (id, categoryInfo) => {
    return await Category.findByIdAndUpdate(id, categoryInfo, { new: true })
};