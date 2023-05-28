const { addFeedbackService } = require("../services/feedbackService");
const { getReportByIdService } = require("../services/reportService");

const feedbackController = {
  addFeedback: async (req, res) => {
    try {
      const user = res.locals.user;
      const { feedback } = req.body;
      const reportId = req.params.id;
      const report = await getReportByIdService(reportId);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }
      const images = req.files?.map((file) => file.filename);
      console.log(user);
      const by = {
        info: user._id,
        name: user.name,
        images: user.image,
      };
      const info = {
        feedback,
        report: reportId,
        images,
        by,
      };
      const newFeedback = await addFeedbackService(info);
      //store feedback in report
      report.feedbacks.push(newFeedback._id);
      await report.save();
      res.status(201).json({
        success: true,
        message: "Feedback added successfully",
        data: newFeedback,
        report,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};
module.exports = feedbackController;
