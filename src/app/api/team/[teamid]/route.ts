import { connect } from '@/dbConfig/dbConfig';
import Course from '@/models/courseModel'
import Team from '@/models/teamModel';
import User from '@/models/userModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

//GET team details from team id
export async function GET(request:NextRequest,context:{params:any}){
    const teamId = context.params.courseId
    try{
        await connect()

        const team = await Team.findOne({_id:teamId})

        if(!team)return NextResponse.json({error:"Team not found"},{status:400})

        return NextResponse.json({team,success:true})

    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

// Leave a Team 
export async function DELETE(request:NextRequest,context:{params:any}){
    const teamId = context.params.courseId
    try{
        const {userId} = await request.json() 
        await connect()
        
        const updatedUser = await User.findByIdAndUpdate(userId,{$pull:{teams:{teamId:teamId}}},{new:true})
        if(!updatedUser)return NextResponse.json({error:"User not found"},{status:400})
        
        const updatedTeam = await Course.findByIdAndUpdate(teamId,{$pull:{Members:{memberId:userId}}},{new:true})
        if(!updatedTeam)return NextResponse.json({error:"Team not found"},{status:400})

        return NextResponse.json({updatedTeam,success:true})

    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}