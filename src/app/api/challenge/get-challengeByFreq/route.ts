interface Params {
    id: string;
}
import Challenge from "@/models/challengeModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from '@/dbConfig/dbConfig'

connect()
// get challnege by frequency
export async function POST(request: NextRequest) {
    try {
        const { frequency, userId } = await request.json();
        if(frequency !='daily' && frequency !='weekly'){
            return NextResponse.json({
                success: false,
                message: "Invalid frequency provided."
            }, { status: 400 });
        }

        const user = await User.findById(userId).populate('Courses');                               // Find the user by 'userId' and populate their 'Courses' field with course details     

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found."
            }, { status: 404 });
        }

        const courseIds = user.Courses.map((course:any) => course.courseId);                       // Extract the 'courseId' from each course in the user's 'Courses' field

        const challenges = await Challenge.find({
            courseId: { $in: courseIds },
            frequency: frequency
        });
        return NextResponse.json({
            success: true,
            data: challenges,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch challenges.",
            error: error.message,
        }, { status: 500 });
    }
}