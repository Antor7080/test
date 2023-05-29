const { find } = require('../models/feedback.model');
const Report = require('../models/report.model');
exports.addReportService = async (reportInfo) => {
    const newReport = await Report.create(reportInfo);
    return newReport;

};
exports.getReportByIdService = async (id) => {
    const report = await Report.findById(id);
    return report;
};

exports.findReport = async (data) => {
    const report = await Report.find(data);
    return report;
};
exports.findallReport = async (queries, filters) => {
    const report = await Report.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.fields)
        .sort(queries.sortBy)
    const total = await Report.countDocuments(filters)
    const page = Math.ceil(total / queries.limit)
    return { total, page, report };
};

exports.addComment = async (id, comment) => {
    // id: 5f9b2b9b9d9b7b2a3c9b3b2a
    // comment: { comment: 'hello' }
    return Report.updateOne(
        { _id: id },
        { $push: { comments: { $each: [comment], $position: 0 } } },
        { new: true }
    );
}
exports.ChangeStatus = async (id, status) => {
    return Report.findByIdAndUpdate(id, { status: status }, { new: true });
}