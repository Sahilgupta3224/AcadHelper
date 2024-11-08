import { connect } from '@/dbConfig/dbConfig';
import Course from '@/models/courseModel'
import User from '@/models/userModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

connect()

//GET all courses from user id
export async function POST(request:NextRequest){
    try{
        const {type,userId} = await request.json()
        await connect()

        const user = await User.findOne({_id:userId})
        
        if(!user){
            return NextResponse.json({error:'User does not exist'},{status:400})
        }

        let coursesEnrolled=[];
        let coursesAdmin=[];
        if(type==="enrolled" || type === "both"){
            const courseList= user.Courses.map((course:{courseId:mongoose.Schema.Types.ObjectId,enrolledAt:Date})=>{return course.courseId})
            coursesEnrolled = await Course.find({_id:{$in:courseList}}).select('_id name CourseCode')
        }
        if(type==="admin" || type === "both"){
            coursesAdmin = await Course.find({_id:{$in:user.CoursesAsAdmin}}).select('_id name CourseCode')
        }

        const courses = [...coursesEnrolled,...coursesAdmin]
        return NextResponse.json({courses,success:true})

    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}
