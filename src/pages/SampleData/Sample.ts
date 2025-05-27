export const sampleChapters = [
  {
    id:12,  
    name: "Introduction to Programming",
    assignments: [],  // Will be filled with assignment ObjectIds after Assignment creation
    courseId: "63456abcd1234567890efghi",  // Sample ObjectId for the associated Course
  },
  {
    id:14,
    name: "Data Structures",
    assignments: [],
    courseId: "63456abcd1234567890efghi",
  },
  {
    id:26,
    name: "Web Development Basics",
    assignments: [],
    courseId: "63456abcd1234567890efghi",
  }
];

export const UserLoggedIn={
      username: "john_doe",
      email: "john.doe@example.com",
      password: "securepassword123", // Make sure to hash passwords in production
      avatar: "http://example.com/avatar.jpg",
      isVerified: true,
      isAdmin: false,
      Courses: [
        {
          courseId: "63456abcd1234567890efghi", 
          enrolledAt: new Date("2024-10-07"),
          color: "#FF5733", // Example color
        },
      ],
      pendingAssignments: [
        {
          assignmentId: "29", // Replace with actual Assignment ObjectId
          dueDate: new Date("2024-12-01"), // Example due date
        },
      ],
      completedAssignments: [
      //   {
      //     assignmentId: new mongoose.Types.ObjectId(), // Replace with actual Assignment ObjectId
      //     completedAt: new Date(),
      //   },
      ],
      teams: [
      //   {
      //     teamId: new mongoose.Types.ObjectId(), // Replace with actual Team ObjectId
      //     joinedAt: new Date(),
      //   },
      ],
      pendingInvites: [
      //   {
      //     teamId: new mongoose.Types.ObjectId(), // Replace with actual Team ObjectId
      //     invitedAt: new Date(),
      //   },
      ],
      challengessolved: [
      //   {
      //     challengeId: new mongoose.Types.ObjectId(), // Replace with actual Challenge ObjectId
      //     solvedAt: new Date(),
      //   },
      ],
      submissions: [
      //   new mongoose.Types.ObjectId(), // Replace with actual Submission ObjectId
      ],
      CoursesAsAdmin: [
      //   new mongoose.Types.ObjectId(), // Replace with actual Course ObjectId
      ],
      tasks: [
      //   new mongoose.Types.ObjectId(), // Replace with actual Task ObjectId
      ],
      phone: "123-456-7890",
      gender: "Male",
      Branch: "Computer Science",
      forgotPasswordToken: null,
      forgotPasswordTokenExpiry: null,
      verifyToken: null,
      verifyTokenExpiry: null,
    
}
export const sampleAssignments = [
  {
    id:29,
    type:"submission",
    title: "Assignment 1: Variables and Data Types",
    description: "Introduction to data types and variables in programming.",
    uploadedAt: new Date(),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Due 1 week from now
    AssignmentDoc: "path/to/assignment1.pdf",
    Course: "63456abcd1234567890efghi", // Sample ObjectId for the associated Course
    totalPoints: 10,
    status: "Open",
    submissions: [],  // Will be filled with submission ObjectIds if needed
  },
  {
      id:24,
      type:"normal",
    title: "Assignment 2: Arrays and Strings",
    description: "Understanding arrays, strings, and their operations.",
    uploadedAt: new Date(),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    AssignmentDoc: "path/to/assignment2.pdf",
    Course: "63456abcd1234567890efghi",
    totalPoints: 15,
    status: "Open",
    submissions: [],
  },
  {
    id:35,
    type:"submission",
    title: "Assignment 3: Functions and Loops",
    description: "Implement functions and control loops effectively.",
    uploadedAt: new Date(),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    AssignmentDoc: "path/to/assignment3.pdf",
    Course: "63456abcd1234567890efghi",
    totalPoints: 20,
    status: "Open",
    submissions: [],
  }
];

export const dummyChallenges = [
  {
    _id: "challenge_1",
    title: "Challenge 1",
    description: "This is the description for Challenge 1",
    type: "individual",
    frequency: "daily",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    points: 10,
    createdBy: "User 1",
    courseId: "course_1",
    submissions: [],
  },
  {
    _id: "challenge_2",
    title: "Challenge 2",
    description: "This is the description for Challenge 2",
    type: "team",
    frequency: "weekly",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 4)),
    points: 20,
    createdBy: "User 2",
    courseId: "course_2",
    submissions: [],
  },
  {
    _id: "challenge_3",
    title: "Challenge 3",
    description: "This is the description for Challenge 3",
    type: "individual",
    frequency: "monthly",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 6)),
    points: 30,
    createdBy: "User 3",
    courseId: "course_3",
    submissions: [],
  },
  {
    _id: "challenge_4",
    title: "Challenge 4",
    description: "This is the description for Challenge 4",
    type: "team",
    frequency: "daily",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 8)),
    points: 40,
    createdBy: "User 4",
    courseId: "course_4",
    submissions: [],
  },
  {
    _id: "challenge_5",
    title: "Challenge 5",
    description: "This is the description for Challenge 5",
    type: "individual",
    frequency: "weekly",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    points: 50,
    createdBy: "User 5",
    courseId: "course_5",
    submissions: [],
  },
  {
    _id: "challenge_6",
    title: "Challenge 6",
    description: "This is the description for Challenge 6",
    type: "team",
    frequency: "monthly",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 12)),
    points: 60,
    createdBy: "User 6",
    courseId: "course_6",
    submissions: [],
  },
  {
    _id: "challenge_7",
    title: "Challenge 7",
    description: "This is the description for Challenge 7",
    type: "individual",
    frequency: "daily",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    points: 70,
    createdBy: "User 7",
    courseId: "course_7",
    submissions: [],
  },
  {
    _id: "challenge_8",
    title: "Challenge 8",
    description: "This is the description for Challenge 8",
    type: "team",
    frequency: "weekly",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 16)),
    points: 80,
    createdBy: "User 8",
    courseId: "course_8",
    submissions: [],
  },
  {
    _id: "challenge_9",
    title: "Challenge 9",
    description: "This is the description for Challenge 9",
    type: "individual",
    frequency: "monthly",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 18)),
    points: 90,
    createdBy: "User 9",
    courseId: "course_9",
    submissions: [],
  },
  {
    _id: "challenge_10",
    title: "Challenge 10",
    description: "This is the description for Challenge 10",
    type: "team",
    frequency: "daily",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 20)),
    points: 100,
    createdBy: "User 10",
    courseId: "course_10",
    submissions: [],
  },
];

export  const dummyUsers = [
  { _id: "user_1", username: "user_1", email: "user1@example.com", isVerified: true, isAdmin: false },
  { _id: "user_2", username: "user_2", email: "user2@example.com", isVerified: false, isAdmin: false },
  { _id: "user_3", username: "user_3", email: "user3@example.com", isVerified: true, isAdmin: true },
  { _id: "user_4", username: "user_4", email: "user4@example.com", isVerified: true, isAdmin: false },
  { _id: "user_5", username: "user_5", email: "user5@example.com", isVerified: false, isAdmin: false },
  { _id: "user_6", username: "user_6", email: "user6@example.com", isVerified: true, isAdmin: false },
  { _id: "user_7", username: "user_7", email: "user7@example.com", isVerified: false, isAdmin: true },
  { _id: "user_8", username: "user_8", email: "user8@example.com", isVerified: true, isAdmin: false },
  { _id: "user_9", username: "user_9", email: "user9@example.com", isVerified: false, isAdmin: false },
  { _id: "user_10", username: "user_10", email: "user10@example.com", isVerified: true, isAdmin: false },
];



export  const dummyAssignments = [
  {
    _id: "assignment_1",
    title: "Assignment 1",
    description: "This is the detailed description for Assignment 1",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    AssignmentDoc: "link/to/document1.pdf",
    totalPoints: 10,
    status: "Open",
  },
  {
    _id: "assignment_2",
    title: "Assignment 2",
    description: "This is the detailed description for Assignment 2",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 6)),
    AssignmentDoc: "link/to/document2.pdf",
    totalPoints: 20,
    status: "Closed",
  },
  {
    _id: "assignment_3",
    title: "Assignment 3",
    description: "This is the detailed description for Assignment 3",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    AssignmentDoc: "link/to/document3.pdf",
    totalPoints: 30,
    status: "Graded",
  },
  {
    _id: "assignment_4",
    title: "Assignment 4",
    description: "This is the detailed description for Assignment 4",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 4)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 8)),
    AssignmentDoc: "link/to/document4.pdf",
    totalPoints: 40,
    status: "Open",
  },
  {
    _id: "assignment_5",
    title: "Assignment 5",
    description: "This is the detailed description for Assignment 5",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 9)),
    AssignmentDoc: "link/to/document5.pdf",
    totalPoints: 50,
    status: "Closed",
  },
  {
    _id: "assignment_6",
    title: "Assignment 6",
    description: "This is the detailed description for Assignment 6",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 6)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    AssignmentDoc: "link/to/document6.pdf",
    totalPoints: 60,
    status: "Graded",
  },
  {
    _id: "assignment_7",
    title: "Assignment 7",
    description: "This is the detailed description for Assignment 7",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 7)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 11)),
    AssignmentDoc: "link/to/document7.pdf",
    totalPoints: 70,
    status: "Open",
  },
  {
    _id: "assignment_8",
    title: "Assignment 8",
    description: "This is the detailed description for Assignment 8",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 8)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 12)),
    AssignmentDoc: "link/to/document8.pdf",
    totalPoints: 80,
    status: "Closed",
  },
  {
    _id: "assignment_9",
    title: "Assignment 9",
    description: "This is the detailed description for Assignment 9",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 9)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 13)),
    AssignmentDoc: "link/to/document9.pdf",
    totalPoints: 90,
    status: "Graded",
  },
  {
    _id: "assignment_10",
    title: "Assignment 10",
    description: "This is the detailed description for Assignment 10",
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    AssignmentDoc: "link/to/document10.pdf",
    totalPoints: 100,
    status: "Open",
  },
];

// Next.js page default export
const SampleDataPage = () => null;
export default SampleDataPage;
