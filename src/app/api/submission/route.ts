import Challenge from "@/models/challengeModel";
import User from "@/models/userModel";
import Submission from "@/models/submissionModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from '@/dbConfig/dbConfig'

connect()

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { User, Assignment, Challenge, documentLink } = data;
        if (!User || !documentLink) {
            return NextResponse.json({
                success: false,
                message: "User and documentLink are required.",
            }, { status: 400 });
        }

        const newSubmission = new Submission({
            User,
            Assignment,
            Challenge,
            documentLink,
            submittedAt: new Date(),
        });
        await newSubmission.save();

        return NextResponse.json({
            success: true,
            data: newSubmission,
            message: "Submission added successfully.",
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error adding submission:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to add submission.",
            error: error.message,
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const Id = url.searchParams.get('Id');
        console.log("urlll",url)
        const sub = await Submission.findById(Id);
        if(!sub){
            return NextResponse.json({
                success: false,
                message: "Submission not found",
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data: sub,
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