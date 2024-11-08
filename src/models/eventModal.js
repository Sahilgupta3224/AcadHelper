import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "assignment"
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    },
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "challenge"
    },
    endDate: {
        type: Date,
        default: Date.now 
    }
}, { timestamps: true });

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
