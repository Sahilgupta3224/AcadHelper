import { Types } from "mongoose";

interface Announcement {
  title: string;
  message: string;
  postedBy: Types.ObjectId;
  postedAt: Date;
}

interface Course {
  _id: string;
  name: string;
  description: string;
  chapters?: Types.ObjectId[];
  Admins: Types.ObjectId[];
  CourseCode: string;
  Announcements?: Announcement[];
  StudentsEnrolled?: Types.ObjectId[];
  challenges?: Types.ObjectId[];
}

export default Course;
