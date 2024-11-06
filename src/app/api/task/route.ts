import User from "@/models/userModel";
import Task from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";

// GET all tasks of a user
export async function GET(request:NextRequest){
    try{
       const {userId }= await request.json()
       const user = await User.findById(userId)
       console.log("printUser id",userId)
       if(!user)return NextResponse.json({error:"User does not exist"},{status:400})
       const taskIdList = user.tasks
    console.log(taskIdList)
       const tasks = await Task.find({_id:{$in:{taskIdList}}})
       return NextResponse.json({tasks:tasks,success:true})
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

// Add task->UPDATE THISSSS
export async function POST(request:NextRequest){
   try{
      const {task,userId} = await request.json()
      const user = await User.findByIdAndUpdate(userId,{$push:{tasks:task}},{new:true})
      if(!user)return NextResponse.json({error:"Task could not be added"},{status:500})
      return NextResponse.json({message:"Task added sucessfully",tasks:user.tasks,success:true})
   }catch(error:any){
    return NextResponse.json({error:error.message},{status:500})
   }
}

export async function DELETE(request:NextRequest){
    try{
        // const {userId,taskId} = 
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}
