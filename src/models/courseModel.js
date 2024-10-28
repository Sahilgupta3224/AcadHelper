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
    instructors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    StudentsEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
},{timestamps: true})

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;