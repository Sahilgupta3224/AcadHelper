import Challenge from "@/models/challengeModel";
import Course from "@/models/courseModel";
import Assignment from "@/models/assignmentModel";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModal";

export async function DELETE(request: NextRequest) {
    try {
        await connect();

        const url = new URL(request.url);
        const id = url.searchParams.get('Id');
        const userId = url.searchParams.get("userId");

        if (!id || !userId) {
            return NextResponse.json({ message: "Assignment ID and User ID are required" }, { status: 400 });
        }

        // Check if the user is an admin before proceeding
        const checkUser = await User.findById(userId);
        if (!checkUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        if (!checkUser.isAdmin) {
            return NextResponse.json({ message: "No access. User is not authorized" }, { status: 403 });
        }

        // Find and delete the assignment
        const deletedAssignment = await Assignment.findByIdAndDelete(id);
        if (!deletedAssignment) {
            return NextResponse.json({ success: false, message: "Assignment not found" }, { status: 404 });
        }

        // Update the course to remove the assignment
        const course = await Course.findByIdAndUpdate(
            deletedAssignment.Course,
            { $pull: { assignments: deletedAssignment._id } },
            { new: true }
        );
        if (!course) {
            console.warn("Course not found or assignment not removed from course");
        } else {
            console.log("Updated course:", course);
        }

        // Delete the events associated with the assignment
        const deletedEvents = await Event.deleteMany({ assignmentId: deletedAssignment._id });
        console.log("Deleted events count:", deletedEvents.deletedCount);

        // Update all users who had events related to this assignment
        const affectedUsers = await User.updateMany(
            { "events.assignmentId": deletedAssignment._id },
            { $pull: { events: { assignmentId: deletedAssignment._id } } }
        );

        return NextResponse.json({
            success: true,
            message: "Assignment deleted successfully",
            data: deletedAssignment,
            course,
            affectedUsers
        });
    } catch (error: any) {
        console.error("Error deleting assignment:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to delete Assignment",
            error: error.message,
        }, { status: 500 });
    }
}
