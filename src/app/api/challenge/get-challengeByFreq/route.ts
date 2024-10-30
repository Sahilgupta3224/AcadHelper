import Challenge from '@/models/challengeModel'
import { NextResponse } from 'next/server'
import { connect } from '@/dbConfig/dbConfig'


// api to get the challenge by freq

export const GET = async (request:Request) =>{

    try {
        const {freq} = await request.json()

        await connect();

        const challenges = await Challenge.find({frequency:freq})

        if(!challenges)
            {
                return new NextResponse(JSON.stringify({message:"Error while fetching the challenges"}),{status:500})
            }
    
        return new NextResponse(JSON.stringify({message:"Challenges fetched successfully ",challenges}),{status:200})
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log("Error while fetching challenges by freq",error)
        return new NextResponse(JSON.stringify({message:"Error while fetching challenges by freq"}),{status:500})
        
    }
}