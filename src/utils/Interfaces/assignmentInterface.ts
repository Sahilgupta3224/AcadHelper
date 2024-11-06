import { Types } from "mongoose";

interface Assignment {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  uploadedAt: Date;
  DueDate?: Date;
  AssignmentDoc: string;
  Course: Types.ObjectId;
  totalPoints: number;
  status: "Open" | "Closed" | "Graded";
  submissions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export default Assignment;
