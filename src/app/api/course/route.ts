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
//create course
// export async function POST(request: NextRequest) {
//     try {
//         const reqBody = await request.json();
//         const { name, description, userId, CourseCode } = reqBody;
//         console.log(reqBody);
//         const newCourse = new Course({
//             name,
//             description,
//             CourseCode,
//             Admins: [userId],
//         });
//         const newuser = await User.findByIdAndUpdate(userId,{$push:{CoursesAsAdmin: newCourse._id}},{new:true});
//         await newCourse.save();
//         return NextResponse.json({ message: "Course created successfully", course: newCourse }, { status: 201 });

//     } catch (error: any) {
//         console.error("Error creating course:", error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }
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

//make admin,add chapters,delete chapters,kick user, make announcements,remove admin,get all students of a course