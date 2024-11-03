import Challenge from "@/models/challengeModel";
import { NextRequest,NextResponse} from "next/server";
interface Params {
    id: string;
}

export async function PATCH(request: NextRequest,{ params }: { params: Params }) {
    try {
        const { id } = params;
        const challenege = await Challenge.findById(id);
        if(!challenege){
            return NextResponse.json({
                success: false,
                message: "Challenge not found",
            }, { status: 404 });
        }
        const reqbody = await request.json()
        const newChallenge = await Challenge.findByIdAndUpdate(id,{$set:reqbody},{new:true})
        return NextResponse.json({
            success: true,
            message: "Challenge Edited successfully",
            data: newChallenge,
        });
    } catch (error: any) {
        console.error("Error editing challenge:", error);
        return {
            success: false,
            message: "Failed to edit challenge",
            error: error.message,
        };
    }
}
