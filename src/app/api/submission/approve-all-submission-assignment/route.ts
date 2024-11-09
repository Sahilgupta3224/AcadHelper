import { connect } from '@/dbConfig/dbConfig'
import Assignment from '@/models/assignmentModel'
import Course from '@/models/courseModel'
import User from '@/models/userModel'
import Submission from '@/models/submissionModel'
import {Types} from 'mongoose'
import { NextResponse } from 'next/server'
import Team from '@/models/teamModel'

connect()

export const PATCH = async (request:Request)=>{
    try {
        const url = new URL(request.url);
        const assignmentId = url.searchParams.get('Id');
        if(!assignmentId)
        {
            return new NextResponse(JSON.stringify({message:"Enter all the credentials"}),{status:404})
        }
        
        const assignment=await Assignment.findById(assignmentId)

        if(!assignment)
        {
            return new NextResponse(JSON.stringify({message:"assignment doesn't exist"}))
        }
        const points = assignment.TotalPoints
        const courseId = assignment.Course
        const submissions = await Submission.find({ Assignment: assignmentId });
        for (const submission of submissions) {
            if (submission.isVerified) {
                continue;
            }

            submission.isVerified = true;
            submission.marksObtained = points;

            if (submission.type === "team") {
                const team = await Team.findById(submission.groupId);
                if (team) {
                    const members = team.Members.map((member: any) => member.memberId);
                    const pointsPerMember = points / members.length;

                    for (const memberId of members) {
                        const user = await User.findById(memberId);
                        if (user) {
                            const courseIndex = user.Totalpoints.findIndex(
                                (entry: any) => entry.courseId?.toString() === courseId?.toString()
                            );

                            if (courseIndex >= 0) {
                                user.Totalpoints[courseIndex].points += pointsPerMember;
                            } else {
                                user.Totalpoints.push({ courseId, points: pointsPerMember });
                            }
                            await user.save();
                        }
                    }
                }
            } else {
                const user = await User.findById(submission.User);
                if (user) {
                    const courseIndex = user.Totalpoints.findIndex(
                        (entry: any) => entry.courseId.toString() === courseId.toString()
                    );

                    if (courseIndex >= 0) {
                        user.Totalpoints[courseIndex].points += points;
                    } else {
                        user.Totalpoints.push({ courseId, points });
                    }
                    await user.save();
                }
            }

            await submission.save();
        }
        
        return new NextResponse(JSON.stringify({message:"Successfully submissions approved",assignment:assignment}),{status:200})

    } catch (error:any) {
        console.log(error)
        return new NextResponse(JSON.stringify({message:"Error while approving to submissions",error:error.message}),{status:500})
    }
}

