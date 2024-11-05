import Challenge from "@/models/challengeModel";
import { NextRequest,NextResponse} from "next/server";
interface Params {
    id: string;
}

export async function POST(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('Id');
        const challenege = await Challenge.findById(id);
        if(!challenege){
            return NextResponse.json({
                success: false,
                message: "Challenge not found",
            }, { status: 404 });
        }
        // const reqbody = await request.json()
        // console.log(reqbody);
        const {title,description,type,frequency,challengeDoc,startDate,points}= await request.json()
        const newChallenge = await Challenge.findByIdAndUpdate(id,
            {
                title,
                description,
                type,
                frequency,
                challengeDoc,
                startDate,
                points,
            },
            {new:true}
        )
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
