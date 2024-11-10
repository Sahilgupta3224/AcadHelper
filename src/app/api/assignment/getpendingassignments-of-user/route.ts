import Challenge from "@/models/challengeModel";
import User from "@/models/userModel";
import Course from "@/models/courseModel";
import Assignment from "@/models/assignmentModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";

connect()

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const user = await User.findById(userId)
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }
        const assignments = await Assignment.find({ _id: { $in: user.pendingAssignments } });      //finding assignments which is in user's pending assignments array
        return NextResponse.json({
            success: true,
            data: assignments,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch assignments.",
            error: error.message,
        }, { status: 500 });
    }
}