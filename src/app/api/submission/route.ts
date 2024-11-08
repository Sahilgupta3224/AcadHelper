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
        }else await User.findByIdAndUpdate(user, { $push: { submissions: newSubmission._id } },{new:true});

        if (assignment) {
            const updatedAssignment = await Assignment.findByIdAndUpdate(assignment, { $push: { submissions: newSubmission._id } },{new:true});
            // Group submission
            if(groupId){
                const team = await Team.findById(groupId)
                if(team){
                const members = team.Members.map((member:any) => member.memberId)
                for(const member of members){
                    const userDetails = await User.findById(member)

                    // Extra aura points
                    if(updatedAssignment.DueDate>Date.now){
                    const daysLeft = getDaysBetweenDates(updatedAssignment.DueDate,Date.now)
                    const totalDays = getDaysBetweenDates(updatedAssignment.DueDate,updatedAssignment.uploadedAt)
                    const extraPoints = Math.floor(Math.floor(updatedAssignment.totalPoints/totalDays)*daysLeft*0.5/members.length)
                    await User.updateOne({_id:member,"Totalpoints.courseId":updatedAssignment.Course},{$inc:{"Totalpoints.$.points":extraPoints}})
                    }
                
                    //Checking for eligibility of Early Bird badge
                    if(userDetails.NoOfEarlySubmits<10 && updatedAssignment.DueDate>Date.now){
                        const updatedUser = await User.findByIdAndUpdate(member,{ $inc: { NoOfEarlySubmits: 1 }},{new:true})
                        if(updatedUser.NoOfEarlySubmits==10){
                            await User.findByIdAndUpdate(member,{$push:{badges:"Phantom.png",inbox:{type:"badge",message:"Congratulations! You've won the Early Bird Badge!"}}})
                        }
                    }
                }
               }
            }else{
                //Individual assignment submission
                const userDetails = await User.findById(user)

                // Extra aura points
                if(updatedAssignment.DueDate>Date.now){
                   const daysLeft = getDaysBetweenDates(updatedAssignment.DueDate,Date.now)
                   const totalDays = getDaysBetweenDates(updatedAssignment.DueDate,updatedAssignment.uploadedAt)
                   const extraPoints = Math.floor(Math.floor(updatedAssignment.totalPoints/totalDays)*daysLeft*0.5)
                   await User.updateOne({_id:user,"Totalpoints.courseId":updatedAssignment.Course},{$inc:{"Totalpoints.$.points":extraPoints}})
                }
            
                //Checking for eligibility of Early Bird badge
                if(userDetails.NoOfEarlySubmits<10 && updatedAssignment.DueDate>Date.now){
                    const updatedUser = await User.findByIdAndUpdate(user,{ $inc: { NoOfEarlySubmits: 1 }},{new:true})
                    if(updatedUser.NoOfEarlySubmits==10){
                        await User.findByIdAndUpdate(user,{$push:{badges:"Phantom.png",inbox:{type:"badge",message:"Congratulations! You've won the Early Bird Badge!"}}})
                    }
                }
            }

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

function getDaysBetweenDates(date1, date2) {
    const oneDay = 1000 * 60 * 60 * 24; 
    const diffInTime = Math.abs(date2 - date1); 
    return Math.floor(diffInTime / oneDay); 
  }

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const Id = url.searchParams.get('Id');
        if(!Id){
            return NextResponse.json({
                success: false,
                message: "Invalid Id",
            }, { status: 400 });
        }
        const submission = await Submission.findById(Id);
        console.log(Id)
        if(!submission){
            return NextResponse.json({
                success: false,
                message: "submission not found",
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data: submission,
        });
    } catch (error: any) {
        console.error("Error fetching submission:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch submission.",
            error: error.message,
        }, { status: 500 });
    }
}