// Import necessary modules and types
import mongoose, { Types } from 'mongoose';
import Challenge from '@/models/challengeModel';
import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';

const ObjectId = mongoose.Types.ObjectId;

// API to get all challenges by type(daily,weekly)
export const GET = async (request: Request) => {
    const { typeOfChallenge } = await request.json();

    try {
        await connect();
        const challenges = await Challenge.find({ type: typeOfChallenge });
        if (!challenges) {
            return new NextResponse(JSON.stringify({ message: "Error while fetching the challenges" }), { status: 500 });
        }
        return new NextResponse(JSON.stringify({ message: "Challenges fetched successfully", challenges }), { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error while fetching challenges" }), { status: 500 });
    }
};