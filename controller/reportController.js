const { addReportService, getReportByIdService, findReport, findallReport, addComment } = require("../services/reportService");
const { filterOption } = require("../util/filterOption");

const reportController = {
    addReport: async (req, res) => {
        try {
            const { title, description, category } = req.body;
            if (!title || !description || !category) {
                return res.status(400).json({
                    success: false,
                    message: "Please fill all required fields",
                })
            }
            const images = req.files?.image?.map((file) => file.filename);
            const addedBy = {
                user: req.userId,
                name: req.name,
                IdNumber: req.IdNumber,
                phoneNumber: req.phoneNumber,
                gender: req.gender

            }
            const reportInfo = {
                ...req.body,
                images,
                addedBy,
            };
            const newReport = await addReportService(reportInfo)

            res.status(200).json({
                success: true,
                message: "Category updated successfully",
                data: newReport,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            })
        }
    },

    getReportById: async (req, res) => {
        try {
            const { id } = req.params;
            const report = await getReportByIdService(id);
            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: "Report not found",
                })
            }
            res.status(200).json({
                success: true,
                message: "Report found",
                data: report,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            })
        }
    },

    getSingleUserReports: async (req, res) => {
        try {
            const { id } = req.params;
            const report = await findReport({ "addedBy.user": id });
            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: "Report not found",
                })
            }
            res.status(200).json({
                success: true,
                message: "Report found",
                data: report,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            })
        }
    },
    getAllReports: async (req, res) => {
        try {
            const { queries, filters } = filterOption(req);
            const { report, page, total } = await findallReport(queries, filters);
            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: "Report not found",
                })
            }
            res.status(200).json({
                success: true,
                message: "Report found",
                data: report,
                page,
                total

            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            })
        }
    },
    addComment:async (req, res)=>{
        try {
            const { id } = req.params;
            const user = res.locals.user;
            const { comment, isAnonymous} = req.body;
              const report = await getReportByIdService(id);
            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: "Report not found",
                })
            }
            const newComment = {
                comment,
                _id: user._id,
                commented_by: isAnonymous? "anonymous user": user.name,
                commenter_image: isAnonymous? "": user.image,
            }
          const addComments = await addComment(id, newComment);
          console.log({addComments});
            res.status(200).json({
                success: true,
                message: "Comment added successfully",
                data: addComments,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            })
        }
    }

};

module.exports = reportController;