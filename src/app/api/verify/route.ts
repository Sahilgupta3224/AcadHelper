import { NextRequest,NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/userModel'; 
import {connect} from '@/dbConfig/dbConfig';
export async function GET(request: NextRequest) {
  await connect();
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
}
  try {
    const decoded: any = jwt.verify(token as string, process.env.TOKEN_SECRET!);
    const user = await User.findById(decoded.userId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 400 });
      }
      
      user.isEmailVerified = true;
      await user.save();
      return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
  }
