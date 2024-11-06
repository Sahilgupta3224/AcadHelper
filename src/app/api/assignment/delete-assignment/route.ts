import Challenge from "@/models/challengeModel";
import Course from "@/models/courseModel"
import Assignment from "@/models/assignmentModel";
import { NextRequest,NextResponse} from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('Id');
        const deletedAssignment = await Assignment.findByIdAndDelete(id);
        if (!deletedAssignment) {
            return NextResponse.json({
                success: false,
                message: "Assignment not found",
            }, { status: 404 });
        }
        const course = await Course.findByIdAndUpdate(deletedAssignment.courseId,{$pull:{assignments:deletedAssignment._id}},{new:true})
        return NextResponse.json({
            success: true,
            message: "Assignment deleted successfully",
            data: deletedAssignment,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to delete Assignment",
            error: error.message,
        }, { status: 500 });
    }
}
