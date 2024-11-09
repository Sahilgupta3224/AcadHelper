import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request:NextRequest){
    try{
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get('userId') 
        const notificationId = searchParams.get('notificationId')
        const updatedUser = await User.findByIdAndUpdate(userId,{$pull:{inbox:{_id:notificationId}}},{new:true})
        
        if(!updatedUser)return NextResponse.json({error:"User not found"},{status:500})

        return NextResponse.json({message:"Notification deleted",success:true,updatedUser})
        
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}