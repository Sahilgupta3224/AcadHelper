// import Challenge from "@/models/challengeModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from '@/dbConfig/dbConfig'

connect()

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const Id = url.searchParams.get('Id');
        console.log(Id)
        const user = await User.findById(Id);
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        console.error("Error fetching User:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch user.",
            error: error.message,
        }, { status: 500 });
    }
}

//update user-name
export async function PATCH(request:Request)
{
    try {
        const {username,userId}=await request.json();
        await connect()

        const user=await User.findByIdAndUpdate(userId,{username:username},{new:true});

        if(!user)
        {
            return NextResponse.json({message:"Error while updating the username"},{status:500})
        }

        return NextResponse.json({message:"Successfully updated the user",user},{status:200});
    } catch (error:any) {
        console.log("error while updating the username")
        return NextResponse.json({message:"Error while updating the username",error:error.message},{status:500})
    }
}