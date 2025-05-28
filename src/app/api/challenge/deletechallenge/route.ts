import Challenge from "@/models/challengeModel";
import Course from "@/models/courseModel";
import Event from "@/models/eventModal";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    id: string;
}

export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('Id');
        if(!id){
            return NextResponse.json({
                success: false,
                message: "Id not found",
            }, { status: 400 });
        }
        const deletedChallenge = await Challenge.findByIdAndDelete(id);
        if (!deletedChallenge) {
            return NextResponse.json({
                success: false,
                message: "Challenge not found",
            }, { status: 404 });
        }

        await Course.findByIdAndUpdate(                                               // Remove the challenge from the course's challenges array
            deletedChallenge.courseId,
            { $pull: { challenges: deletedChallenge._id } },
            { new: true }
        );

        const course = Course.findById(deletedChallenge.courseId)

        if(!course){
            return NextResponse.json({
                success: false,
                message: "Course not found",
            }, { status: 404 });
        }

        const deletedEvents = await Event.find({ challengeId: deletedChallenge._id });   // Find and delete all events related to the deleted challenge
        await Event.deleteMany({ challengeId: deletedChallenge._id });

        const eventIds = deletedEvents.map(event => event._id);                          // Extract the IDs of the deleted events

        await User.updateMany(                                                           // Remove the deleted event IDs from the `events` array in user documents
            { events: { $in: eventIds } },
            { $pull: { events: { $in: eventIds } } }
        );

        return NextResponse.json({
            success: true,
            message: "Challenge and related events deleted successfully",
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
