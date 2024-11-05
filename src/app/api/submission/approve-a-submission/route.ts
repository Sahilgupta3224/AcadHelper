import { connect } from '@/dbConfig/dbConfig'
import Assignment from '@/models/assignmentModel'
import Course from '@/models/courseModel'
import User from '@/models/userModel'
import Submission from '@/models/submissionModel'
import Challenge from '@/models/challengeModel'
import {Types} from 'mongoose'
import { NextResponse } from 'next/server'

connect()

// Approve a submission
export const PATCH = async (request:Request)=>{
    try {
        const url = new URL(request.url);
        const submissionId = url.searchParams.get('Id');
        if(!submissionId)
        {
            return new NextResponse(JSON.stringify({message:"Enter all the credentials"}),{status:404})
        }
        
        const findSubmission=await Submission.findById(submissionId)

        if(!findSubmission)
        {
            return new NextResponse(JSON.stringify({message:"Submission doesn't exist"}))
        }
        if(findSubmission.isVerified===true){
            return new NextResponse(JSON.stringify({message:"Already approved"}))
        }
        findSubmission.isVerified=true
        const userId = findSubmission.User
        const assignmentId=findSubmission.Assignment
        const challengeId=findSubmission.challenge
        if(challengeId){
            const challenge = await Challenge.findById(challengeId)
            const points = challenge.points
            const CourseId = challenge.courseId
            findSubmission.marksObtained = points
            await User.findByIdAndUpdate(userId,{$push:{Totalpoints:{courseId:CourseId,points:points}}},{new:true})
        }
        if(assignmentId){
            const assignment =await Assignment.findById(assignmentId)
            const points = assignment.totalPoints
            const CourseId = assignment.Course
            findSubmission.marksObtained = points
            await User.findByIdAndUpdate(userId,{$push:{Totalpoints:{courseId:CourseId,points:points}}},{new:true})
        }
        await findSubmission.save()
        
        return new NextResponse(JSON.stringify({message:"Successfully submission approved",submission:findSubmission}),{status:200})

    } catch (error:any) {
        console.log("Error while approving to a assignment submission")
        return new NextResponse(JSON.stringify({message:"Error while approving to a assignment submission",error:error.message}),{status:500})
    }
}

