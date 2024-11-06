import User from "@/models/userModel";
import Task from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Team from "@/models/teamModel";


// Add task
export async function POST(request:NextRequest){
   try{
      const {task,userId,teamId} = await request.json()

      if(!userId)return NextResponse.json({error:"You are not logged in"},{status:500})
      if(!task.text)return NextResponse.json({error:"Task cannot be empty"},{status:500})

      await connect()

      const team = await Team.findByIdAndUpdate(teamId,{$push:{tasks:task}},{new:true})
      console.log(team)

      return NextResponse.json({message:"Task added sucessfully",tasks:team.tasks,task,success:true})
   }catch(error:any){
    return NextResponse.json({error:error.message},{status:500})
   }
}

//Delete Task
export async function DELETE(request:NextRequest){

    try{
        const {searchParams} = new URL(request.url)
        const teamId = searchParams.get('teamId') 
        const taskId = searchParams.get('taskId') 
        console.log(taskId)
        await connect()

        const updatedTeam = await Team.findByIdAndUpdate(teamId,{$pull:{tasks:{_id:taskId}}},{new:true})
        if(!updatedTeam)return NextResponse.json({error:"Team not found"},{status:400})

        return NextResponse.json({message:"Task deleted successfully",updatedTeam,success:true},{status:200})


    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

// Toggle complete
export async function PUT(request:NextRequest){
    try{
        const {taskId,teamId,completed} = await request.json()
        await connect()
        const updatedTeam = await Team.findOneAndUpdate({_id:teamId,"tasks._id":taskId},
            {$set:{"tasks.$.completed":completed}},{new:true})
        if(!updatedTeam)return NextResponse.json({error:"Team not found"},{status:400})
        return NextResponse.json({ success: true, updatedTeam });
    }catch(e){
        return NextResponse.json({error:error.message},{status:500})
    }
}