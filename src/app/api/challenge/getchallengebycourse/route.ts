import Challenge from "@/models/challengeModel";
import User from "@/models/userModel";
import Course from "@/models/courseModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";

connect()

export async function GET(request: NextRequest) {
    // console.log(request.json())
    try {
        const url = new URL(request.url);
        const CourseId = url.searchParams.get('CourseId');
        console.log(CourseId)
        const course = await Course.findById(CourseId)
        if(!course){
            return NextResponse.json({
                success: false,
                message: "Course not found",
            }, { status: 404 });
        }
        const challenges = await Challenge.find({ _id: { $in: course.challenges } });
        return NextResponse.json({
            success: true,
            data: challenges,
        });
    } catch (error: any) {
        console.error("Error fetching challenges:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch challenges.",
            error: error.message,
        }, { status: 500 });
    }
}