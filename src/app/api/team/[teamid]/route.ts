import { connect } from '@/dbConfig/dbConfig';
import Course from '@/models/courseModel'
import Team from '@/models/teamModel';
import User from '@/models/userModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

//GET team details from team id
export async function GET(request:NextRequest,context:{params:any}){
    const teamId = context.params.teamid
    console.log(teamId)
    const {searchParams} = new URL(request.url)
    const type = searchParams.get('type') 
    if(type=="Team"){
        try{
            await connect()

            const team = await Team.findOne({_id:teamId})
            // console.log("team found")

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
            // console.log(team)
            const memberIds = team.Members.map((member) => member.memberId);
            const team_members = await User.find({_id:{$in:memberIds}})
    
            return NextResponse.json({members:team_members,success:true})
    
        }catch(error:any){
            return NextResponse.json({error:error.message},{status:500})
        }
    }else{
        return NextResponse.json({error:"GET request ambiguous"},{status:500})
    }

}

// Leave a Team -> if he is not the group admin
export async function DELETE(request:NextRequest,context:{params:any}){
    // const teamId = context.params.groupId
    try{
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get('userId') 
        const teamId = searchParams.get('groupId')
        console.log(teamId)

        await connect()
        const user = await User.findById(userId)
        if(!user)return NextResponse.json({error:"User not found"},{status:400})
        const team = Team.findById(teamId)
        if(!team)return NextResponse.json({error:"Team not found"},{status:400})
        
        const updatedUser = await User.findByIdAndUpdate(userId,{$pull:{teams:{teamId:teamId}}},{new:true})
        
        const updatedTeam = await Team.findByIdAndUpdate(teamId,{$pull:{Members:{memberId:userId}}},{new:true})

        return NextResponse.json({updatedUser,success:true})

    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

// Add member
export async function POST(request:NextRequest,context:{params:any}){
    try{
        const {email} = await request.json()
        const teamId = await context.params.teamid?.toString();
        await connect()
        const team = await Team.findById(teamId)
        const newUser = await User.findOne({email:email})
        console.log(context.params)
        // Group not found
        if(!team)return NextResponse.json({error:"Group not found"},{status:400})
        if (!newUser) return NextResponse.json({ error: "User not found" }, { status: 400 });

        // Already a member
        if(team.Members.find(member=>member.memberId.equals(newUser._id)))return NextResponse.json({error:`${newUser.username} is already a member of this group`},{status:400})
        
        // Maximum team size reached
        if(team.Members.length==team.maxteamsize)return NextResponse.json({error:"Maximum team limit reached"},{status:409})

        // Invitation already sent
        if(team.pendingInvites.includes(email))return NextResponse.json({error:"Invitation already sent"},{status:409})
        console.log(team._id)
        const user = await User.findOneAndUpdate(
            { email: email },
            {
                $push: {
                    inbox: {
                        type: "group invite",
                        message: `You have been invited by ${team.teamname}`,
                        teamId: teamId
                    }
                }
            },
            { new: true }
        );
        if(!user)return NextResponse.json({error:"User not found"},{status:400})
        const updatedTeam = await Team.findByIdAndUpdate(teamId,{$push:{pendingInvites:user.email}},{new:true})
        return NextResponse.json({updatedTeam,success:true})

    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}

export async function PUT(request:NextRequest,context:{params:any}){
    const teamId = context.params.teamId

    try{
        const {team} = await request.json()
        await connect()
        const updatedTeam = await Team.findByIdAndUpdate(teamId,team,{new:true})
        if(!updatedTeam)return NextResponse.json({error:"Group not found"},{status:400})
        return NextResponse.json({updatedTeam,success:true})
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}