import User from "@/models/userModel"
import { NextResponse } from "next/server"

export async function GET(request:Request)
{
    try {
        const url= new URL(request.url)
        const userId=url.searchParams.get("userId")
        // console.log(userId,url)
        const user=await User.findById(userId).populate('submissions').exec()
        if(!user)
        {
            return NextResponse.json({message:"User not found"},{status:400});
        }
        const submissions=user.submissions
        return  NextResponse.json({message:"Successfully fetched the submissions",submissions},{status:200});
    } catch (error) {
        console.log("Error while fetching the submissions of user");
        return NextResponse.json({message:"Error while fetching the submissions of user",error:error.message},{status:500})
        
    }
}