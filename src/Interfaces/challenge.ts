import { Types } from "mongoose";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  challengeDoc?: string;
  type: "individual" | "team";
  frequency: "daily" | "weekly";
  startDate: Date;
  endDate: Date;
  points: number;
  createdBy: Types.ObjectId;
  courseId: Types.ObjectId; 
  submissions?: Types.ObjectId[];
}

export default Challenge;
