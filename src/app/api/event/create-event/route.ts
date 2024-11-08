import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModal";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connect();

        const { title, userId, DueDate } = await request.json();
        if (!title || !userId || !DueDate) {
            return NextResponse.json({ message: "Input all required fields" }, { status: 400 });
        }

        const event = new Event({
            title,
            User: userId,
            endDate:new Date(DueDate)
        });
        await event.save();

        // console.log("Formed event",event);

        // Find the user and update their events list
        const user = await User.findByIdAndUpdate(userId,{$push:{events:event._id}},{new:true});

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }

        


    
        return NextResponse.json({ message: "Successfully created event", event,user}, { status: 200 });

    } catch (error:any) {
        console.error("Error while creating the event", error);
        return NextResponse.json({ message: "Error while creating the event", error: error.message }, { status: 500 });
    }
}
