import { connect } from "@/dbConfig/dbConfig";
import Assignment from "@/models/assignmentModel";
import Challenge from "@/models/challengeModel";
import Chapter from "@/models/chapterModel";
import Course from "@/models/courseModel";
import Event from "@/models/eventModal";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connect();
        const reqbody = await request.json();
        console.log(reqbody);

        const { title, description, startDate, endDate, challengeDoc, type, frequency, points, createdBy, courseId } = reqbody;

        // Validate if the creator exists
        const user = await User.findById(createdBy);
        if (!user) {
            return NextResponse.json({ message: "User doesn't exist" }, { status: 403 });
        }

        // Validate required fields
        if (!title || !challengeDoc || !description || !type || !frequency || !startDate || !courseId || !createdBy) {
            return NextResponse.json({ message: "Required fields are empty" }, { status: 400 });
        }

        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ message: "Course needs to be created first" }, { status: 400 });
        }

        // Create the new challenge
        const newChallenge = new Challenge({
            title,
            description,
            startDate,
            endDate,
            challengeDoc,
            type,
            frequency,
            points,
            createdBy,
            courseId,
        });
        await newChallenge.save();

        // Create an event for each user in the platform
        const users = await User.find(); 
        const eventPromises = course.StudentsEnrolled.map(async (studentId:any) => {
            const newEvent = new Event({
                title,
                User: studentId,
                challengeId: newChallenge._id,
                endDate
            });
            await newEvent.save();        
            await User.findByIdAndUpdate(studentId, { $push: { events: newEvent._id } });
        });
        await Promise.all(eventPromises);
        course.challenges.push(newChallenge._id);
        await course.save();
        return NextResponse.json({ message: "Challenge uploaded successfully.", Challenge: newChallenge }, { status: 201 });

    } catch (error: any) {
        console.error("Error uploading challenge:", error);
        return NextResponse.json({ message: "An error occurred while uploading the challenge.",error:error.message }, { status: 500 });
    }
}
