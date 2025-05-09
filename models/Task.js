const mongoose = require("mongoose");
const todoShema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
});
const taskShema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
        status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: 'Pending' },
        dueDate: { type: Date, required: true },
        assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        attachments: [{ type: String }],
        todoChecklist: [todoShema],
        progress: { type: Number, default: 0 }
    },
    { timestamps: true } // use to store the date and time that data created in
);
module.exports = mongoose.model("Task", taskShema);