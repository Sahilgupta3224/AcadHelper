import Challenge from "@/models/challengeModel";
import Course from "@/models/courseModel";
import Event from "@/models/eventModal";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    id: string;
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('Id');
<<<<<<< HEAD
        
        // Delete the challenge
=======
        if(!id){
            return NextResponse.json({
                success: false,
                message: "Id not found",
            }, { status: 400 });
        }
>>>>>>> b954ea0b4b5c8703a2c99dbdffbbfa941eb638ae
        const deletedChallenge = await Challenge.findByIdAndDelete(id);
        if (!deletedChallenge) {
            return NextResponse.json({
                success: false,
                message: "Challenge not found",
            }, { status: 404 });
        }
<<<<<<< HEAD

        // Remove the challenge from the course's challenges array
        await Course.findByIdAndUpdate(
            deletedChallenge.courseId,
            { $pull: { challenges: deletedChallenge._id } },
            { new: true }
        );

        // Find and delete all events related to the deleted challenge
        const deletedEvents = await Event.find({ challengeId: deletedChallenge._id });
        await Event.deleteMany({ challengeId: deletedChallenge._id });

        // Extract the IDs of the deleted events
        const eventIds = deletedEvents.map(event => event._id);

        // Remove the deleted event IDs from the `events` array in user documents
        await User.updateMany(
            { events: { $in: eventIds } },
            { $pull: { events: { $in: eventIds } } }
        );

=======
        const course = await Course.findByIdAndUpdate(deletedChallenge.courseId,{$pull:{challenges:deletedChallenge._id}},{new:true})
        if(!course){
            return NextResponse.json({
                success: false,
                message: "Course not found",
            }, { status: 404 });
        }
>>>>>>> b954ea0b4b5c8703a2c99dbdffbbfa941eb638ae
        return NextResponse.json({
            success: true,
            message: "Challenge and related events deleted successfully",
            data: deletedChallenge,
        });

    } catch (error: any) {
        console.log("Error:", error.message);
        return NextResponse.json({
            success: false,
            message: "Failed to delete challenge",
            error: error.message,
        }, { status: 500 });
    }
}
