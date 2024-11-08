import { NextRequest, NextResponse } from "next/server";
import Submission from "@/models/submissionModel";
import { connect } from '@/dbConfig/dbConfig';

connect();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const assignmentId = url.searchParams.get('assignmentId');
        const userId=url.searchParams.get('userId')
        if (!assignmentId) {
            return NextResponse.json({
                success: false,
                message: "assignment ID is required",
            }, { status: 400 });
        }
        const submissions = await Submission.find({ Assignment: assignmentId });
        return NextResponse.json({
            success: true,
            data: submissions,
        });
    } catch (error: any) {
        console.error("Error fetching submissions:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch submissions",
            error: error.message,
        }, { status: 500 });
    }
}
