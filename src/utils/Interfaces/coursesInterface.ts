import { Types } from "mongoose";

interface Announcement {
  title: string;
  message: string;
  postedBy: Types.ObjectId;
  postedAt: Date;
}

interface Course {
  _id: Types.ObjectId;
  name: string;
  description: string;
  chapters: Types.ObjectId[]; // Array of Chapter IDs
  Admins: Types.ObjectId[]; // Array of Admin User IDs
  CourseCode: string;
  Announcements: Announcement[];
  StudentsEnrolled: Types.ObjectId[]; // Array of Student User IDs
  createdAt: Date;
  updatedAt: Date;
}

export default Course;
