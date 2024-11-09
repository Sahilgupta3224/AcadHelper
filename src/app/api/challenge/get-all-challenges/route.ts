import { connect } from "@/dbConfig/dbConfig";
import Course from "@/models/courseModel";
import { NextResponse } from "next/server";

export async function GET(request:Request)
{
    try {
        const {courseId}=await request.json();
        await connect() 
        const course=await Course.findById(courseId)
        if(!course)
        {
            return NextResponse.json({message:"Course not found"},{status:400})
        }
        const challenges=course.challenges 
        return NextResponse.json({message:"Successfully fetched all challenges",length:challenges.length })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log("Error while fetching all challenges");
        return NextResponse.json({message:"Error while fetching all challenges",error:error.message},{status:500})
    }
}