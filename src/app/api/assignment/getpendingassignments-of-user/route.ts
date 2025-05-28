import User from "@/models/userModel";
import Assignment from "@/models/assignmentModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        const assignments = await Assignment.find({ _id: { $in: user.pendingAssignments } });

        return NextResponse.json({
            success: true,
            data: assignments,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json({
            success: false,
            message: "Failed to fetch assignments.",
            error: errorMessage,
        }, { status: 500 });
    }
}