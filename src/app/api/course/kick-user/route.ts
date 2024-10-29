import { Types } from 'mongoose'; 
import { NextResponse } from 'next/server';
import Course from '@/models/courseModel';
import User from '@/models/userModel';
import { connect } from '@/dbConfig/dbConfig';
connect()

export const DELETE = async (request: Request) => {
    try {
        const { userId, courseId } = await request.json();
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
            { $pull: { Courses: { courseId: new Types.ObjectId(courseId) } } },
            { new: true }
        );
        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found." }),
                { status: 404 }
            );
        }
        requiredCourse.StudentsEnrolled = requiredCourse.StudentsEnrolled.filter((student:any) => !student.equals(userId));
        const updatedCourse=await requiredCourse.save();
        return new NextResponse(JSON.stringify({ message: "User removed from course successfully.",updatedCourse}), { status: 200 });
    } catch (error: any) {
        console.log("Error while kicking out the user:", error);
        return new NextResponse(JSON.stringify({ message: "Error while kicking out the user", error: error.message }), { status: 500 });
    }
};
