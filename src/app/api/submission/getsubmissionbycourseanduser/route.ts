import { NextRequest, NextResponse } from "next/server";
import Submission from "@/models/submissionModel";
import { connect } from '@/dbConfig/dbConfig';

connect();

// get all submissions of a course for a user
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const CourseId= url.searchParams.get('CourseId');
        const userId=url.searchParams.get('userId')
        if (!CourseId) {
            return NextResponse.json({
                success: false,
                message: "CourseId is required",
            }, { status: 400 });
        }
        const submissions = await Submission.find({ Course:CourseId });
        return NextResponse.json({
            success: true,
            data: submissions,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch submissions",
            error: error.message,
        }, { status: 500 });
    }
}
