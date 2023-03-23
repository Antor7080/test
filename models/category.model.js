const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive"],
    },
    discription: {

        type: String,
    },
    addedBy: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: { type: String }
    },
    c_id: {
        type: Number,
    },
},
    {
        timestamps: true,
    }
);

categorySchema.plugin(require('mongoose-autopopulate'));
categorySchema.plugin(require('mongoose-sequence')(mongoose), {
    id: 'category_seq',
    inc_field: 'c_id'
});


module.exports = mongoose.model("Category", categorySchema);
