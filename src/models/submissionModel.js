import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    Assignment:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "assignment",
    },
    Challenge:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "challenge",
    },
    Course:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Course"
    },
    submittedAt:{
        type:Date,
        default: Date.now,
        required:true
    },
    // This is for checking whether the submitted solution is approved or not
    isVerified:{
        type:Boolean,
        default:false
    },
    documentLink: {
        type: String,
        required: true,
    },
    marksObtained: {
        type: Number,
        min: 0,
    },
    feedback: {
        type: String,
        trim: true,
    },
    lateSubmission: {
        type: Boolean,
        default: false,
    },
    gradedAt: {
        type: Date,
    },
    type:{
        type:String
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId
    }
},{timestamps: true})

const Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);

export default Submission;