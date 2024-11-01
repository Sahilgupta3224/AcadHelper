import User from "@/models/userModel";
import Team from "@/models/teamModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";

// GET all teams of user
export async function GET(request:NextRequest){
    try{
       const userId = await request.json()
       await connect()
       const user = await User.findById(userId)

       if(!user)return NextResponse.json({error:"User does not exist"},{status:400})

       const teamsList = user.teams
       const teams = await Team.find({_id:{$in:{teamsList}}})
       return NextResponse.json({teams:teams,success:true},{status:200})
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

// Create a team
export async function POST(request:NextRequest){
    try{
       const {team,userId} = await request.json()
       await connect()
       let newTeam = new Team(team)
       newTeam = await newTeam.save()

       const user = await User.findByIdAndUpdate(userId,{$push:{teams:{teamId:newTeam._id,joinedAt:Date.now}}})

       if(!user)return NextResponse.json({error:"User does not exist"},{status:400})

       return NextResponse.json({teams:user.teams,success:true},{status:200})
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

// Delete a team
export async function DELETE(request:NextRequest){
    try{
        const {teamId} = await request.json()
        await connect()

        const deletedTeam = await Team.findByIdAndDelete(teamId)
        if(!deletedTeam)return NextResponse.json({error:"Team not found"},{status:400})

        await User.updateMany({"teams.teamid":teamId},{$pull:{teams:{teamId:teamId}}})

        return NextResponse.json({message:"Team deleted successfully",success:true},{status:200})


    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

