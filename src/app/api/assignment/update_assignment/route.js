import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user"; // Assuming User model is defined
import Assignment from "@/models/assignment";
import { NextResponse } from "next/server";


//updating the assignment details as per the changes made
export async function POST(request: Request) {
    try {
        await connect();

        // Parse the request data
        const {
            title,
            description,
            AssignmentDoc,
            dueDate,
            totalPoints,
            status,
            userId,
            assignmentId
        } = await request.json();

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User does not exist" }, { status: 404 });
        }

        // Check if the user is an admin
        if (!user.isAdmin) {
            return NextResponse.json({ message: "User not authorized to update the assignment properties" }, { status: 403 });
        }

        // Find the assignment by ID
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }

        // Update the assignment properties
        if (title) assignment.title = title;
        if (description) assignment.description = description;
        if (AssignmentDoc) assignment.AssignmentDoc = AssignmentDoc;
        if (dueDate) assignment.DueDate = new Date(dueDate);
        if (totalPoints) assignment.totalPoints = totalPoints;
        if (status) assignment.status = status;
        

        // Save the updated assignment to the database
        await assignment.save();

        return NextResponse.json({ message: "Assignment updated successfully", assignment }, { status: 200 });

    } catch (error) {
        console.error("Error while updating the Assignment:", error);
        return NextResponse.json({ message: "An error occurred while updating the assignment" }, { status: 500 });
    }
}


