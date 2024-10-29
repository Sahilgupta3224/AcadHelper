import mongoose, { Mongoose } from "mongoose";

const chapterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    assignments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment"
        
    }],
    courseId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }
},{timestamps: true})

const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);

export default Chapter;