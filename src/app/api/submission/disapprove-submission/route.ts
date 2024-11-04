import { connect } from '@/dbConfig/dbConfig'
import Assignment from '@/models/assignmentModel'
import Course from '@/models/courseModel'
import User from '@/models/userModel'
import Submission from '@/models/submissionModel'
import {Types} from 'mongoose'
import { NextResponse } from 'next/server'

connect()

// Disapprove a submission
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

        findSubmission.isVerified=false
        await findSubmission.save()
        
        return new NextResponse(JSON.stringify({message:"Successfully submission disapproved",submission:findSubmission}),{status:200})
    } catch (error:any) {
        console.log("Error while disapproving to a assignment submission")
        return new NextResponse(JSON.stringify({message:"Error while disapproving to a assignment submission",error:error.message}),{status:500})
    }
}

