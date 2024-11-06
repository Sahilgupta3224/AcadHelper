import { connect } from "@/dbConfig/dbConfig";
import Assignment from "@/models/assignmentModel";
import Challenge from "@/models/challengeModel";
import Chapter from "@/models/chapterModel";
import Course from "@/models/courseModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connect();
        const reqbody = await request.json();
        console.log(reqbody)
        const { title,description,DueDate,uploadedAt,AssignmentDoc,CourseId,status,totalPoints} = reqbody;

        if (!title || !AssignmentDoc || !description ||!uploadedAt ||!status ||!DueDate||!totalPoints||!CourseId) {
            return NextResponse.json({ message: "required fields are empty" }, { status: 400 });
        }
        const course=await Course.findById(CourseId)
        if(!course)
        {
            return NextResponse.json({message:"Course needs to be created first"},{status:400})
        }
        const newAssignment = new Assignment({
            title,description,DueDate,uploadedAt,AssignmentDoc,CourseId,status,totalPoints
        });
        await newAssignment.save();
        await course.assignments.push(newAssignment._id);
        await course.save();
        return NextResponse.json({ message: "Challenge uploaded successfully.", Assignment: newAssignment }, { status: 201 });
    } catch (error: any) {
        console.error("Error uploading assignment:", error);
        return NextResponse.json({ message: "An error occurred while uploading the assignment." }, { status: 500 });
    }
}


