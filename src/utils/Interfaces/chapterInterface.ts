import { Types } from "mongoose";

interface Chapter {
  _id: Types.ObjectId; // Unique identifier for the chapter
  name: string; // Name of the chapter
  assignments: Types.ObjectId[]; // Array of assignment IDs associated with the chapter
  courseId: Types.ObjectId; // ID of the course the chapter belongs to
  createdAt: Date; // Timestamp for when the chapter was created
  updatedAt: Date; // Timestamp for when the chapter was last updated
}

export default Chapter;
