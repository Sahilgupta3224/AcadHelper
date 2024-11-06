import { connect } from '@/dbConfig/dbConfig';
import Course from '@/models/courseModel'
import User from '@/models/userModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

//GET one course from course id

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request:NextRequest,context:{params:any}){
    const courseId = context.params.courseId
    try{
        await connect()

        const course = await Course.findOne({_id:courseId})

        if(!course)return NextResponse.json({error:"Course not found"},{status:400})
        if(!course)return NextResponse.json({error:"Course not found"},{status:400})

        return NextResponse.json({course,success:true})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

// Leave a course
export async function DELETE(request:NextRequest){
    try{
        const {userId,courseId} = await request.json() 
        await connect()
        
        const updatedUser = await User.findByIdAndUpdate(userId,{$pull:{Courses:{courseId:courseId}}},{new:true})
        if(!updatedUser)return NextResponse.json({error:"User not found"},{status:400})
        
        const updatedCourse = await Course.findByIdAndUpdate(courseId,{$pull:{StudentsEnrolled:userId}},{new:true})
        if(!updatedCourse)return NextResponse.json({error:"Course not found"},{status:400})

        return NextResponse.json({updatedUser,success:true})

    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}