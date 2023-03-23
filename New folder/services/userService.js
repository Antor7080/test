
const User = require("../models/user.model");

exports.findUserByPhoneNumber = async (phoneNumber) => {
    return await User.findOne({ phoneNumber });
};
exports.findUserByIdNumber = async (IdNumber) => {
    return await User.findOne({ IdNumber });
}
exports.signupService = async (userInfo) => {
    const user = await User.create(userInfo);
    return user;
};
exports.deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
}
exports.getUsers = async (filters, queries) => {
    const users = await User.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.fields)
        .sort(queries.sortBy)


    const total = await User.countDocuments(filters)
    const page = Math.ceil(total / queries.limit)
    return { total, page, users };
};
exports.getUserById = async (id) => {
    return await User.findById(id);
};

//find by id and update
exports.updateUser = async (id, data) => {
    return await User.findByIdAndUpdate(
        id,
        data,
        { new: true }
    )
};
exports.bulkUpdateById = async (ids, status) => {
    return await User.updateMany({ _id: ids }, { status: status })
};