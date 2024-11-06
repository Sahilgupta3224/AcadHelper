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
        const updatedcourse = await Course.findByIdAndUpdate(courseId,{$push:{Admins:userId}},{new:true});
        const updateduser = await User.findByIdAndUpdate(userId,{$push:{CoursesAsAdmin:courseId}},{new:true});
        return NextResponse.json({ message: "admin made successfully"}, { status: 200 });
    } catch (error: any) {
        console.error("Error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}