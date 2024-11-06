import Challenge from "@/models/challengeModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from '@/dbConfig/dbConfig'

connect()

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const Id = url.searchParams.get('Id');
        const user = await User.findById(Id);
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        console.error("Error fetching User:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch user.",
            error: error.message,
        }, { status: 500 });
    }
}