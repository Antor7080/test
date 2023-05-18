const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    feedback: {
        type: String,
    },
    images: [{
        type: String,
    }],
    by: {
        info: {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: {
            type: String
        }
    },
    report: {
        type: mongoose.Schema.Types.ObjectId,
    },
    id: {
        type: Number
    }
}, {
    timestamps: true
});

feedbackSchema.plugin(require('mongoose-autopopulate'));

feedbackSchema.plugin(require('mongoose-sequence')(mongoose), {
    id: "feedback_seq",
    inc_field: "id"
});

module.exports = mongoose.model("Feedback", feedbackSchema);
