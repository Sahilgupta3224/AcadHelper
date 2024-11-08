import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
        title:{type:String},
        completed:{type:Boolean,default:false},
        color:{type:String},
        course:{type:String},
        dueDate:{type:Date}
},{timestamps: true})

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;