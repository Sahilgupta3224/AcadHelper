import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Course from '@/models/courseModel'
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const adminId = searchParams.get("adminId");
        const courseId = searchParams.get("courseId");
        if(!userId || !adminId || !courseId){
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Error creating course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}