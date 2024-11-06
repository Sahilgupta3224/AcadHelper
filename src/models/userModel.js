import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
    },
    avatar:{
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    Courses:[{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        },
        color:{
           type: String
        }
    }],
    pendingAssignments:[{
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment"
        },
        dueDate: Date
    }],
    completedAssignments:[{
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment"
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    teams:[{
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    inbox:[{
        type: {
            type: String
        },
        message: {
            type: String
        },
        date: {
            type:Date,
            default: Date.now
        },
        teamId:{
            type:mongoose.Schema.Types.ObjectId
        }
    }],
    Totalpoints:[{
        courseId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },
        points:{
            type:Number,
            default:0
        }
    }],
    challengessolved:[{
        challengeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Challenge"
        },
        solvedAt: {
            type: Date,
            default: Date.now
        }
    }],
    submissions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission"
    }],
    CoursesAsAdmin:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    tasks:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
    phone: String,
    gender: String,
    Branch: String,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    },{timestamps: true})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;