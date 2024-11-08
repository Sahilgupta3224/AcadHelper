import User from "@/models/userModel";

import {connect} from '@/dbConfig/dbConfig'
import { NextResponse } from "next/server";


// Get all users as per filter
export async function GET(request: Request) {
    try {
        const {searchParams}=new URL(request.url)
        const filter = searchParams.get("filter")
        await connect();
        const users = await User.find({institute:filter})
        return NextResponse.json({ success:true,message: "Users found successfully", users }, { status: 200 });

    } catch (error) {
        console.error("Error while fetching the user by username", error);
        return NextResponse.json({ message: "Error while fetching users", error }, { status: 500 });
    }
}
