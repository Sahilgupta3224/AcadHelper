import Challenge from "@/models/challengeModel";
import User from "@/models/userModel";
import Assignment from "@/models/assignmentModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from '@/dbConfig/dbConfig'

connect()

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const Id = url.searchParams.get('Id');
        const assignment= await Assignment.findById(Id);                   //extracting assignment by id
        if(!assignment){
            return NextResponse.json({
                success: false,
                message: "Assignment not found",
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data: assignment,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch assignment.",
            error: error.message,
        }, { status: 500 });
    }
}