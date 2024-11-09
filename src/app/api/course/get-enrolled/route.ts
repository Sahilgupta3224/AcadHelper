import { NextResponse } from 'next/server';
import Course from '@/models/courseModel';
import User from '@/models/userModel';
import { connect } from '@/dbConfig/dbConfig';

export async function GET(request: Request) {
  try {
   
    await connect();

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ message: "The course doesn't exist" }, { status: 404 });
    }
    
    const userIds = course.StudentsEnrolled;

    const users = await Promise.all(userIds.map(id => User.findById(id)));

    const enrolledUsers = users.filter(user => user !== null);

    return NextResponse.json({
      message: "Users enrolled in the course fetched successfully",
      users: enrolledUsers
    }, { status: 200 });

  } catch (error:any) {
    console.log("Error while fetching all the users enrolled:", error);
    return NextResponse.json({
      message: "Error while fetching the users enrolled in the course",
      error: error.message
    }, { status: 500 });
  }
}
