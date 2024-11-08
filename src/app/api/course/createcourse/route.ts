import { connect } from '@/dbConfig/dbConfig';
import Course from '@/models/courseModel'
import User from '@/models/userModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// create course
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { name, description, userId } = reqBody;
        let CourseCode = generateRandomCode()
        let course = Course.findOne({CourseCode:CourseCode})
        while(course){
            CourseCode = generateRandomCode()
            course = Course.findOne({CourseCode:CourseCode})
        }
        console.log(reqBody);
        const newCourse = new Course({
            name,
            description,
            CourseCode,
            Admins: [userId],
        });
        const newuser = await User.findByIdAndUpdate(userId,{$push:{CoursesAsAdmin: newCourse._id}},{new:true});
        await newCourse.save();
        return NextResponse.json({ message: "Course created successfully", course: newCourse,success:true }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


// Random code generation
function generateRandomCode(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
    
    return result;
  }