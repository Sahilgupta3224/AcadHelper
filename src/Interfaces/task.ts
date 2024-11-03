import mongoose from "mongoose";

interface Task {
    _id: mongoose.Types.ObjectId;
    title: string;
    completed: boolean;
    color?: string;
    course?: string;
    dueDate?: Date;
}