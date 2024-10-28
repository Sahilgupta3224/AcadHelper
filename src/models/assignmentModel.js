import mongoose from "mongoose";
import Link from "next/link";

const assignmentSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        maxlength:100
    },
    description:{
        type: String,
        trim: true,
        maxlength: 500
    },
    uploadedAt:{
        type:Date,
        default: Date.now,
        required:true
    },
    DueDate:{
        type:Date,
    },
    AssignmentDoc:{
        type:String,
        required:true
    },
    Course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    totalPoints:{
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["Open", "Closed", "Graded"],
        default: "Open",
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission",
    }],

},{timestamps: true})

const Assignment = mongoose.models.assignment || mongoose.model("assignment", assignmentSchema);

export default Assignment;