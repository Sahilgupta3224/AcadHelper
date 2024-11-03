import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Challenge from "@/Interfaces/challenge";
import Submission from "@/Interfaces/submission";
import '../../app/globals.css';

const ChallengeDetails: React.FC = () => {
    const router = useRouter();
    const {query}=router
    console.log(query)
    const { id } = router.query;
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
  console.log(id)
    useEffect(() => {
      if (id) {
        const fetchChallenge = async () => {
          try {
            const response = await axios.get(`/api/challenge/getchallengeById?Id=${id}`);
            console.log(response.data)
            setChallenge(response.data.data);
            const submissionPromises = response.data.data.submissions.map((submissionId: string) => 
              axios.get(`/api/submission?Id=${submissionId}`)
            );
            const submissionsResponse = await Promise.all(submissionPromises);
            setSubmissions(submissionsResponse.map(res => res.data.data));
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
            <div>
                <div className="flex justify-between mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-center">{challenge.title}</h1>
                        <p className="text-gray-700 text-center">{challenge.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
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
                        {challenge.challengeDoc && (
                            <div className="mb-4">
                                <span className="font-semibold">Challenge Document:</span>{" "}
                                <a href={challenge.challengeDoc} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    View Document
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <h2 className="text-xl font-semibold mb-4">Submissions</h2>
                {submissions.length > 0 ? (
                    submissions.map((submission) => (
                        <div key={submission._id} className="mb-2 flex justify-between p-4 border-b">
                            <div>
                                <span className="font-semibold">Submitted At:</span> {new Date(submission.submittedAt).toLocaleString()}
                            </div>
                            <a href={submission.documentLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                View Submission Document
                            </a>
                        </div>
                    ))
                ) : (
                    <p>No submissions found for this challenge.</p>
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