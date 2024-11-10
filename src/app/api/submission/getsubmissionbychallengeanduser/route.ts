import { NextRequest, NextResponse } from "next/server";
import Submission from "@/models/submissionModel";
import { connect } from '@/dbConfig/dbConfig';

connect();

//get all submissions of an challenge for a user
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const challengeId = url.searchParams.get('challengeId');
        const userId = url.searchParams.get('userId')
        if (!challengeId) {
            return NextResponse.json({
                success: false,
                message: "Challenge ID is required",
            }, { status: 400 });
        }
        const submissions = await Submission.find({ Challenge: challengeId , User : userId});
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
