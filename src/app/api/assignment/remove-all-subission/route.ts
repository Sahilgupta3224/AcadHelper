import { connect } from '@/dbConfig/dbConfig';
import Assignment from '@/models/assignmentModel';
import Course from '@/models/courseModel';
import User from '@/models/userModel';
import Submission from '@/models/submissionModel';
import { Types } from 'mongoose';
import { NextResponse } from 'next/server';

// Remove all specified submissions
export const PATCH = async (request: Request) => {
    try {
        const { userId, assignmentId, submissions } = await request.json();

        await connect();

        // Input validation
        if (!userId || !assignmentId || !submissions) {
            return new NextResponse(JSON.stringify({ message: "Enter all the credentials" }), { status: 404 });
        }

        // Verify the IDs
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(assignmentId)) {
            return new NextResponse(JSON.stringify({ message: "Enter a valid Id" }), { status: 404 });
        }

        // Verify admin authorization
        const userAdmin = await User.findById(userId);
        if (!userAdmin) {
            return new NextResponse(JSON.stringify({ message: "User not found" }));
        }

        if (!userAdmin.isAdmin) {
            return new NextResponse(JSON.stringify({ message: "Only Admin allowed to remove submissions" }), { status: 400 });
        }

        // Find the assignment
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return new NextResponse(JSON.stringify({ message: "Assignment not found" }));
        }

        const courseId = assignment.Course;
        const course = await Course.findById(courseId);

        // Check for valid Course ID
        if (!Types.ObjectId.isValid(courseId)) {
            return new NextResponse(JSON.stringify({ message: "courseId not valid" }));
        }

        if (!course) {
            return new NextResponse(JSON.stringify({ message: "The course could not be found" }), { status: 500 });
        }

        if (!course.Instructors.includes(userId)) {
            return new NextResponse(JSON.stringify({ message: "Admin not in charge of the course" }), { status: 500 });
        }

        // Arrays to hold affected users and removed submissions
        const usersAffected = [];
        const removedSubmissions = [];

        for (const submissionId of submissions) {
            // Find the submission
            const findSubmission = await Submission.findById(submissionId);

            if (!findSubmission) {
                return new NextResponse(JSON.stringify({ message: "Submission doesn't exist" }));
            }

            // Find the user who made the submission
            const user = await User.findById(findSubmission.User);
            if (!user) {
                continue;
            }

            // Remove submission reference from user's arrays
            user.submissions = user.submissions.filter(sub => sub.toString() !== submissionId);
            user.pendingAssignments = user.pendingAssignments.filter(assign => assign.assignmentId.toString() !== assignmentId);
            user.completedAssignments = user.completedAssignments.filter(assign => assign.assignmentId.toString() !== assignmentId);
            await user.save();

            // Remove submission from assignment's submissions list
            assignment.submissions = assignment.submissions.filter(sub => sub.toString() !== submissionId);
            await assignment.save();

            // Delete the submission
            await Submission.findByIdAndDelete(submissionId);

            usersAffected.push(user);
            removedSubmissions.push({ submissionId });
        }

        return new NextResponse(
            JSON.stringify({
                message: "Successfully removed all specified submissions",
                submissionsRemoved: removedSubmissions,
                usersUpdated: usersAffected
            }),
            { status: 200 }
        );

    } catch (error: any) {
        console.log("Error while removing submissions");
        return new NextResponse(
            JSON.stringify({ message: "Error while removing submissions", error: error.message }),
            { status: 500 }
        );
    }
};
