import { connect } from '@/dbConfig/dbConfig';
import Course from '@/models/courseModel'
import User from '@/models/userModel';
import mongoose from 'mongoose';
import Assignment from '@/models/assignmentModel';
import { NextRequest, NextResponse } from 'next/server';

//GET one course from course id
export async function GET(
  request: NextRequest,
  context: { params: { courseId: string } }
) {
  try {
    const { courseId } = context.params;
    await connect();

    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 400 });
    }

    return NextResponse.json({ course, success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

// Leave a course
export async function DELETE(request: NextRequest, context: { params: { courseId: string } }) {
    try {
        const { userId } = await request.json();
        const { courseId } = context.params;

        await connect();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { Courses: { courseId } } },
            { new: true }
        );
        if (!updatedUser)
            return NextResponse.json({ error: 'User not found' }, { status: 400 });

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $pull: { StudentsEnrolled: userId } },
            { new: true }
        );
        if (!updatedCourse)
            return NextResponse.json({ error: 'Course not found' }, { status: 400 });

        const assignments = await Assignment.find({ Course: courseId });
        const assignmentIds = assignments.map(a => a._id);

        const updatedUserWithAssignments = await User.findByIdAndUpdate(
            userId,
            { $pull: { pendingAssignments: { assignmentId: { $in: assignmentIds } } } },
            { new: true }
        );

        if (!updatedUserWithAssignments)
            return NextResponse.json({ error: 'User not found' }, { status: 400 });

        return NextResponse.json({ updatedUserWithAssignments, success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}