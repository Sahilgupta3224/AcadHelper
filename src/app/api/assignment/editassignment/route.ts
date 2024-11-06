import Assignment from "@/models/assignmentModel";
import { NextRequest,NextResponse} from "next/server";
interface Params {
    id: string;
}

export async function PATCH(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('Id');
        const assignment = await Assignment.findById(id);
        if(!assignment){
            return NextResponse.json({
                success: false,
                message: "assignment not found",
            }, { status: 404 });
        }
        const reqbody = await request.json()
        // console.log(reqbody)
        const {title,
            description,
            AssignmentDoc,
            DueDate,
            totalPoints,
            status}= reqbody
        const newAssignment = await Assignment.findByIdAndUpdate(id,
            {
                title,
                description,
                AssignmentDoc,
                DueDate,
                totalPoints,
                status
            },
            {new:true}
        )
        return NextResponse.json({
            success: true,
            message: "Assignment Edited successfully",
            data: newAssignment,
        });
    } catch (error: any) {
        console.error("Error editing assignment:", error);
        return {
            success: false,
            message: "Failed to edit assignment",
            error: error.message,
        };
    }
}
