import Challenge from "@/models/challengeModel";
import User from "@/models/userModel";
import Submission from "@/models/submissionModel";
import Assignment from "@/models/assignmentModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from '@/dbConfig/dbConfig'
import Team from "@/models/teamModel";
import CourseModel from "@/models/courseModel";

connect()

// All the badges specific to submission along with their contraints

const badgeCriteria = [
    {
        title: "Consistent_Solver_30",
        condition: (user, courseId) => {

            
            
            const challengesSolved = user.challengessolved
                .filter((challenge) => challenge.courseId.toString() === courseId)
                .sort((a, b) => new Date(a.solvedAt) - new Date(b.solvedAt));

            let maxStreak = 0;
            let currentStreak = 1;

            for (let i = 1; i < challengesSolved.length; i++) {
                const currDay = new Date(challengesSolved[i].solvedAt);
                const prevDay = new Date(challengesSolved[i - 1].solvedAt);
                const diffInDays = (currDay - prevDay) / (1000 * 3600 * 24);

                if (diffInDays === 1) {
                    currentStreak += 1;
                } else if (diffInDays > 1) {
                    currentStreak = 1;
                }
                maxStreak = Math.max(maxStreak, currentStreak);
            }

            return maxStreak>=30;
        },
        courseSpecific: true, 
    },
    {
        title: "Consistent_Solver_90",
        condition: (user, courseId) => {

            
            
            const challengesSolved = user.challengessolved
                .filter((challenge) => challenge.courseId.toString() === courseId)
                .sort((a, b) => new Date(a.solvedAt) - new Date(b.solvedAt));

            let maxStreak = 0;
            let currentStreak = 1;

            for (let i = 1; i < challengesSolved.length; i++) {
                const currDay = new Date(challengesSolved[i].solvedAt);
                const prevDay = new Date(challengesSolved[i - 1].solvedAt);
                const diffInDays = (currDay - prevDay) / (1000 * 3600 * 24);

                if (diffInDays === 1) {
                    currentStreak += 1;
                } else if (diffInDays > 1) {
                    currentStreak = 1;
                }
                maxStreak = Math.max(maxStreak, currentStreak);
            }

            return maxStreak >= 90;
        },
        courseSpecific: true, 
    }
];


// Check badge eligibility based on defined criteria
async function checkAndAwardBadges(userId, courseId) {
    const user = await User.findById(userId);

    for (const badge of badgeCriteria) {
        if (badge.courseSpecific && badge.condition(user, courseId)) {
            

            //check whether user already has the badge or not
            const hasBadge = user.badges.some(
                (userBadge:any) => (userBadge.title === badge.title && userBadge.course === courseId)
            );

            // badges pics will be kept with badges names
            if (!hasBadge) {
                const badgeToAdd = {
                    title: badge.title,
                    course: courseId,
                    image: `${badge.title}.png`
                };

                await User.findByIdAndUpdate(userId, {
                    $push: {
                        badges: badgeToAdd,
                        inbox: {
                            type: "badge",
                            message: `Congratulations! You've earned the ${badge.title} badge!`,
                            date: new Date()
                        }
                    }
                });

                console.log(`${badge.title} badge awarded and notification sent.`);
            }
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { user, assignment, challenge, documentLink, Course, type, groupId } = data;

        if (!user || !documentLink) {
            return NextResponse.json({
                success: false,
                message: "User and documentLink are required.",
            }, { status: 400 });
        }

        console.log("Course", Course);
        const courseId = Course;
        let newSubmission
        // Create and save the new submission
        if(!groupId){
            newSubmission = new Submission({
                User: user,
                Assignment: assignment,
                Challenge: challenge,
                documentLink,
                submittedAt: new Date(),
                Course,
                type,
                // groupId
            });
        }
        else{
            newSubmission = new Submission({
                User: user,
                Assignment: assignment,
                Challenge: challenge,
                documentLink,
                submittedAt: new Date(),
                Course,
                type,
                groupId
            });
        }
        await newSubmission.save();

        // Update user submissions (individual or group)
        if (groupId) {
            const team = await Team.findById(groupId);
            if (team) {
                const members = team.Members.map((member) => member.memberId);
                for (const member of members) {
                    await User.findByIdAndUpdate(member, { $push: { submissions: newSubmission._id } }, { new: true });
                    await checkAndAwardBadges(member, courseId); 
                }
            }
        } else {
            await User.findByIdAndUpdate(user, { $push: { submissions: newSubmission._id } }, { new: true });
            await checkAndAwardBadges(user, courseId); 
        }

        // Handle assignment updates and extra points
        if (assignment) {
            const updatedAssignment = await Assignment.findByIdAndUpdate(assignment, { $push: { submissions: newSubmission._id } }, { new: true });

            if (updatedAssignment) {
                if (updatedAssignment.dueDate > Date.now()) {
                    const daysLeft = getDaysBetweenDates(updatedAssignment.dueDate, Date.now());
                    const totalDays = getDaysBetweenDates(updatedAssignment.dueDate, updatedAssignment.uploadedAt);
                    const extraPoints = Math.floor((updatedAssignment.totalPoints / totalDays) * daysLeft * 0.5);

                    if (groupId) {
                        const team = await Team.findById(groupId);
                        if (team) {
                            const members = team.Members.map((member) => member.memberId);
                            for (const member of members) {
                                await User.updateOne({ _id: member, "Totalpoints.courseId": updatedAssignment.Course }, { $inc: { "Totalpoints.$.points": extraPoints / members.length } });
                            }
                        }
                    } else {
                        await User.updateOne({ _id: user, "Totalpoints.courseId": updatedAssignment.Course }, { $inc: { "Totalpoints.$.points": extraPoints } });
                    }
                }
            }
        }

        if (challenge) {
            await Challenge.findByIdAndUpdate(challenge, { $push: { submissions: newSubmission._id } }, { new: true });
        }

        return NextResponse.json({
            success: true,
            data: newSubmission,
            message: "Submission added successfully.",
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error while adding submission:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to add submission.",
            error: error.message,
        }, { status: 500 });
    }
}

function getDaysBetweenDates(date1:Date, date2:Date) {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime= Math.abs(date2 - date1);
    return Math.floor(diffInTime / oneDay);
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const Id = url.searchParams.get('Id');
        if(!Id){
            return NextResponse.json({
                success: false,
                message: "Invalid Id",
            }, { status: 400 });
        }
        const submission = await Submission.findById(Id);
        console.log(Id)
        if(!submission){
            return NextResponse.json({
                success: false,
                message: "submission not found",
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data: submission,
        });
    } catch (error: any) {
        console.error("Error fetching submission:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch submission.",
            error: error.message,
        }, { status: 500 });
    }
}