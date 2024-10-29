import { connect } from "@/dbConfig/dbConfig"
import {  NextResponse ,NextRequest} from "next/server"
import Chapter from '@/models/chapterModel'
import  {Types} from 'mongoose'
import User from "@/models/userModel"
import Course from "@/models/courseModel"
import Assignment from '@/models/assignmentModel'

connect()
//get-all-chapters of a course
export const GET = async (request: NextRequest)=>{
    try {
        const reqBody = await request.json();
        const {courseId} = reqBody;
        if(!courseId){
            return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }
        const course = await Course.findById(courseId)
        if(!course){
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }
        const Chapters = course.chapters;
        return NextResponse.json({ Chapters }, { status: 200 });
    } catch (error:any) {
        return new NextResponse(JSON.stringify({message:"Error fetching the chapters",error:error.message}),{status:500})
    }
}


// creating a chapter 
export const POST = async (request: Request) => {
    try {
        const {name,courseId} = await request.json();
        if (!name || !courseId) {
            return new NextResponse(JSON.stringify({ message: "Give all important fields" }), { status: 400 });
        }
        const course = await Course.findById(courseId)
        if(!course){
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }
        const newChapter = new Chapter({
            name,
            courseId
        });
        await newChapter.save();
        return new NextResponse(JSON.stringify({ message: "Chapter created successfully", chapter: newChapter }), { status: 201 });

    } catch (error: any) {
        console.log("Error while creating Chapter", error);
        return new NextResponse(JSON.stringify({ message: "Error while creation of Chapter",error:error.message }), { status: 500 });
    }
};


export const PATCH = async (request: Request) => {
    try {
        const {name,chapterId} = await request.json();
        if (!name || !chapterId) {
            return new NextResponse(JSON.stringify({ message: "Give all fields" }), { status: 400 });
        }
        const updatedChapter = await Chapter.findByIdAndUpdate(
            chapterId, 
            { name }, 
            { new: true } 
        );
        if (!updatedChapter) {
            return new NextResponse(JSON.stringify({ message: "Chapter not found" }), { status: 404 });
        }
        return new NextResponse(JSON.stringify({ message: "Chapter updated successfully", updatedChapter }), { status: 200 });
    } catch (error: any) {
        console.error("Error while updating the Chapter:", error);
        return new NextResponse(JSON.stringify({ message: "Error while updating chapter", error: error.message }), { status: 500 });
    }
};


//delete chapter 

export const DELETE = async (request:Request)=>{
    try {
        
        const {ChapterId} =await request.json()
        const chapterToBeDeleted=await Chapter.findById(ChapterId)
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
    } catch (error:any) {
        console.log("Deletion of chapter unsuccessful ");
        return new NextResponse(JSON.stringify({message:"Error while deleting the chapter",error:error.message}),{status:500})
    }
}