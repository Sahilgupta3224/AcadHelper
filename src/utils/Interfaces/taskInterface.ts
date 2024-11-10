import { Types } from "mongoose";

interface Task {
  _id: Types.ObjectId; // Unique identifier for the task
  title?: string; // Title of the task
  description?: string; // Description of the task
  color?: string; // Color associated with the task
  course?: string; // Course associated with the task
  progress?: number; // Progress percentage of the task (0-100)
  dueDate?: Date; // Deadline for the task
}

export default Task;
