import Challenge from "@/models/challengeModel";
import User from "@/models/userModel";
import Submission from "@/models/submissionModel";
<<<<<<< HEAD
=======
import Assignment from "@/models/assignmentModel";
>>>>>>> f96d12a07e9548ee24a3ed46fc90c8d41bf84151
import { NextRequest, NextResponse } from "next/server";
import {connect} from '@/dbConfig/dbConfig'

connect()

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
<<<<<<< HEAD
        const { User, Assignment, Challenge, documentLink } = data;
        if (!User || !documentLink) {
=======
        const { user, assignment, challenge, documentLink } = data;
        if (!user || !documentLink) {
>>>>>>> f96d12a07e9548ee24a3ed46fc90c8d41bf84151
            return NextResponse.json({
                success: false,
                message: "User and documentLink are required.",
            }, { status: 400 });
        }
<<<<<<< HEAD

        const newSubmission = new Submission({
            User,
            Assignment,
            Challenge,
=======
        const newSubmission = new Submission({
            User:user,
            Assignment:assignment,
            Challenge:challenge,
>>>>>>> f96d12a07e9548ee24a3ed46fc90c8d41bf84151
            documentLink,
            submittedAt: new Date(),
        });
        await newSubmission.save();
<<<<<<< HEAD

=======
        await User.findByIdAndUpdate(user, { $push: { submissions: newSubmission._id } },{new:true});
        if (assignment) {
            await Assignment.findByIdAndUpdate(assignment, { $push: { submissions: newSubmission._id } });
        }
        if(challenge){
            await Challenge.findByIdAndUpdate(challenge, { $push: { submissions: newSubmission._id } });
        }
>>>>>>> f96d12a07e9548ee24a3ed46fc90c8d41bf84151
        return NextResponse.json({
            success: true,
            data: newSubmission,
            message: "Submission added successfully.",
        }, { status: 201 });
<<<<<<< HEAD
=======

>>>>>>> f96d12a07e9548ee24a3ed46fc90c8d41bf84151
    } catch (error: any) {
        console.error("Error adding submission:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to add submission.",
            error: error.message,
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const Id = url.searchParams.get('Id');
        console.log("urlll",url)
        const sub = await Submission.findById(Id);
        if(!sub){
            return NextResponse.json({
                success: false,
                message: "Submission not found",
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data: sub,
        });
    } catch (error: any) {
        console.error("Error fetching challenges:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch challenges.",
            error: error.message,
        }, { status: 500 });
    }
}