import User from "@/models/userModel";

import {connect} from '@/dbConfig/dbConfig'
import { NextResponse } from "next/server";


// Get all users
export async function GET(request: Request) {
    try {
        await connect();
        const users = await User.find()
        return NextResponse.json({ success:true,message: "Users found successfully", users }, { status: 200 });

    } catch (error) {
        console.error("Error while fetching the user by username", error);
        return NextResponse.json({ message: "Error while fetching users", error }, { status: 500 });
    }
}
