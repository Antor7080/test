const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    //multiple images
    images: [{
        type: String,
    }],
    status: {
        type: String,
        default: "open",
        enum: ["open", "closed", "pending",],
    },
    addedBy: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: {
            type: String
        },
        IdNumber: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        gender: {
            type: String
        },
    },
    category: {

        name: {
            type: String
        }
    },
    discrption: {

        type: String,
        required: true,
    },

    r_id: {

        type: Number,
    },
    filesLinks: [{
        type: String,

    }],
    feedbacks: [{
        type: mongoose.Schema.Types.ObjectId,
    }],

    building: {
        type: String,

    },
    floor: {
        type: String,
        default: undefined
    },
    room: {
        type: String,
    },
    deskNumber: {
        type: String,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },

},
    {
        timestamps: true,
    }
);

reportSchema.plugin(require('mongoose-autopopulate'));
reportSchema.plugin(require('mongoose-sequence')(mongoose), {
    id: 'report_seq',
    inc_field: 'r_id'
});


module.exports = mongoose.model("Report", reportSchema);
