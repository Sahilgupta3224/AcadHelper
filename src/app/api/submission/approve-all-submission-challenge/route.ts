import { connect } from '@/dbConfig/dbConfig';
import Assignment from '@/models/assignmentModel';
import Course from '@/models/courseModel';
import User from '@/models/userModel';
import Submission from '@/models/submissionModel';
import Challenge from '@/models/challengeModel';
import Team from '@/models/teamModel';
import { NextResponse } from 'next/server';

connect();

// Approve all submissions for a specific challenge
export const PATCH = async (request: Request) => {
    try {
        const url = new URL(request.url);
        const challengeId = url.searchParams.get('challengeId');

        if (!challengeId) {
            return new NextResponse(JSON.stringify({ message: "Challenge ID is required" }), { status: 400 });
        }

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return new NextResponse(JSON.stringify({ message: "Challenge not found" }), { status: 404 });
        }

        const points = challenge.points;
        const courseId = challenge.courseId;

        const submissions = await Submission.find({ Challenge: challengeId });

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
                                (entry: any) => entry.courseId.toString() === courseId.toString()
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

        return new NextResponse(JSON.stringify({ message: "All submissions approved successfully" }), { status: 200 });
    } catch (error: any) {
        console.log(error);
        return new NextResponse(JSON.stringify({ message: "Error while approving all submissions", error: error.message }), { status: 500 });
    }
};