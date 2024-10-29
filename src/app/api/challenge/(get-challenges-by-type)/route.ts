// Import necessary modules and types
import mongoose, { Types } from 'mongoose';
import Challenge from '@/models/challengeModel';
import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';

const ObjectId = mongoose.Types.ObjectId;

// API to get all challenges by type
export const GET = async (request: Request) => {
    const { typeOfChallenge } = await request.json();

    try {
        await connect();

        const challenges = await Challenge.find({ type: typeOfChallenge });

        if (!challenges) {
            return new NextResponse(JSON.stringify({ message: "Error while fetching the challenges" }), { status: 500 });
        }

        return new NextResponse(JSON.stringify({ message: "Challenges fetched successfully", challenges }), { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error while fetching challenges:", error);
        return new NextResponse(JSON.stringify({ message: "Error while fetching challenges" }), { status: 500 });
    }
};

// Create a challenge
export const POST = async (request: Request) => {
    try {
        await connect();

        const { title, description, type, frequency, startDate, endDate, points, participants, createdBy } = await request.json();

        // Validation checks
        if (!title || typeof title !== "string" || title.trim().length === 0) {
            return new NextResponse(JSON.stringify({ message: "Title is required and must be a non-empty string." }), { status: 400 });
        }
        if (!description || typeof description !== "string" || description.trim().length === 0) {
            return new NextResponse(JSON.stringify({ message: "Description is required and must be a non-empty string." }), { status: 400 });
        }
        if (!["individual", "team"].includes(type)) {
            return new NextResponse(JSON.stringify({ message: "Type must be 'individual' or 'team'." }), { status: 400 });
        }
        if (!["daily", "weekly", "custom"].includes(frequency)) {
            return new NextResponse(JSON.stringify({ message: "Frequency must be 'daily', 'weekly', or 'custom'." }), { status: 400 });
        }
        if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
            return new NextResponse(JSON.stringify({ message: "Invalid start and end dates." }), { status: 400 });
        }
        if (typeof points !== "number" || points < 0) {
            return new NextResponse(JSON.stringify({ message: "Points must be a non-negative number." }), { status: 400 });
        }
        if (!Types.ObjectId.isValid(createdBy)) {
            return new NextResponse(JSON.stringify({ message: "Invalid creator ID." }), { status: 400 });
        }

        const user = await User.findById(createdBy);
        if (!user || !user.isAdmin) {
            return new NextResponse(JSON.stringify({ message: "User is not authorized to create challenges." }), { status: 403 });
        }

        const newChallenge = new Challenge({ title, description, type, frequency, startDate, endDate, points, participants, createdBy });
        await newChallenge.save();

        return new NextResponse(JSON.stringify({ message: "Challenge created successfully", challenge: newChallenge }), { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error creating challenge:", error);
        return new NextResponse(JSON.stringify({ message: "Failed to create challenge", error: error.message }), { status: 500 });
    }
};

// Update a challenge
export const PATCH = async (request: Request) => {
    try {
        await connect();
        const { title, description, type, frequency, startDate, endDate, points, participants, updatedBy, challengeId } = await request.json();

        if (!Types.ObjectId.isValid(updatedBy) || !ObjectId.isValid(challengeId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid user or challenge ID." }), { status: 400 });
        }

        const user = await User.findById(updatedBy);
        if (!user || !user.isAdmin) {
            return new NextResponse(JSON.stringify({ message: "User is not authorized for update." }), { status: 403 });
        }

        const challengeToBeUpdated = await Challenge.findById(challengeId);
        if (!challengeToBeUpdated) {
            return new NextResponse(JSON.stringify({ message: "Challenge not found" }), { status: 404 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedFields: any = {};
        if (title) updatedFields.title = title;
        if (description) updatedFields.description = description;
        if (type && ["individual", "team"].includes(type)) updatedFields.type = type;
        if (frequency && ["daily", "weekly", "custom"].includes(frequency)) updatedFields.frequency = frequency;
        if (startDate) updatedFields.startDate = new Date(startDate);
        if (endDate) updatedFields.endDate = new Date(endDate);
        if (typeof points === "number" && points >= 0) updatedFields.points = points;
        if (participants && Array.isArray(participants)) updatedFields.participants = participants;

        const updatedChallenge = await Challenge.findByIdAndUpdate(challengeId, { $set: updatedFields }, { new: true });
        if (!updatedChallenge) {
            return new NextResponse(JSON.stringify({ message: "Challenge update failed" }), { status: 500 });
        }

        return new NextResponse(JSON.stringify({ message: "Challenge updated successfully", challenge: updatedChallenge }), { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error updating challenge:", error);
        return new NextResponse(JSON.stringify({ message: "Failed to update challenge", error: error.message }), { status: 500 });
    }
};

// Delete a challenge
export const DELETE = async (request: Request) => {
    try {
        const { challengeId } = await request.json();

        if (!challengeId || !Types.ObjectId.isValid(challengeId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid challenge ID." }), { status: 400 });
        }

        const challengeToBeDeleted = await Challenge.findByIdAndDelete(challengeId);
        
        if (!challengeToBeDeleted) {
            return new NextResponse(JSON.stringify({ message: "Challenge not found" }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ message: "Challenge deleted successfully", deletedChallenge: challengeToBeDeleted }), { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error deleting challenge:", error);
        return new NextResponse(JSON.stringify({ message: "Failed to delete challenge", error: error.message }), { status: 500 });
    }
};
