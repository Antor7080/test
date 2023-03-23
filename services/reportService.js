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