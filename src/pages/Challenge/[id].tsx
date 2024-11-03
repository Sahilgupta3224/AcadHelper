import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Challenge from "@/Interfaces/challenge";
import '../../app/globals.css';

const ChallengeDetails: React.FC = () => {
    const router = useRouter();
    const {query}=router
    console.log(query)
    const { id } = router.query;
    const [challenge, setChallenge] = useState<Challenge | null>(null);
  console.log(id)
    useEffect(() => {
      if (id) {
        const fetchChallenge = async () => {
          try {
            const response = await axios.get(`/api/challenge/getchallengeById?Id=${id}`);
            console.log(response.data)
            setChallenge(response.data.data);
          } catch (error) {
            console.error("Error fetching challenge details:", error);
          }
        };
        fetchChallenge();
      }
    }, [id]);
  
    if (!challenge) return <div>Loading...</div>;
  
    return (
      <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
          <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>
          <p className="text-gray-700 mb-4">{challenge.description}</p>
          <div className="mb-4">
            <span className="font-semibold">Type:</span> {challenge.type}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Frequency:</span> {challenge.frequency}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Points:</span> {challenge.points}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Start Date:</span> {new Date(challenge.startDate).toLocaleDateString()}
          </div>
          <div className="mb-4">
            <span className="font-semibold">End Date:</span> {new Date(challenge.endDate).toLocaleDateString()}
          </div>
          {/* <div className="mb-4">
            <span className="font-semibold">Created By:</span> {challenge.createdBy}
          </div> */}
          {challenge.challengeDoc && (
            <div className="mb-4">
              <span className="font-semibold">Challenge Document:</span>{" "}
              <a href={challenge.challengeDoc} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                View Document
              </a>
            </div>
          )}
          <button
            onClick={() => router.push(`/challenges`)} // Adjust the route as needed
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  };
  
  export default ChallengeDetails;