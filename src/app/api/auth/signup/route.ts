import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken';
import sendEmail from '@/utils/mailhandler'

function generateVerificationToken(userId: string) {
  return jwt.sign({ userId }, process.env.TOKEN_SECRET!, {
    expiresIn: '1h', // Token expires in 1 hour
  });
}

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {username, email, password, institute} = reqBody
        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error: "User with this email already exists"}, {status: 400})
        }
        const user2 = await User.findOne({username})
        if(user2){
            return NextResponse.json({error: "User with this username already exists"}, {status: 400})
        } 
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        const newUser = new User({
            username,email,
            password:hashedPassword,
        })
        const savedUser = await newUser.save()
        const token = generateVerificationToken(newUser._id);
        await sendEmail(newUser.email, token);
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}