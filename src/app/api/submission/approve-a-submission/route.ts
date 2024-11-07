import { connect } from '@/dbConfig/dbConfig'
import Assignment from '@/models/assignmentModel'
import Course from '@/models/courseModel'
import User from '@/models/userModel'
import Submission from '@/models/submissionModel'
import Challenge from '@/models/challengeModel'
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
        const challengeId=findSubmission.Challenge
        const user = await User.findById(userId)
        console.log(assignmentId)
        console.log(challengeId)
        if(challengeId){
            console.log("challenge")
            const challenge = await Challenge.findById(challengeId)
            const points = challenge.points
            const CourseId = challenge.courseId
            findSubmission.marksObtained = points
            const courseIndex = user.Totalpoints.findIndex(
                (entry:any) => entry.courseId.toString() === CourseId.toString()
            );
        
            if (courseIndex >= 0) {
                user.Totalpoints[courseIndex].points += points;
            } else {
                user.Totalpoints.push({ CourseId, points });
            }
        }
        if(assignmentId){
            console.log("assignment")
            const assignment =await Assignment.findById(assignmentId)
            const points = assignment.totalPoints
            const CourseId = assignment.Course
            findSubmission.marksObtained = points
            const courseIndex = user.Totalpoints.findIndex(
                (entry:any) => entry.courseId.toString() === CourseId.toString()
            );
        
            if (courseIndex >= 0) {
                user.Totalpoints[courseIndex].points += points;
            } else {
                user.Totalpoints.push({ CourseId, points });
            }
        }
        await user.save()
        await findSubmission.save()
        
        return new NextResponse(JSON.stringify({message:"Successfully submission approved",submission:findSubmission}),{status:200})

    } catch (error:any) {
        console.log("Error while approving to a assignment submission")
        return new NextResponse(JSON.stringify({message:"Error while approving to a assignment submission",error:error.message}),{status:500})
    }
}

