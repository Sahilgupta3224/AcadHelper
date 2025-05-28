import Submission from "@/models/submissionModel";
import { NextRequest,NextResponse} from "next/server";
interface Params {
    id: string;
}

//editing a submission
export async function PATCH(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('Id');
        const submission = await Submission.findById(id);
        if(!submission){
            return NextResponse.json({
                success: false,
                message: "submission not found",
            }, { status: 404 });
        }
        const reqbody = await request.json()
        const {documentLink}= reqbody
        const newAssignment = await Submission.findByIdAndUpdate(id,
            {
                documentLink
            },
            {new:true}
        )
        return NextResponse.json({
            success: true,
            message: "Assignment Edited successfully",
            data: newAssignment,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Failed to edit assignment", error: error.message },
            { status: 500 }
        );
    }
}
