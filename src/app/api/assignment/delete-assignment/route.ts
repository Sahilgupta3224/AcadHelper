import { connect } from "@/dbConfig/dbConfig";
import Assignment from "@/models/assignmentModel";
import Chapter from "@/models/chapterModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

// delete the assignment 
export async function DELETE(request: Request) {
    try {
        await connect();

        const { assignmentId, userId, chapterId } = await request.json();

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User does not exist" }, { status: 404 });
        }

        // Check if the user is an admin
        if (!user.isAdmin) {
            return NextResponse.json({ message: "User not authorized to delete the assignment" }, { status: 403 });
        }

        // Find the chapter by ID
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return NextResponse.json({ message: "Chapter not found. Assignment cannot be deleted without a valid chapter." }, { status: 404 });
        }

        // Find and delete the assignment by ID
        const assignment = await Assignment.findByIdAndDelete(assignmentId);
        if (!assignment) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }

        // Remove the assignment reference from the chapter's assignments array
        chapter.assignments = chapter.assignments.filter(assign => assign.toString() !== assignmentId);
        await chapter.save();

        // Update all users by removing the assignment from their pendingAssignments and completedAssignments
        await User.updateMany(
            { 
                $or: [
                    { "pendingAssignments.assignmentId": assignmentId },
                    { "completedAssignments.assignmentId": assignmentId }
                ] 
            },
            {
                $pull: {
                    pendingAssignments: { assignmentId },
                    completedAssignments: { assignmentId }
                }
            }
        );

        return NextResponse.json({ message: "Assignment deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error while deleting the assignment:", error);
        return NextResponse.json({ message: "An error occurred while deleting the assignment" }, { status: 500 });
    }
}
