import { connect } from '@/dbConfig/dbConfig'
import Assignment from '@/models/assignmentModel'
import Course from '@/models/courseModel'
import Challenge from '@/models/challengeModel'
import User from '@/models/userModel'
import Submission from '@/models/submissionModel'
import { Types } from 'mongoose'
import { NextResponse } from 'next/server'
import Team from '@/models/teamModel'

connect()

// Disapprove a submission
export const PATCH = async (request: Request) => {
    try {
        const url = new URL(request.url);
        const submissionId = url.searchParams.get('Id');
        if (!submissionId) {
            return new NextResponse(JSON.stringify({ message: "Enter all the credentials" }), { status: 404 })
        }

        const findSubmission = await Submission.findById(submissionId)

        if (!findSubmission) {
            return new NextResponse(JSON.stringify({ message: "Submission doesn't exist" }))
        }
        if(!findSubmission.isVerified){
            return new NextResponse(JSON.stringify({ message: "Submission already disapproved" }))
        }
        findSubmission.isVerified = false
        let points = 0;
        let courseId;
        if (findSubmission.Challenge) {
            const challenge = await Challenge.findById(findSubmission.Challenge);
            points = challenge.points;
            courseId = challenge.courseId;
            findSubmission.marksObtained = 0;
        } else if (findSubmission.Assignment) {
            const assignment = await Assignment.findById(findSubmission.Assignment);
            points = assignment.totalPoints;
            courseId = assignment.Course;
            findSubmission.marksObtained = 0;
        }

        if (findSubmission.type === "team") {
            const team = await Team.findById(findSubmission.groupId);
            if (team) {
                const members = team.Members.map((member: any) => member.memberId);
                const pointsPerMember = points / members.length;

                for (const memberId of members) {
                    const user = await User.findById(memberId);
                    if (courseId && user && user.Totalpoints) {
                        const courseIndex = user.Totalpoints.findIndex(
                            (entry: any) => entry.courseId.equals(courseId)
                        );
                        if (courseIndex >= 0 && user.Totalpoints[courseIndex]) {
                            user.Totalpoints[courseIndex].points -= points;
                        } else {
                            user.Totalpoints.push({ courseId, points: 0 });
                        }
                    }
                    await user.save();
                }
            }
        } else {
            const user = await User.findById(findSubmission.User);
            console.log(courseId)
            console.log(user)
            const courseIndex = user.Totalpoints.findIndex(
                (entry: any) => entry.courseId.equals(courseId)
            );
            console.log(courseIndex)
            if (courseIndex >= 0) {
                user.Totalpoints[courseIndex].points -= points;
            }
            await user.save();
        }
        // const userId = findSubmission.User
        // const assignmentId=findSubmission.Assignment
        // const challengeId=findSubmission.Challenge
        // const user = await User.findById(userId)
        // console.log(assignmentId)
        // console.log(challengeId)
        // if(challengeId){
        //     console.log("challenge")
        //     const challenge = await Challenge.findById(challengeId)
        //     const points = challenge.points
        //     const CourseId = challenge.courseId
        //     findSubmission.marksObtained-=points
        //     const courseIndex = user.Totalpoints.findIndex(
        //         (entry:any) => entry.courseId.toString() === CourseId.toString()
        //     );

        //     if (courseIndex >= 0) {
        //         user.Totalpoints[courseIndex].points -= points;
        //         if(user.Totalpoints[courseIndex].points<=0){
        //             user.Totalpoints.pull({CourseId});
        //         }
        //     } 
        // }
        // if(assignmentId){
        //     console.log("assignment")
        //     const assignment =await Assignment.findById(assignmentId)
        //     const points = assignment.totalPoints
        //     const CourseId = assignment.Course
        //     findSubmission.marksObtained = points
        //     const courseIndex = user.Totalpoints.findIndex(
        //         (entry:any) => entry.courseId.toString() === CourseId.toString()
        //     );

        //     if (courseIndex >= 0) {
        //         user.Totalpoints[courseIndex].points -= points;
        //         if(user.Totalpoints[courseIndex].points<=0){
        //             user.Totalpoints.pull({CourseId});
        //         }
        //     }
        // }
        // await user.save()
        await findSubmission.save()

        return new NextResponse(JSON.stringify({ message: "Successfully submission disapproved", submission: findSubmission }), { status: 200 })
    } catch (error: any) {
        console.log(error)
        return new NextResponse(JSON.stringify({ message: "Error while disapproving to a assignment submission", error: error.message }), { status: 500 })
    }
}

