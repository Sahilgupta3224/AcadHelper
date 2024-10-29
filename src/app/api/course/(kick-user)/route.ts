import { Types } from 'mongoose'; 
import { NextResponse } from 'next/server';
import Course from '@/models/courseModel';
import { connect } from '@/dbConfig/dbConfig';

export const DELETE = async (request: Request) => {
    try {
        const { userId, courseId } = await request.json();

        await connect() 

        // Validate input
        if (!userId || !courseId) {
            return new NextResponse(JSON.stringify({ message: "Enter all necessary credentials" }), { status: 400 });
        }

        // Verify the IDs are valid
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(courseId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid Course/User ID." }), { status: 400 });
        }

        // Get the course
        const requiredCourse = await Course.findById(courseId);
        if (!requiredCourse) {
            return new NextResponse(JSON.stringify({ message: "Course not found." }), { status: 404 });
        }

        // Check if user is enrolled
        const isEnrolled = requiredCourse.StudentsEnrolled.includes(userId);
        if (!isEnrolled) {
            return new NextResponse(JSON.stringify({ message: "User is not enrolled in this course." }), { status: 400 });
        }

        // Remove the user from the StudentsEnrolled array

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requiredCourse.StudentsEnrolled = requiredCourse.StudentsEnrolled.filter((student:any) => !student.equals(userId));
        
      
        const updatedUser=await requiredCourse.save();

        return new NextResponse(JSON.stringify({ message: "User removed from course successfully.",updatedUser }), { status: 200 });
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log("Error while kicking out the user:", error);
        return new NextResponse(JSON.stringify({ message: "Error while kicking out the user", error: error.message }), { status: 500 });
    }
};
