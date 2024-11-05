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
        const { title, description,startDate,endDate, challengeDoc, type,frequency,points, createdBy,courseId} = reqbody;
        const user=await User.findById(createdBy)
        console.log(title)
        if (!user) {
            return NextResponse.json({ message: "user doesn't exist" }, { status: 403 });
        }

        if (!title || !challengeDoc || !description ||!type ||!frequency ||!startDate||!endDate||!courseId||!createdBy) {
            return NextResponse.json({ message: "required fields are empty" }, { status: 400 });
        }
        const course=await Course.findById(courseId)
        if(!course)
        {
            return NextResponse.json({message:"Course needs to be created first"},{status:400})
        }
        const newChallenge = new Challenge({
            title, description,startDate,endDate, challengeDoc, type,frequency,points, createdBy,courseId
        });
        await newChallenge.save();
        await course.challenges.push(newChallenge._id);
        await course.save();
        return NextResponse.json({ message: "Challenge uploaded successfully.", Challenge: newChallenge }, { status: 201 });
    } catch (error: any) {
        console.error("Error uploading assignment:", error);
        return NextResponse.json({ message: "An error occurred while uploading the assignment." }, { status: 500 });
    }
}


