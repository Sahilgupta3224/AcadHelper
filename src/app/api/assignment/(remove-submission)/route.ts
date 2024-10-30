import { connect } from '@/dbConfig/dbConfig'
import Assignment from '@/models/assignmentModel'
import Course from '@/models/courseModel'
import User from '@/models/userModel'
import Submission from '@/models/submissionModel'
import {Types} from 'mongoose'
import { NextResponse } from 'next/server'


// Remove a submission
export const PATCH = async (request:Request)=>{
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

        const userAdmin= await User.findById(userId)


        if(!userAdmin )
        {
            return new NextResponse(JSON.stringify({message:"User not found"}))
        }

        if(userAdmin.isAdmin===false)
        {
            return new NextResponse(JSON.stringify({message:"Only Admin allowed to approve"}),{status:400})
        }

       

        // get the assignment to which submission is made 

        const assignment=await Assignment.findById(assignmentId)

        if(!assignment)
        {
            return new NextResponse(JSON.stringify({message:"Assignment not found"}))
        }

        

        // check whether the assignment is open for submission or not

        if(assignment.status==="Closed")
        {
            return new NextResponse(JSON.stringify({message:"The assignment submission is now closed"}),{status:500})
        }

        const courseId=assignment.Course 

        const course=await Course.findById(courseId)

        //check for the Course ID
        if(!Types.ObjectId.isValid(courseId))
        {
            return new NextResponse(JSON.stringify({message:"courseId not valid"}))
        }


        if(!course)
        {
            return new NextResponse(JSON.stringify({message:"THe course could not be found"}),{status:500})
        }

        if(!course.Instructors.includes(userId))
        {
            return new NextResponse(JSON.stringify({message:"Admin not incharge of the course"}),{status:500})
        }

        //check whether the submission already exists
     
        
        const findSubmission=await Submission.findByIdAndDelete(submissionId)

        if(!findSubmission)
        {
            return new NextResponse(JSON.stringify({message:"Submission doesn't exist"}))
        }

        //user who made the submission
        const user=findSubmission.User
        

        //update the user's submission array and remove the submission Id from it
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user.submissions=user.submissions.filter((submission:any)=>(submission._id!==submissionId))

  

        // making sure to add the assignment again to the pending status
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user.pendingAssignments.push({
                assignmentId,
                dueDate: assignment.DueDate
        })
       

        await user.save() //save user 


        //adding the new submission to the submissions array field in assignment 

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        assignment.submissions=assignment.submissions.filter((submission:any)=>(submission!==submissionId))
        await assignment.save() 


        
        return new NextResponse(JSON.stringify({message:"Successfully submission removed",submission:findSubmission,assignment,user}),{status:200})



        //Flow :-  AssignmentModel->CourseModel->Get the Instructors -> 
        //SubmissionModal->change field->

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log("Error while approving to a assignment submission")
        return new NextResponse(JSON.stringify({message:"Error while approving to a assignment submission",error:error.message}),{status:500})
    }
}

