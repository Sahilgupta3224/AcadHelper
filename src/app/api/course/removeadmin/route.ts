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
        const updatedcourse = await Course.findByIdAndUpdate(courseId,{$pull:{Admins:userId}},{new:true});
        if(!updatedcourse){
            return NextResponse.json({ error: "Invalid course" }, { status: 400 });
        }
        const updateduser = await User.findByIdAndUpdate(userId,{$pull:{CoursesAsAdmin:courseId}},{new:true});
        if(!updateduser){
            return NextResponse.json({ error: "Invalid user" }, { status: 400 });
        }
        return NextResponse.json({ message: "admin removed successfully"}, { status: 200 });
    } catch (error: any) {
        console.error("Error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}