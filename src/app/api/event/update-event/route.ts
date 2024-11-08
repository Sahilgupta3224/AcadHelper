import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Event from "@/models/eventModal";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
    try {
        const { title, DueDate, userId, eventId } = await request.json();

        await connect();

       
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User doesn't exist" }, { status: 400 });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 400 });
        }

        if (String(event.User) !== String(user._id)) {
            return NextResponse.json({ message: "You are not authorized to make changes to the event" }, { status: 400 });
        }

        if (title) {
            event.title = title;
        }

        if (DueDate) {
            event.endDate = DueDate;
        }

        // Save the updated event
        await event.save();
        console.log(event);

        await User.findByIdAndUpdate(
            userId,
            { $pull: { events: eventId } },
            { new: true }
        );

       
        const finalUser= await User.findByIdAndUpdate(
            userId,
            { $push: { events: event._id } }, 
            { new: true }
        );

        return NextResponse.json({
            message: "Event updated successfully",
            event: event,
            finalUser
        });

    } catch (error: any) {
        console.log("Error while updating the event:", error.message);
        return NextResponse.json({
            message: "Failed to update the event",
            error: error.message,
        }, { status: 500 });
    }
}
