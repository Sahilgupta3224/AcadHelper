import User from "@/models/userModel";
import Team from "@/models/teamModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import mongoose from "mongoose";

// GET all teams of user
export async function GET(request:NextRequest){
    try{
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get('userId') 
       await connect()
       if(mongoose.Types.ObjectId.isValid(userId)){
       const user = await User.findById(userId)

       if(!user)return NextResponse.json({error:"User does not exist"},{status:400})

       const teamsList = user.teams
       const teamIds = user.teams.map((team: { teamId: any; }) => team.teamId);
       const teams = await Team.find({_id:{$in:teamIds}})
    //    console.log(user.teams)
       return NextResponse.json({teams:teams,success:true},{status:200})
       }
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

// Create a team
export async function POST(request:NextRequest){
    try{
       const {team,userId} = await request.json()
       await connect()
       team.Members[0] = {memberId:new mongoose.Types.ObjectId(userId)}
       if(mongoose.Types.ObjectId.isValid(userId)){
       let newTeam = new Team(team)
       newTeam = await newTeam.save()

       const user = await User.findByIdAndUpdate(userId,{$push:{teams:{teamId:newTeam._id,joinedAt:Date.now()}}},{new:true})

       if(!user)return NextResponse.json({error:"User does not exist"},{status:400})
    //    console.log(user)
       return NextResponse.json({teams:user.teams,team:newTeam,success:true},{status:200})
       }else{
        return NextResponse.json({error:"Invalid user"},{status:500})
       }
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

// Delete a team
export async function DELETE(request:NextRequest){

    try{
        const {searchParams} = new URL(request.url)
        const teamId = searchParams.get('teamId') 
        await connect()

        const deletedTeam = await Team.findByIdAndDelete(teamId)
        if(!deletedTeam)return NextResponse.json({error:"Team not found"},{status:400})

        await User.updateMany({"teams.teamid":teamId},{$pull:{teams:{teamId:teamId}}})

        return NextResponse.json({message:"Team deleted successfully",success:true},{status:200})


    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

