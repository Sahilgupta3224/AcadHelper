import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Submission from "@/Interfaces/submission";
import Assignment from "@/Interfaces/assignment";
import '../../../app/globals.css';
import toast, { Toaster } from 'react-hot-toast';
import { CldUploadWidget } from 'next-cloudinary';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import { useStore } from "@/store";

interface EditAssignment {
    title: string;
    description?: string;
    DueDate?: Date;
    AssignmentDoc: string;
    totalPoints: number;
    status: "Open" | "Closed" | "Graded";
}


const AssignmentDetails: React.FC = () => {
    const router = useRouter();
    const { query } = router
    const { user, setUser } = useStore()
    console.log(query)
    const { id } = router.query;
    const [assignmentDoc, setAssignmentDoc] = useState("")
    const [assignment, setassignment] = useState<Assignment | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [yo, setyo] = useState(false);
    const [isDocVisible, setIsDocVisible] = useState<boolean>(false);
    const [show, setShow] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    const [editedassignment, seteditedassignment] = useState<EditAssignment | null>(null);
    console.log(id)
    const assignmentId = typeof id === 'string' ? id : '';
    useEffect(() => {
        if (assignmentId) {
            const fetchAssignment = async () => {
                try {
                    const response = await axios.get(`/api/assignment/getassignmentById?Id=${assignmentId}`);
                    setassignment(response.data.data);
                } catch (error) {
                    console.error("Error fetching challenge details:", error);
                }
            };
            fetchAssignment();
        }
    }, [assignmentId]);

    useEffect(() => {
        if (assignmentId) {
            const fetchSubmissions = async () => {
                try {
                    const submissionsResponse = await axios.get(`/api/submission/getsubmissionbyassignmentanduser?assignmentId=${assignmentId}&userId=${user._id}`);
                    setSubmissions(submissionsResponse.data.data);
                    console.log(submissionsResponse)
                } catch (error) {
                    console.error("Error fetching submissions:", error);
                }
            };
            fetchSubmissions();
        }
    }, [assignmentId, yo]);

    const deletesub = async (id: string) => {
        try {
            const response = await axios.patch(`/api/submission/remove-submission?Id=${id}`);
            console.log(response.data)
            setyo(!yo);
        }
        catch (e: any) {
            console.error("Error while removing:", e);
        }
    }

   
    const handleEditsub= async (id: string) => {
        const submitwala = {
            documentLink: assignmentDoc
        }
        try {
            const response = await axios.patch(`/api/submission/edit-submission?Id=${id}`, submitwala);
            console.log(response.data)
            setAssignmentDoc("")
            setIsDocVisible(false);
            setyo(!yo);
        }
        catch (e: any) {
            console.error("Error while removing:", e);
        }
    }

    const handlesub = async () => {
        const submitwala = {
            user: user._id,
            assignment: assignmentId,
            documentLink: assignmentDoc
        }
        try {
            const response = await axios.post('/api/submission', submitwala);
            console.log(response.data)
            setAssignmentDoc("")
            setIsDocVisible(false);
            setyo(!yo);
        }
        catch (e: any) {
            console.error("Error while removing:", e);
        }
    }

    const handleUpload = (result: any) => {
        if (result && result.info) {
            setAssignmentDoc(result.info.url)
            setIsDocVisible(true);
            console.log("Upload result info:", result.info);
        } else {
            console.error("Upload failed or result is invalid.");
        }
    };

    if (!assignment) return <div>Loading...</div>;
    console.log(submissions[0])
    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5">
            <div>
                <div className="flex justify-between mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-center">{assignment.title}</h1>
                        <p className="text-gray-700 text-center">{assignment.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="mb-4">
                            <span className="font-semibold">Frequency :</span> {assignment.status}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Points :</span> {assignment.totalPoints}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Due Date :</span> {new Date(assignment.DueDate || new Date()).toLocaleDateString()}
                        </div>
                        {assignment.AssignmentDoc && (
                            <div className="mb-4">
                                <span className="font-semibold">Assignment :</span>{" "}
                                <a href={assignment.AssignmentDoc} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                    View Document
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                
                <button
                    onClick={() => (submissions.length > 0 ? handleEditsub(submissions[0]._id) : handlesub())}
                    className="mb-4 ml-4 mr-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    {submissions.length > 0 ? "Edit Submission" : "Submit Assignment"}
                </button>
                <CldUploadWidget uploadPreset="acad_helper_pdf" onSuccess={handleUpload}>
                    {({ open }) => (
                        <Button className="mt-4" onClick={() => open()} variant="outlined" color="primary">
                            Select File
                        </Button>
                    )}
                </CldUploadWidget>

                {isDocVisible && assignmentDoc && (
                    <div>
                        <a href={assignmentDoc} className="text-blue-500 " target="_blank" rel="noopener noreferrer">
                            View Uploaded Document
                        </a>
                    </div>
                )}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Submissions</h2>
                    {submissions.length > 0 ? (
                        submissions.map((submission) => (
                            <div key={submission._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        {/* <p><strong>Submitted By:</strong> {submission.user.name}</p> */}
                                        <p><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                                    </div>
                                    <a href={submission.documentLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        View Submission
                                    </a>
                                    <Button onClick={()=>{deletesub(submission._id)}}>Delete submission</Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No submissions yet.</p>
                    )}
                </div>
                <button
                    onClick={() => router.push(`/admin/Courses`)}
                    className="mt-4 ml-7 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Back to assignments
                </button>
            </div>
        </div>
    );
};

export default AssignmentDetails;