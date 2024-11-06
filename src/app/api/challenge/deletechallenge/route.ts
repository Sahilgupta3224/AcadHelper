import Challenge from "@/models/challengeModel";
import Course from "@/models/courseModel"
import { NextRequest,NextResponse} from "next/server";

interface Params {
    id: string;
}

export async function DELETE(request: NextRequest,{ params }: { params: Params }) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('Id');
        const deletedChallenge = await Challenge.findByIdAndDelete(id);
        if (!deletedChallenge) {
            return NextResponse.json({
                success: false,
                message: "Challenge not found",
            }, { status: 404 });
        }
        const course = await Course.findByIdAndUpdate(deletedChallenge.courseId,{$pull:{challenges:deletedChallenge._id}},{new:true})
        return NextResponse.json({
            success: true,
            message: "Challenge deleted successfully",
            data: deletedChallenge,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to delete challenge",
            error: error.message,
        }, { status: 500 });
    }
}
