import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Challenge from "@/Interfaces/challenge";
import Submission from "@/Interfaces/submission";
import '../../app/globals.css';
import toast, { Toaster } from 'react-hot-toast';

const ChallengeDetails: React.FC = () => {
  const router = useRouter();
  const { query } = router
  console.log(query)
  const { id } = router.query;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [yo, setyo] = useState(false);
  console.log(id)
  const challengeId = typeof id === 'string' ? id : '';
  useEffect(() => {
    if (challengeId) {
      const fetchChallenge = async () => {
        try {
          const response = await axios.get(`/api/challenge/getchallengeById?Id=${challengeId}`);
          setChallenge(response.data.data);
        } catch (error) {
          console.error("Error fetching challenge details:", error);
        }
      };
      fetchChallenge();
    }
  }, [challengeId]);

  useEffect(() => {
    if (challengeId) {
      const fetchSubmissions = async () => {
        try {
          const submissionsResponse = await axios.get(`/api/submission/getsubmissionbychallenge?challengeId=${challengeId}`);
          setSubmissions(submissionsResponse.data.data);
        } catch (error) {
          console.error("Error fetching submissions:", error);
        }
      };
      fetchSubmissions();
    }
  }, [challengeId, yo]);
  const approve = async (id: string) => {
    try {
      const response = await axios.patch(`/api/submission/approve-a-submission?Id=${id}`);
      console.log(response.data)
      setyo(!yo);
    }
    catch (e: any) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Error while approving:", e);
    }
  }
  const deletesub = async (id: string) => {
    try {
      const response = await axios.patch(`/api/submission/remove-submission?Id=${id}`);
      console.log(response.data)
      setyo(!yo);
    }
    catch (e: any) {
      // if (e.response && e.response.status === 400) {
      //   toast.error(e.response.data.message);
      // } else {
      //   toast.error("An unexpected error occurred. Please try again.");
      // }
      console.error("Error while removing:", e);
    }
  }
  const disapprove = async (id: string) => {
    try {
      const response = await axios.patch(`/api/submission/disapprove-submission?Id=${id}`);
      console.log(response.data)
      setyo(!yo);
    }
    catch (e: any) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Error while approving:", e);
    }
  }
  
  const approveall = async () => {
    try {
      const response = await axios.patch(`/api/submission/approve-all-submission-challenge?Id=${challengeId}`);
      console.log(response.data)
      setyo(!yo);
    }
    catch (e: any) {
      if (e.response && e.response.status === 400) {
        toast.error(e.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Error while approving:", e);
    }
  }

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
                <a href={challenge.challengeDoc} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  View Document
                </a>
              </div>
            )}
          </div>
        </div>
        {/* <button
          onClick={() => { approveall(challengeId) }}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Approve All Submissions
        </button> */}
        <button
          onClick={approveall}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Approve All Submissions
        </button>
        <h2 className="text-xl font-semibold mb-4">Submissions</h2>
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <div key={submission._id} className="mb-2 flex justify-between p-4 border-b">
              <div>
                <a href={submission.documentLink} className="text-blue-500 cursor-pointer"> Submission link </a>
              </div>
              <button onClick={() => { approve(submission._id) }}>
                Approve
              </button>
              <button onClick={() => { disapprove(submission._id) }}>
                Disapprove
              </button>
              <button onClick={() => { deletesub(submission._id) }}>
                Delete
              </button>
              <a onClick={() => router.push(`/Submission/${submission._id}`)} className="text-blue-500  cursor-pointer">
                View Submission Details
              </a>
            </div>
          ))
        ) : (
          <p>No submissions found for this challenge.</p>
        )}

        <button
          onClick={() => router.push(`/admin/Courses`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Back to Challenges
        </button>
      </div>
    </div>
  );
};

export default ChallengeDetails;