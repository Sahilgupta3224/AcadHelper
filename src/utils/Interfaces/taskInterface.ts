import { Types } from "mongoose";

interface Task {
  _id: Types.ObjectId; // Unique identifier for the task
  title?: string; // Title of the task
  description?: string; // Description of the task
  completed: boolean; // Indicates if the task is completed
  color?: string; // Color associated with the task
  course?: string; // Course associated with the task
  progress?: number; // Progress percentage of the task (0-100)
  deadline?: Date; // Deadline for the task
  createdAt: Date; // Timestamp for when the task was created
  updatedAt: Date; // Timestamp for when the task was last updated
}

export default Task;
