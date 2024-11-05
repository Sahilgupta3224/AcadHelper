import { connect } from "@/dbConfig/dbConfig";
import Assignment from "@/models/assignmentModel";
import Chapter from "@/models/chapterModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connect();

        // Parse the request data
        const { title, description, dueDate, AssignmentDoc, totalPoints, userId,chapterId} = await request.json();


        const user=await User.findById(userId)


        // Check if the user is an admin
        if (!user || !user.isAdmin) {
            return NextResponse.json({ message: "Unauthorized. Only admins can upload assignments." }, { status: 403 });
        }

        // Validate required fields
        if (!title || !AssignmentDoc || !dueDate ) {
            return NextResponse.json({ message: "Title,dueDate and AssignmentDoc are required fields." }, { status: 400 });
        }

        const ChapterReq=await Chapter.findById(chapterId)

        if(!ChapterReq)
        {
            return NextResponse.json({message:"Chapter needs to be created first"},{status:400})
        }

        const courseId=ChapterReq.courseId 
       
        const newAssignment = new Assignment({
            title,
            description,
            DueDate: dueDate,
            AssignmentDoc,
            totalPoints: totalPoints || 0,
            courseId
        });

        // Save the assignment to the database
        await newAssignment.save();

        return NextResponse.json({ message: "Assignment uploaded successfully.", assignment: newAssignment }, { status: 201 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error uploading assignment:", error);
        return NextResponse.json({ message: "An error occurred while uploading the assignment." }, { status: 500 });
    }
}


