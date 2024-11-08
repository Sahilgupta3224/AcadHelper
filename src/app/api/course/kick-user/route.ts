import { Types } from 'mongoose';
import { NextResponse } from 'next/server';
import Course from '@/models/courseModel';
import User from '@/models/userModel';
import Assignment from '@/models/assignmentModel';
import { connect } from '@/dbConfig/dbConfig';
connect();

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    if (!userId || !courseId) {
      return new NextResponse(JSON.stringify({ message: "Enter all necessary credentials" }), { status: 400 });
    }

    const requiredCourse = await Course.findById(courseId);
    if (!requiredCourse) {
      return new NextResponse(JSON.stringify({ message: "Course not found." }), { status: 404 });
    }

    const isEnrolled = requiredCourse.StudentsEnrolled.includes(userId);
    if (!isEnrolled) {
      return new NextResponse(JSON.stringify({ message: "User is not enrolled in this course." }), { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { Courses: { courseId: courseId } } },
      { new: true }
    );
    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found." }),
        { status: 404 }
      );
    }
    requiredCourse.StudentsEnrolled = requiredCourse.StudentsEnrolled.filter(
      (student: any) => !student.equals(userId)
    );
    const assignments = await Assignment.find({ Course: courseId });
    const assignmentIds = assignments.map(assignment => assignment._id);
    const updatedUserWithAssignments = await User.findByIdAndUpdate(
      userId,
      { $pull: { pendingAssignments: { assignmentId: { $in: assignmentIds } } } },
      { new: true }
    );
    if (!updatedUserWithAssignments) return NextResponse.json({ error: "User not found" }, { status: 400 });
    const updatedCourse = await requiredCourse.save();

    return new NextResponse(JSON.stringify({ message: "User removed from course successfully.", updatedCourse }), { status: 200 });
  } catch (error: any) {
    console.log("Error while kicking out the user:", error);
    return new NextResponse(JSON.stringify({ message: "Error while kicking out the user", error: error.message }), { status: 500 });
  }
};