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
    isVerfied: {
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
    pendingInvites:[{
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
        },
        invitedAt: {
            type: Date,
            default: Date.now
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
    phone: String,
    gender: String,
    Address: String,
    Branch: String,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
},{timestamps: true})

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;