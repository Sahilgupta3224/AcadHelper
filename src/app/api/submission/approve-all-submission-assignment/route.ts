import { connect } from '@/dbConfig/dbConfig'
import Assignment from '@/models/assignmentModel'
import Course from '@/models/courseModel'
import User from '@/models/userModel'
import Submission from '@/models/submissionModel'
import {Types} from 'mongoose'
import { NextResponse } from 'next/server'

connect()

export const PATCH = async (request:Request)=>{
    try {
        const url = new URL(request.url);
        const assignmentId = url.searchParams.get('Id');
        if(!assignmentId)
        {
            return new NextResponse(JSON.stringify({message:"Enter all the credentials"}),{status:404})
        }
        
        const assignment=await Submission.findById(assignmentId)

        if(!assignment)
        {
            return new NextResponse(JSON.stringify({message:"assignment doesn't exist"}))
        }
        for(const submission of assignment.submissions){
            const sub =await Submission.findById(submission);
            sub.isVerified=true;
            await sub.save();
        }
        
        return new NextResponse(JSON.stringify({message:"Successfully submissions approved",assignment:assignment}),{status:200})

    } catch (error:any) {
        console.log("Error while approving to submissions")
        return new NextResponse(JSON.stringify({message:"Error while approving to submissions",error:error.message}),{status:500})
    }
}

