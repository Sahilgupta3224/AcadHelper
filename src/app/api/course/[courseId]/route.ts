import { connect } from '@/dbConfig/dbConfig';
import Course from '@/models/courseModel'
import User from '@/models/userModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request:NextRequest,context:{params:any}){
    const courseId = context.params.courseId
    try{
        await connect()

        const course = await Course.findOne({_id:courseId})

        if(!course)return NextResponse.json({error:"Course not found"},{status:400})

        return NextResponse.json({course,success:true})
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}