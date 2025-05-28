import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { email } = reqBody;

    if (!email) {
      return NextResponse.json({ error: "Fill all fields!" }, { status: 400 });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Get the part before @ as default password
      const defaultPassword = email.split("@")[0];
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(defaultPassword, salt);

      const newUser = new User({
        email,
        password: hashedPassword,
      });
      user = await newUser.save();

      // Create JWT token
      const tokenData = {
        id: user._id,
        username:defaultPassword,
        email: user.email,
      };
      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

      // Optionally, you can set the token in the user object if your model supports it
      // user.token = token;

      const response = NextResponse.json({
        message: "User created successfully", 
        user,
        token,
        success: true,
      });
      response.cookies.set("token", token, {
        httpOnly: true,
      });
      return response;
    }

    // If user exists, login as usual
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });
    // user.token = token;


    const response = NextResponse.json({
      message: "Login successful",
      user,
      token,
      success: true,
    });
  
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
