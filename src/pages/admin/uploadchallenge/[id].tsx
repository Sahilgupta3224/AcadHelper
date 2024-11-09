import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import '../../../app/globals.css';
import toast from 'react-hot-toast';
import Auth from '@/components/Auth'
import { useStore } from "@/store";

const UploadChallenge: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [challengeDoc, setChallengeDoc] = useState("");
  const [type, setType] = useState("");
  const [frequency, setFrequency] = useState("");
  const [points, setPoints] = useState<number | undefined>();
  const [courseId, setCourseId] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const { user, setUser } = useStore();
  const { id } = router.query;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/challenge/uploadchallenge", {
        title,
        description,
        startDate,
        endDate,
        challengeDoc,
        type,
        frequency,
        points,
        createdBy: user._id,
        courseId: id,
      });
      console.log(response.data);
      toast.success("Challenge uploaded successfully!");
      router.push(`/Challenge/${response.data.Challenge._id}`);
    } catch (error: any) {
      toast.error("Error uploading challenge. Please try again.");
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Upload Challenge</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow-md"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="url"
          placeholder="Challenge Document Link"
          value={challengeDoc}
          onChange={(e) => setChallengeDoc(e.target.value)}
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "individual" | "team")}
          required
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="individual">Individual</option>
          <option value="team">Team</option>
        </select>

        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
          required
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <input
          type="number"
          placeholder="Points"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value))}
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit Challenge
        </button>
      </form>
    </div>
  );
};

export default Auth(UploadChallenge);
