import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    chapters:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter"
        
    }],
    Admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    CourseCode: {
        type: String,
        unique: true,
        required: true,
    },
    Announcements: [{
        title: String,
        message: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        postedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    StudentsEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    challenges:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "challenge"
    }]
},{timestamps: true})

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;