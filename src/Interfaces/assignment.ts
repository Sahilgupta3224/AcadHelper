import { Types } from "mongoose";

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  uploadedAt: Date;
  DueDate?: Date;
  AssignmentDoc: string;
  Course?: Types.ObjectId;
  totalPoints: number;
  status: "Open" | "Closed" | "Graded";
  submissions?: Types.ObjectId[];
}

export default Assignment;
