import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModal";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

//get all events of a user
export async function GET(request:Request)
{
    try {
        const url=new URL(request.url)
        const {searchParams}=url 
        const userId=searchParams.get("userId")

        await connect()

        const user=await User.findById(userId)
        
        if(!user)
        {
            return NextResponse.json({message:"Error while fetching the events"},{status:400})
        }

        const events = await Event.find({ '_id': { $in: user.events } });

        return NextResponse.json({message:"successfully fetched events",events})

    } catch (error) {
        return NextResponse.json({message:"Error while fetching the events",error},{status:500});

    }
}