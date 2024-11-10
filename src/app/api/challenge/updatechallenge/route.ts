import { connect } from "@/dbConfig/dbConfig";
import Assignment from "@/models/assignmentModel";
import Course from "@/models/courseModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

// update challenge
export async function PATCH(request: Request) {
    try {
        await connect();
        const reqbody = await request.json();
        const { id, title, description, startDate, endDate, challengeDoc, type, frequency, points,} = reqbody;

        if (!id) {
            return NextResponse.json({ message: "Assignment ID is required" }, { status: 400 });
        }
        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }

        const updatedAssignment = await Assignment.findByIdAndUpdate(
            id,
            {
                title,
                description,
                startDate,
                endDate,
                challengeDoc,
                type,
                frequency,
                points
            },
            { new: true }
        );

        return NextResponse.json({ message: "Assignment updated successfully", assignment: updatedAssignment }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating assignment:", error);
        return NextResponse.json({ message: "An error occurred while updating the assignment." }, { status: 500 });
    }
}
