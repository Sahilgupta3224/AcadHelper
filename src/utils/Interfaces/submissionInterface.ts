import { Types } from "mongoose";

interface Submission {
  _id: Types.ObjectId;
  User: Types.ObjectId;
  Assignment: Types.ObjectId;
  submittedAt: Date;
  isVerified: boolean;
  documentLink: string;
  marksObtained?: number;
  feedback?: string;
  lateSubmission: boolean;
  gradedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default Submission;
