import { connect } from '@/dbConfig/dbConfig'
import {Types} from 'mongoose'
import { NextResponse } from 'next/server'


// Approve a submission
export const POST = async (request:Request)=>{
    try {
        
        const {userId,assignmentId,submissionId}=await request.json() 

        await connect()
        
        //input validation
        if(!userId || !assignmentId || !submissionId)
        {
            return new NextResponse(JSON.stringify({message:"Enter all the credentials"}),{status:404})
        }


        //verify the IDs
        
        if(!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(assignmentId) || !Types.ObjectId.isValid(submissionId)) 
        {
            return new NextResponse(JSON.stringify({message:"Enter a valid Id"}),{status:404})
        }

        // To check whether Admin is authorized for approval
        //Flow :-  AssignmentModel->CourseModel->Get the Instructors -> 
        //SubmissionModal->change field->

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log("Error while approving to a assignment submission")
        return new NextResponse(JSON.stringify({message:"Error while approving to a assignment submission",error:error.message}),{status:500})
    }
}

// Approve all submissions
// Remove a submission of a user