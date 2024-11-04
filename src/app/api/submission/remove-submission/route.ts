import { connect } from '@/dbConfig/dbConfig'
import Assignment from '@/models/assignmentModel'
import Course from '@/models/courseModel'
import User from '@/models/userModel'
import Submission from '@/models/submissionModel'
import Challenge from '@/models/challengeModel'
import {Types} from 'mongoose'
import { NextResponse } from 'next/server'

connect()

// Remove a submission
export const PATCH = async (request:Request)=>{
    try {
        
        const url = new URL(request.url);
        const submissionId = url.searchParams.get('Id')
        if(!submissionId)
        {
            return new NextResponse(JSON.stringify({message:"Enter all the credentials"}),{status:404})
        }
        
        const findSubmission=await Submission.findById(submissionId)

        if(!findSubmission)
        {
            return new NextResponse(JSON.stringify({message:"Submission doesn't exist"}))
        }
        const UserId = findSubmission.User
        const AssignmentId = findSubmission.Assignment
        const ChallengeId = findSubmission.Challenge
        if (ChallengeId) {
            await Challenge.findByIdAndUpdate(ChallengeId, {
                $pull: { submissions: submissionId }
            },{new:true});
        }
        if (AssignmentId) {
            await Assignment.findByIdAndUpdate(AssignmentId, {
                $pull: { submissions: submissionId }
            },{new:true});
        }
        await User.findByIdAndUpdate(UserId, {
                $pull: { submissions: submissionId }
        },{new:true});
        await Submission.findByIdAndDelete(submissionId);

        return new NextResponse(JSON.stringify({message:"Successfully successfully removed",submission:findSubmission}),{status:200})
    } catch (error:any) {
        console.log("Error while removing submission")
        return new NextResponse(JSON.stringify({message: "Error while removing submission",error:error.message}),{status:500})
    }
}

