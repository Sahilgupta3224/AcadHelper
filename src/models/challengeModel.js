import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['individual', 'team'],
        required: true
    },
    frequency: {
        type: String,
        enum: ['daily','weekly','custom'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    points: {
        type: Number,
        required: true,
        min: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId
    },
    submissions:[{
        file:{type:String},
        userId:{type:mongoose.Schema.Types.ObjectId}
    }]
}, { timestamps: true });

const Challenge = mongoose.models.challenge || mongoose.model("challenge", challengeSchema);

export default Challenge;