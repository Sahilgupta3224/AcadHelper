import { connect } from "@/dbConfig/dbConfig";

export async function POST(request:Request)
{
    try {
        await connect()
        const {userId,assignmentId,submissionId}=await request.json()
    } catch (error) {
        console.log("Marking the submission was not successfull",error)
    }
}