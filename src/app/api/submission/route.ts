import Challenge from "@/models/challengeModel";
import User from "@/models/userModel";
import Submission from "@/models/submissionModel";
import Assignment from "@/models/assignmentModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from '@/dbConfig/dbConfig'
import Team from "@/models/teamModel";

connect()

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { user, assignment, challenge, documentLink,Course,type,groupId} = data;
        if (!user || !documentLink) {
            return NextResponse.json({
                success: false,
                message: "User and documentLink are required.",
            }, { status: 400 });
        }
        console.log("Course",Course)
        const newSubmission = new Submission({
            User:user,
            Assignment:assignment,
            Challenge:challenge,
            documentLink,
            submittedAt: new Date(),
            Course,
            type,
            groupId
        });
        await newSubmission.save();
        if(groupId){
            const team = await Team.findById(groupId)
            if(team){
                const members = team.Members.map((member:any) => member.memberId)
                for(const member of members){
                    const user = await User.findByIdAndUpdate(member, { $push: { submissions: newSubmission._id } },{new:true});
                }
            }
        }
        await User.findByIdAndUpdate(user, { $push: { submissions: newSubmission._id } },{new:true});
        if (assignment) {
            await User.findByIdAndUpdate(user, { $pull: { pendingAssignments: { assignmentId: { $in: assignment } } } },{new:true});
            await Assignment.findByIdAndUpdate(assignment, { $push: { submissions: newSubmission._id } },{new:true});
        }
        if(challenge){
            await Challenge.findByIdAndUpdate(challenge, { $push: { submissions: newSubmission._id } },{new:true});
        }
        return NextResponse.json({
            success: true,
            data: newSubmission,
            message: "Submission added successfully.",
        }, { status: 201 });
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