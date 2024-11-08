import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {username, email, password} = reqBody
        if(!email||!username||!password){
            return NextResponse.json({error: "Fill all fields"}, {status: 400})
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }
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
            password:hashedPassword
        })
        const savedUser = await newUser.save()
        console.log(savedUser);
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}