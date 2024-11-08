import { connect } from "@/dbConfig/dbConfig";
import Assignment from "@/models/assignmentModel";
import Event from "@/models/eventModal";
import Course from "@/models/courseModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connect();
        const reqbody = await request.json();
        console.log(reqbody);
        const { userId, title, description, DueDate, uploadedAt, AssignmentDoc, CourseId, status, totalPoints } = reqbody;

        // Validate required fields
        if (!title || !AssignmentDoc || !description || !uploadedAt || !DueDate || !totalPoints || !CourseId) {
            return NextResponse.json({ message: "Required fields are empty" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }

        if (user.isAdmin === false) {
            return NextResponse.json({ message: "User is not authorized to upload the assignment" }, { status: 400 });
        }

 
        const course = await Course.findById(CourseId);
        if (!course) {
            return NextResponse.json({ message: "Course needs to be created first" }, { status: 400 });
        }

        const newAssignment = new Assignment({
            title,
            description,
            DueDate: new Date(DueDate),
            uploadedAt,
            AssignmentDoc,
            Course: CourseId,
            status,
            totalPoints,
        });

        await newAssignment.save();

     
        course.assignments.push(newAssignment._id);
        await course.save();

        const eventPromises = course.StudentsEnrolled.map(async (studentId) => {
            const newEvent = new Event({
                title,
                User: studentId,
                assignmentId: newAssignment._id,
                endDate: DueDate,
            });

            await newEvent.save();

        
            await User.findByIdAndUpdate(studentId, { $push: { events: newEvent._id } });
        });

       
        await Promise.all(eventPromises);

        return NextResponse.json({ message: "Assignment uploaded successfully.", Assignment: newAssignment }, { status: 201 });

    } catch (error: any) {
        console.error("Error uploading assignment:", error);
        return NextResponse.json({ message: "An error occurred while uploading the assignment.", error: error.message }, { status: 500 });
    }
}
