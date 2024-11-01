// import Challenge from "@/models/challengeModel";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const {newChallengeData} = await request.json()
        const newChallenge = new Challenge(newChallengeData)
        const savedChallenge = await newChallenge.save();
        return {
            success: true,
            message: "Challenge created successfully",
            data: savedChallenge,
        };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error creating challenge:", error);
        return {
            success: false,
            message: "Failed to create challenge",
            error: error.message,
        };
    }
}
