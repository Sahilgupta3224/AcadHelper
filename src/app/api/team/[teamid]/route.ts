import { connect } from '@/dbConfig/dbConfig';
import Course from '@/models/courseModel'
import Team from '@/models/teamModel';
import User from '@/models/userModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

//GET team details from team id
export async function GET(request:NextRequest,context:{params:any}){
    const teamId = context.params.teamId
    const type = context.params.type
    if(type=="Team"){
        try{
            await connect()

            const team = await Team.findOne({_id:teamId})

            if(!team)return NextResponse.json({error:"Team not found"},{status:400})

            return NextResponse.json({team,success:true})

        }catch(error:any){
            return NextResponse.json({error:error.message},{status:500})
        }
    }else if(type=="Members"){
        try{
            await connect()
    
            const team = await Team.findOne({_id:teamId})
    
            if(!team)return NextResponse.json({error:"Team not found"},{status:400})

            const team_members = await User.find({_id:{$in:team.Members}})
    
            return NextResponse.json({members:team_members,success:true})
    
        }catch(error:any){
            return NextResponse.json({error:error.message},{status:500})
        }
    }

}

// Leave a Team -> if he is not the group admin
export async function DELETE(request:NextRequest,context:{params:any}){
    const teamId = context.params.groupId
    try{
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get('userId') 
        await connect()
        
        const updatedUser = await User.findByIdAndUpdate(userId,{$pull:{teams:{teamId:teamId}}},{new:true})
        if(!updatedUser)return NextResponse.json({error:"User not found"},{status:400})
        
        const updatedTeam = await Course.findByIdAndUpdate(teamId,{$pull:{Members:{memberId:userId}}},{new:true})
        if(!updatedTeam)return NextResponse.json({error:"Team not found"},{status:400})

        return NextResponse.json({updatedUser,success:true})

    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

// Add member
export async function POST(request:NextRequest,context:{params:any}){
    const teamId = context.params.groupId
    try{
        const {email,groupName} = await request.json()
        await connect()
        const team = await Team.findById(teamId)
        if(!team)return NextResponse.json({error:"Group not found"},{status:400})
        const user = await User.findOneAndUpdate({email:email},{$push:{inbox:{type:"group invite",message:`You have been invited by ${groupName}`}}},{new:true})
        if(!user)return NextResponse.json({error:"User not found"},{status:400})
        const updatedTeam = await Team.findByIdAndUpdate(teamId,{$push:{pendingInvites:user.username}},{new:true})
        return NextResponse.json({updatedTeam,success:true})

    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

export async function PUT(request:NextRequest,context:{params:any}){
    try{
        const {team} = await request.json()
        await connect()
        const updatedTeam = await Team.findByIdAndUpdate(team._id,team,{new:true})
        if(!updatedTeam)return NextResponse.json({error:"Group not found"},{status:400})
        return NextResponse.json({updatedTeam,success:true})
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}