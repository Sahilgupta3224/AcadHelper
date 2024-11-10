import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest){
    try {
        await connect()

        const reqBody = await request.json()
        const {email, password} = reqBody;
        if(!email||!password){
            return NextResponse.json({error: "Fill all fields!"}, {status: 400})
        }
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        const validPassword = await bcryptjs.compare(password, user.password)                   // Compare the provided password with the stored hashed password
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        const tokenData = {                                                                     // Create the payload for the JWT token
            id: user._id,
            username: user.username,
            email: user.email
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
        const response = NextResponse.json({                                                    // Create the response and set the token in a cookie
            message: "Login successful",
            user,
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true, 
        })
        return response;
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}