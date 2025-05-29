import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from '@/dbConfig/dbConfig';

connect();

export async function PUT(req: NextRequest) {
  try {
    const { institute, userId } = await req.json();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.institute = institute;

    await user.save();

    return NextResponse.json({ message: "User updated successfully", user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
