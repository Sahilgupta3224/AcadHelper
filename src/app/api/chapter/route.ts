import { connect } from "@/dbConfig/dbConfig"
import {  NextResponse } from "next/server"
import Chapter from '@/models/chapterModel'

import  {Types} from 'mongoose'
import User from "@/models/userModel"
import Assignment from '@/models/assignmentModel'



// const ObjectId= mongoose.Types.ObjectId 



//get-all-chapters
export const GET = async ()=>{
    try {

        await connect()

        // get all chapters
        const chapters = await Chapter.find();

        return new NextResponse(JSON.stringify({ message: "Chapters retrieved successfully", chapters }), { status: 200 });
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log("Error while fetching the chapters",error)
        return new NextResponse(JSON.stringify({message:"Error fetching the chapters",error:error.message}),{status:500})
    }
}


// creating a chapter 
export const POST = async (request: Request) => {
    try {
        const { name, assignment, courseId ,userId } = await request.json();
        
        await connect();

        // Check for required fields
        if (!name || !courseId) {
            return new NextResponse(JSON.stringify({ message: "Give all important fields" }), { status: 400 });
        }

        // Validate courseId
        if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(userId)) 
            {
            return new NextResponse(JSON.stringify({ message: "Give Proper course/user ID" }), { status: 400 });
        }
        
        const user=await User.findById(userId)

        if(!user)
        {
            return new NextResponse(JSON.stringify({message:"User not found"}),{status:500})
        }

        if(user.isAdmin===false)
        {
            return new NextResponse(JSON.stringify({message:"Only Admins allowed to add a chapter"}),{status:400})
        }
        


        // Check if assignment is an array and validate each assignment ID
        if (assignment && Array.isArray(assignment)) {
            for (const assnId of assignment) {
                if (!Types.ObjectId.isValid(assnId)) {
                    return new NextResponse(JSON.stringify({ message: `Invalid assignment ID: ${assnId}` }), { status: 400 });
                }
            }
        }
        
        // Create and save the new chapter
        const newChapter = new Chapter({
            name,
            assignments: assignment,
            courseId
        });

        await newChapter.save();

        return new NextResponse(JSON.stringify({ message: "Chapter created successfully", chapter: newChapter }), { status: 201 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log("Error while creating Chapter", error);
        return new NextResponse(JSON.stringify({ message: "Error while creation of Chapter",error:error.message }), { status: 500 });
    }
};


//updating the fields in chapter 
// case 1 name Update 
// case 2 courseId update 
// case 3 assignment addition 
export const PATCH = async (request: Request) => {
    try {
        const { name, courseId, userId } = await request.json();

        await connect();

        // Validate input fields
        if (!name || !courseId) {
            return new NextResponse(JSON.stringify({ message: "Give all fields" }), { status: 400 });
        }

        // Validate courseId and userId
        if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Give Proper course/user ID" }), { status: 400 });
        }

        // Check if the user is an admin
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        if (!user.isAdmin) {
            return new NextResponse(JSON.stringify({ message: "Only Admins allowed to add a chapter" }), { status: 403 });
        }

        // Update the chapter by ID
        const updatedChapter = await Chapter.findByIdAndUpdate(
            courseId, 
            { name }, 
            { new: true } 
        );

      
        if (!updatedChapter) {
            return new NextResponse(JSON.stringify({ message: "Chapter not found" }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ message: "Chapter updated successfully", updatedChapter }), { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error while updating the Chapter:", error);
        return new NextResponse(JSON.stringify({ message: "Error while updating chapter", error: error.message }), { status: 500 });
    }
};


//delete chapter 

export const DELETE = async (request:Request)=>{
    try {
        
        const {ChapterId} =await request.json()

        await connect() 

        const chapterToBeDeleted=await Chapter.findById(ChapterId)

        // let assignmentLength=chapterToBeDeleted?.assignments.length

        for(const assignId of chapterToBeDeleted?.assignments)
        {
            const k=await Assignment.findByIdAndDelete(assignId)
            if(!k)
            {
                console.log("Didn't delete Assignment");
                return new NextResponse(JSON.stringify({message:"A Assignment was not deleted",assignmentId:assignId}),{status:500})
            }
        }

        const deletedChapter=await Chapter.findByIdAndUpdate(ChapterId)

        if(!deletedChapter)
        {
            return new NextResponse(JSON.stringify({message:"Was not able to delete the chapter "}),{status:500})
        }

        return new NextResponse(JSON.stringify({message:"Successfully deleted",chapterDeleted:deletedChapter}))


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log("Deletion of chapter unsuccessful ");
        return new NextResponse(JSON.stringify({message:"Error while deleting the chapter",error:error.message}),{status:500})
    }
}