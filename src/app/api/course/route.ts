import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Course from '@/models/courseModel'
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()
//create course
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { name, description, userId, CourseCode } = reqBody;
        console.log(reqBody);
        const newCourse = new Course({
            name,
            description,
            CourseCode,
            Admins: [userId],
        });
        const newuser = await User.findByIdAndUpdate(userId,{$push:{CoursesAsAdmin: newCourse._id}},{new:true});
        await newCourse.save();
        return NextResponse.json({ message: "Course created successfully", course: newCourse }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
// delete course
export async function DELETE(request:NextRequest){
    try{
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get("Id");
        if (!courseId) {
        return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }
        await Course.findByIdAndDelete(courseId);
        // i need to pull pending assignments of that courses from all users too

        return NextResponse.json({ message: "Course and related data deleted successfully" }, { status: 200 });
    }
    catch(error: any){
        console.error("Error creating course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

//make admin,add chapters,delete chapters,kick user, make announcements,remove admin,get all students of a course