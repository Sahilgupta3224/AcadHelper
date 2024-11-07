import Challenge from "@/models/challengeModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from '@/dbConfig/dbConfig'

connect()

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const Id = url.searchParams.get('Id');
        const chal = await Challenge.findById(Id);
        console.log(Id)
        if(!chal){
            return NextResponse.json({
                success: false,
                message: "Challenge not found",
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data: chal,
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