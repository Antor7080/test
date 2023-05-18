const Feedback = require("../models/feedback.model");

exports.addFeedbackService = async (feedbackInfo) => {
    const newFeedback = await Feedback.create(feedbackInfo);
    return newFeedback;
};

exports.getFeedbackByIdService = async (id) => {
    const feedback = await Feedback.findById(id);
    return feedback;
};

exports.findFeedback = async (data) => {
    const feedback = await Feedback.find(data);
    return feedback;
};
exports.findallFeedback = async (queries, filters) => {
    const feedback = await Feedback.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.fields)
        .sort(queries.sortBy)
    const total = await Feedback.countDocuments(filters)
    const page = Math.ceil(total / queries.limit)
    return { total, page, feedback };
};

exports.deleteFeedback = async (id) => {
    return await Feedback.findByIdAndDelete(id);
};