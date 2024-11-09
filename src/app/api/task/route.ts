import User from "@/models/userModel";
import Task from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModal";

// Get all tasks of a user
export async function GET(request:NextRequest){
    try{
       const {searchParams} = new URL(request.url)
       const userId = searchParams.get("userId")

       await connect()

       const user = await User.findById(userId)

       if(!user)return NextResponse.json({error:"User does not exist"},{status:400})

       const taskIdList = user.tasks
       const tasks = await Task.find({_id:{$in:taskIdList}})

       return NextResponse.json({tasks:tasks,success:true})

    }catch(error:any){

        return NextResponse.json({error:error.message},{status:500})
    }
}


// Add task
export async function POST(request:NextRequest){
   try{
      const {task,userId} = await request.json()

      if(!userId)return NextResponse.json({error:"You are not logged in"},{status:500})

      if(!task.title)return NextResponse.json({error:"Title cannot be empty"},{status:500})

      await connect()

      const newTask = new Task(task)
      const savedTask = await newTask.save()
      const event= new Event({
        title:task.title,
        User:userId,
        taskId:newTask._id
      })
      
      await event.save() 

      const user = await User.findByIdAndUpdate(userId,{$push:{tasks:savedTask._id,events:event}},{new:true})
      
      return NextResponse.json({message:"Task added sucessfully",tasks:user.tasks,newTask,success:true})

   }catch(error:any){

    return NextResponse.json({error:error.message},{status:500})

   }
}


// Delete task
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const taskId = searchParams.get("taskId");

        await connect();

        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) return NextResponse.json({ error: "Task does not exist" }, { status: 400 });

        // Remove the task from the user's tasks array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    tasks: taskId,
                    events: { taskId: taskId } 
                }
            },
            { new: true }
        );

        if (!updatedUser) return NextResponse.json({ error: "User does not exist" }, { status: 400 });

        // Delete the event(s) associated with the task from the Event collection
        const deletedEvent = await Event.deleteMany({ taskId: taskId });

        return NextResponse.json({
            message: "Task and associated event(s) deleted successfully",
            tasks: updatedUser.tasks,
            deletedEvent,
            success: true
        });

    } catch (error: any) {

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


//Edit task
export async function PUT(request:NextRequest){
    try{
        const body = await request.json()

        if(body.type=="edit"){

        await connect()
    
        const updatedTask = await Task.findByIdAndUpdate(body.taskId,body.task,{new:true})

        if(!updatedTask)return NextResponse.json({error:"Task does not exist"},{status:400})

        return NextResponse.json({message:"Task updated successfully",task:updatedTask,success:true})}

        else if(body.type=="checkbox"){

                const updatedTask = await Task.findByIdAndUpdate(body.taskId,{completed:body.completed},{new:true})

                if(!updatedTask)return NextResponse.json({error:"Task does not exist"},{status:400})

                return NextResponse.json({message:"Task updated successfully",task:updatedTask,success:true})
        }
        }catch(error:any){

        return NextResponse.json({error:error.message},{status:500})
    }
}