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
        const {title, description, DueDate, uploadedAt, AssignmentDoc, CourseId, status, totalPoints } = reqbody;

        if (!title || !AssignmentDoc || !description || !uploadedAt || !DueDate || !totalPoints || !CourseId) {
            return NextResponse.json({ message: "Required fields are empty" }, { status: 400 });
        }

        const course = await Course.findById(CourseId);                                      //checking if this course exists
        if (!course) {
            return NextResponse.json({ message: "Course not found" }, { status: 400 });
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

        const eventPromises = course.StudentsEnrolled.map(async (studentId:string) => {        //saving this assignment to events
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

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error uploading assignment:", error);
        return NextResponse.json({ message: "An error occurred while uploading the assignment.", error: errorMessage }, { status: 500 });
    }
}