import { connect } from '@/dbConfig/dbConfig';
import Course from '@/models/courseModel'
import User from '@/models/userModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

connect()

//Join course using course code
export async function POST(request:NextRequest){
    try{
        const {code,userId} = await request.json()
        const courseExist = await Course.findOne({CourseCode:code})

        if(!courseExist){
            return NextResponse.json({error:"Course code is invalid"},{status:400})
        }

        const userExist = await User.findById(userId)
        if(!userExist){
            return NextResponse.json({error:"User does not exist"},{status:400})
        }

        if(userExist.Courses.includes(courseExist._id))return NextResponse.json({error:"You have already joined this course"},{status:400})

        const course = await Course.findOneAndUpdate({CourseCode:code},{$push:{StudentsEnrolled:userId}},{new:true})

        const user = await User.findByIdAndUpdate(userId,{$push:{Courses:{courseId:course._id,enrolledAt: new Date()}}},{new:true})
        
        return NextResponse.json({message:"Course joined successfully",success:true})
        
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

// delete course
export async function DELETE(request:NextRequest){
    try{
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get("Id");
        if (!courseId) {
        return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }
        await Course.findByIdAndDelete(courseId);
        // i need to pull pending assignments of that courses from all users too

        return NextResponse.json({ message: "Course and related data deleted successfully" }, { status: 200 });
    }
    catch(error: any){
        console.error("Error creating course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

//make announcements,get all students of a course