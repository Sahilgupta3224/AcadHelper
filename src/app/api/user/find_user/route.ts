import User from "@/models/userModel";

import {connect} from '@/dbConfig/dbConfig'
import { NextResponse } from "next/server";


/// Get user by username
export async function POST(request: Request) {
    try {
        await connect();

        // const {searchParams}=new URL(request.url)
        // const username= searchParams.get("username")
        const {username}=await request.json()
        // console.log(username)

        const user = await User.findOne({username})

        if (!user) {
            return NextResponse.json({ message: "User with given username not found" }, { status: 400 });
        }

        // Return the found user
        return NextResponse.json({ message: "User found successfully", user }, { status: 200 });

    } catch (error) {
        console.error("Error while fetching the user by username", error);
        return NextResponse.json({ message: "Error while fetching the user by username", error }, { status: 500 });
    }
}
