import { connect } from "@/dbConfig/dbConfig";
import Assignment from "@/models/assignmentModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PATCH(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("Id");

        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return NextResponse.json(
                { success: false, message: "assignment not found" },
                { status: 404 }
            );
        }

        const reqbody = await request.json();
        const {
            title,
            description,
            AssignmentDoc,
            DueDate,
            totalPoints,
            status,
        } = reqbody;

        if (
            !title ||
            !AssignmentDoc ||
            !description ||
            !status ||
            !DueDate ||
            !totalPoints
        ) {
            return NextResponse.json(
                { message: "required fields are empty" },
                { status: 400 }
            );
        }

        const newAssignment = await Assignment.findByIdAndUpdate(
            id,
            {
                title,
                description,
                AssignmentDoc,
                DueDate,
                totalPoints,
                status,
            },
            { new: true }
        );

        if (!newAssignment) {
            return NextResponse.json(
                { message: "Assignment not found" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Assignment Edited successfully",
            data: newAssignment,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to edit assignment",
                error: error.message,
            },
            { status: 500 }
        );
    }
}