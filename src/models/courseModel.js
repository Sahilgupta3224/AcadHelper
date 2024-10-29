import mongoose, { Mongoose } from "mongoose";

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
    Assignments:[{
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment"
        },
        dueDate: Date
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
},{timestamps: true})

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;