import Challenge from "@/models/challengeModel";
import { NextRequest, NextResponse } from "next/server";
interface Params {
    id: string;
}

export async function POST(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('Id');
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Id not found",
            }, { status: 400 });
        }
        const challenege = await Challenge.findById(id);
        if (!challenege) {
            return NextResponse.json({
                success: false,
                message: "Challenge not found",
            }, { status: 404 });
        }
        const { title, description, type, frequency, challengeDoc, startDate, points } = await request.json()
        if (!title || !description || !type || !startDate || !points || !frequency || !challengeDoc) {
            return NextResponse.json({
                success: false,
                message: "All fields are required.",
            }, { status: 400 });
        }
        let End = new Date(startDate);                                      //Calculate the 'endDate' based on the frequency
        if (frequency === "daily") {
            End.setDate(End.getDate() + 1)
        }
        if (frequency === "weekly") {
            End.setDate(End.getDate() + 7)
        }
        const newChallenge = await Challenge.findByIdAndUpdate(id,
            {
                title,
                description,
                endDate: End.toISOString().split('T')[0],
                type,
                frequency,
                challengeDoc,
                startDate,
                points,
            },
            { new: true }
        )
        return NextResponse.json({
            success: true,
            message: "Challenge Edited successfully",
            data: newChallenge,
        });
    } catch (error: any) {
        return {
            success: false,
            message: "Failed to edit challenge",
            error: error.message,
        };
    }
}
