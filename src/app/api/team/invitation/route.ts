import Team from "@/models/teamModel"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request:NextRequest){
    try{
        const {approval,userId,teamId,mail} = await request.json()
        console.log(teamId)
        const user = await User.findById(userId)

        if(!user)return NextResponse.json({error:"User not found"},{status:400})
        const team = await Team.findById(teamId)
        if(!team) return NextResponse.json({error:"Group does not exist"},{status:400})
        // Reject
        if(!approval){
           
           const user = await User.findByIdAndUpdate(userId,{$pull:{inbox:mail}},{new:true})
           const leader = await User.findByIdAndUpdate(team.leader,{$push:{inbox:{type:"invite rejected",message:`${user.username} rejected the join request`,teamId}}},{new:true})
           const updatedTeam = await Team.findByIdAndUpdate(teamId,{$pull:{pendingInvites:user.email}},{new:true})
           return NextResponse.json({message:"Invite rejected",success:true,updatedTeam,user,leader})
        }else{
        //Accept
            console.log(team.Members.find(member=>member._id.equals(userId)))
            if(team.Members.find(member=>member._id.equals(userId)))return NextResponse.json({error:"You are already a member of this group"},{status:400})

            //clear invite from mailbox, add team id to user team
            
            const user = await User.findByIdAndUpdate(userId,{$pull:{inbox:mail},$push:{teams:{teamId:teamId}}},{new:true})
            
            //send mail to leader
            const leader = await User.findByIdAndUpdate(team.leader,{$push:{inbox:{type:"invite accepted",message:`${user.username} accepted your invite to join ${team.teamname}`}}},{new:true})


            //members in team, remove from pending invites
            const updatedTeam =  await Team.findByIdAndUpdate(teamId,{$pull:{pendingInvites:user.email},$push:{Members:{memberId:user._id}}},{new:true})
           return NextResponse.json({message:"Invite accepted",success:true,updatedTeam,user,leader})

        }
    }catch(error){
        return NextResponse.json({error:error.message},{status:500})
    }
}