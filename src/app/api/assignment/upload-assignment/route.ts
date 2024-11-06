import { connect } from "@/dbConfig/dbConfig";
import Assignment from "@/models/assignmentModel";
import Chapter from "@/models/chapterModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

function parseCustomDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-');
    const fullYear =(year)? (year.length === 2 ? `20${year}` : year):"";
    return new Date(`${fullYear}-${month}-${day}`);
}


export async function POST(request: Request) {
    try {
        await connect();

        // Parse the request data
        const { title, description, dueDate, AssignmentDoc, totalPoints, userId,courseId} = await request.json();


        const user=await User.findById(userId)
        const parsedDueDate = parseCustomDate(dueDate);

        

        // Check if the user is an admin
        if (!user || !user.isAdmin) {
            return NextResponse.json({ message: "Unauthorized. Only admins can upload assignments." }, { status: 403 });
        }

        // Validate required fields
        if (!title || !AssignmentDoc || !parsedDueDate ) {
            return NextResponse.json({ message: "Title,dueDate and AssignmentDoc are required fields." }, { status: 400 });
        }

        
        console.log(await request.json());

        
        

       
        const newAssignment = new Assignment({
            title,
            description,
            DueDate: parsedDueDate,
            AssignmentDoc,
            totalPoints: parseInt(totalPoints, 10)
            || 0,
            courseId
        });

        // Save the assignment to the database
        await newAssignment.save();

        return NextResponse.json({ message: "Assignment uploaded successfully.", assignment: newAssignment }, { status: 201 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error uploading assignment:", error);
        return NextResponse.json({ message: "An error occurred while uploading the assignment.",error }, { status: 500 });
    }
}


