import { connect } from "@/dbConfig/dbConfig";
import Assignment from "@/models/assignmentModel";
import Submission from "@/models/submissionModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request:Request)
{
    try {
        await connect()

        const {userId,documentLink,assignmentId,feedback}=await request.json()

        const user=await User.findById(userId)

        if(!user)
        {
            return  NextResponse.json({message:"User not found "},{status:500})
        }


        const assignment=await Assignment.findById(assignmentId)

        if(!assignment)
        {
            return  NextResponse.json({message:"Assignment not found "},{status:500})
        }

        const status=assignment.status

        if(status==="Closed")
        {
            return NextResponse.json({message:"Submission for the assignment has been closed"},{status:500})
        }
        
        const dueDate=assignment.dueDate;
        const timeNow=Date.now() 
        const submission=new Submission({
            documentLink,
            User:user._id,
            Assignment:assignment._id,
            submittedAt:timeNow,
            lateSubmission:(dueDate<timeNow),
            feedback
        })

        await submission.save()

        if(assignment.submissions.includes(submission._id)===false)
        {
            assignment.submissions.push(submission._id)
            await assignment.save()
        }
        
        if(user.submissions.includes(submission._id)===false)
        {
            user.submissions.push(submission._id)
            await user.save()      
        }

        //Checking for eligibility of Early Bird badge
        

        return NextResponse.json({message:"Successfully submitted the assignment"},{status:200})

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log("Error while submitting the assignment");
        return NextResponse.json({message:"Error while submitting the assignment",error:error.message},{status:500})
    }
}