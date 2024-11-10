import Challenge from "@/models/challengeModel";
import User from "@/models/userModel";
import Course from "@/models/courseModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";

connect()
// get challenges of a course
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const CourseId = url.searchParams.get('CourseId');
        if(!CourseId){
            return NextResponse.json({
                success: false,
                message: "Invalid Id",
            }, { status: 400 });
        }
        const course = await Course.findById(CourseId)
        if(!course){
            return NextResponse.json({
                success: false,
                message: "Course not found",
            }, { status: 404 });
        }
        if(course.challenges.length==0){
            return NextResponse.json({
                success: true,
                data:[],
                message: "No challenges",
            });
        }
        const challenges = await Challenge.find({ _id: { $in: course.challenges } });
        return NextResponse.json({
            success: true,
            data: challenges,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch challenges.",
            error: error.message,
        }, { status: 500 });
    }
}