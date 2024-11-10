import Submission from "@/models/submissionModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    if (!user.submissions || !Array.isArray(user.submissions)) {
      return NextResponse.json({ message: "No submissions found for the user" }, { status: 400 });
    }

    const submissions = [];

    for (const submissionId of user.submissions) {
      // Use `findById()` with `populate()` to populate fields in the `Submission` model.
      const submission = await Submission.findById(submissionId)
        .populate('User')
        .populate('Course')
        .populate('Assignment')
        .populate('Challenge')

      if (submission) {
        submissions.push(submission);
      }
    }

    return NextResponse.json(
      { message: "Successfully fetched the submissions", submissions },
      { status: 200 }
    );
  } catch (error:any) {
    console.error("Error while fetching the submissions of user:", error);
    return NextResponse.json(
      { message: "Error while fetching the submissions of user", error: error.message || error },
      { status: 500 }
    );
  }
}
