import { connect } from '@/dbConfig/dbConfig';
import Course from '@/models/courseModel'
import User from '@/models/userModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// create course
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { name, description, userId, CourseCode } = reqBody;
        console.log(reqBody);
        const newCourse = new Course({
            name,
            description,
            CourseCode,
            Admins: [userId],
        });
        const newuser = await User.findByIdAndUpdate(userId,{$push:{CoursesAsAdmin: newCourse._id}},{new:true});
        await newCourse.save();
        return NextResponse.json({ message: "Course created successfully", course: newCourse }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}