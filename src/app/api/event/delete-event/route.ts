import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModal";
import User from "@/models/userModel";
import { NextResponse } from "next/server";


export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const { searchParams } = url;
        const eventId = searchParams.get("eventId");
        const userId=searchParams.get("userId")
       
        await connect();
        // Remove the event reference from the user's events array
        // console.log(deletedEvent.User)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { events:eventId }},
            { new: true }
        );

        // Delete the event
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return NextResponse.json({ message: "Error while deleting the event" }, { status: 400 });
        }

        
        console.log("Updated user ",updatedUser)
       
        

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found or unable to update user events" }, { status: 400 });
        }

        return NextResponse.json({ message: "Successfully deleted event and updated user", deletedEvent, success: true }, { status: 200 });
    } catch (error) {
        console.error("Error while deleting the event:", error);
        return NextResponse.json({ message: "Error while deleting the event", error:error.message }, { status: 500 });
    }
}
