import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request:Request)
{
    try {
        
        await connect()
        const url=new URL(request.url);
        const userId=url.searchParams.get("userId");
        const user=await User.findById(userId);
        // console.log("userId is ",userId,request.url)

        if(!user)
        {
            return NextResponse.json({message:"Error while fetching user"},{status:400});
        }

        const events=user.events;
        console.log(events)

        return NextResponse.json({message:"Successfully fetched the events",events},{status:200});

    } catch (error) {
        console.log("Error while fetching events of user",error);
        return NextResponse.json({message:"Error while fetching the events of the user",error},{status:500});
    }
}