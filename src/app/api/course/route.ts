import { connect } from '@/dbConfig/dbConfig';
import Course from '@/models/courseModel'
import User from '@/models/userModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

//GET all courses from user id
export async function GET(request:NextRequest){
    try{
        await connect()
        const {userId} = await request.json() 

        const user = await User.findOne({_id:userId})
        
        if(!user){
            return NextResponse.json({error:'User does not exist'},{status:400})
        }

        const courseList= user.Courses.map((course:{courseId:mongoose.Schema.Types.ObjectId,enrolledAt:Date})=>{return course.courseId})

        const courses = await Course.find({_id:{$in:courseList}}).select('_id name')

        return NextResponse.json({courses,success:true})

    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

//Join course using course code
export async function POST(request:NextRequest){
    try{
        const {code,userId} = await request.json()
        await connect()
        const courseExist = await Course.findOne({CourseCode:code})
        if(!courseExist){
            return NextResponse.json({error:"Course code is invalid"},{status:500})
        }

        const userExist = await User.findById(userId)
        if(!userExist){
            return NextResponse.json({error:"User does not exist"},{status:500})
        }

        const course = await Course.findOneAndUpdate({CourseCode:code},{$push:{StudentsEnrolled:userId}},{new:true})

        const user = await User.findByIdAndUpdate(userId,{$push:{Courses:{courseId:course._id,enrolledAt: new Date()}}},{new:true})
        
        return NextResponse.json({message:"Course joined successfully",success:true})
        
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}