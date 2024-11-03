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
  
  