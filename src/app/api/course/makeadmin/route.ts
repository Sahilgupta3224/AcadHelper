import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Course from '@/models/courseModel'
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()
export async function POST(request: NextRequest) {
    try {
        const {userId,adminId,courseId} = await request.json();
        if(!userId || !adminId || !courseId){
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }
        const course = await Course.findById(courseId);
        const user = await User.findById(userId);
        if (!course) {
            return NextResponse.json({ error: "Invalid course" }, { status: 400 });
        }
        if (!user) {
            return NextResponse.json({ error: "Invalid user" }, { status: 400 });
        }
        const isEnrolled = course.StudentsEnrolled.includes(userId);
        if (isEnrolled) {
            await Course.findByIdAndUpdate(courseId, { $pull: { StudentsEnrolled: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { Courses:  { courseId: courseId }  } });
        }
        const updatedcourse = await Course.findByIdAndUpdate(courseId,{$push:{Admins:userId}},{new:true});
        if(!updatedcourse){
            return NextResponse.json({ error: "Invalid course" }, { status: 400 });
        }
        const updateduser = await User.findByIdAndUpdate(userId,{$push:{CoursesAsAdmin:courseId}},{new:true});
        if(!updateduser){
            return NextResponse.json({ error: "Invalid user" }, { status: 400 });
        }
        return NextResponse.json({ message: "admin made successfully"}, { status: 200 });
    } catch (error: any) {
        console.error("Error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}