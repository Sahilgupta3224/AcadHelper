# AcadHelper

AcadHelper is a comprehensive academic assistance platform built using Next.js, designed to streamline educational management and enhance the learning experience. The platform offers a variety of features including course management, assignment tracking, and user submissions, making it a valuable tool for both educators and students.

AcadHelper was developed as part of the Codesangam Hackathon, under the event named Webster. This project showcases innovative solutions for education technology and exemplifies the power of team collaboration and coding proficiency demonstrated during the hackathon.

## Team Members
- [Shikhar Pandya](https://github.com/shikharpandya0487)
- [Khanak Patwari](https://github.com/Khanak21)
- [Sahil Gupta](https://github.com/Sahilgupta3224)

---
## Table of Contents

- [Deployment](#deployment)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Contributing](#contributing)
- [Project Pictures](#Project_Pictures)

## Deployment

The project is live and can be accessed here:  
🔗 [https://acadhelper.vercel.app/](https://acadhelper.vercel.app/)

## Features

- **User Management**: Register, log in, and manage user profiles with unique roles (admin, student).
- **Course Management**: Add, update, and track courses.
- **Assignment Tracking**: Manage assignments with details like due dates, submission status, and points.
- **Submission Handling**: Submit assignments and challenges with status tracking.
- **Event planning**: A built-in event scheduling feature to help users plan and organize academic events effectively, ensuring no important dates are missed.
- **Notification System**: Receive inbox messages for group invitations.
- **Email Verification**: Ensures that users verify their email addresses for account validation and security.
- **Admin Panel**: Dedicated interface for managing courses, users, and study materials.
- **Cloud Management** : Integration with Cloudinary for media storage and management.
- **Group Collaboration** : Includes shared task management, addition of members through invite requests, and submission to challenges as a team 
- **Gamification**: Earn points through daily and weekly challenges, and early submissions to assignments
- **Leaderboard** : Compare your position among other learners in a course, as well as globally
- **Virtual Room** : Allows the user to use Pomodoro Timer for himself without any distractions.

## Tech Stack

- **Framework**: Next.js: Utilized for both the frontend and backend logic, leveraging API routes to handle server-side operations.
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS, Material-UI (MUI)
- **Authentication**: JWT-based user authentication
- **Version Control**: Git and GitHub
- **APIs**: RESTful API architecture

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/acadhelper.git
   cd acadhelper
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and configure the following environment variables:
   ```plaintext
        MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>

        TOKEN_SECRET="your_jwt_secret_key"

        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
        NEXT_PUBLIC_CLOUDINARY_API_KEY="your_cloudinary_api_key"
        CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.




## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add a new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## Project_Pictures

<img src="https://github.com/user-attachments/assets/ae0537b9-52c1-444f-a8f2-926562454814" />
<img src="https://github.com/user-attachments/assets/31325f96-5ce6-4b19-8996-3154d49cb729" />
<img src="https://github.com/user-attachments/assets/28cd36d9-d4de-4814-9673-8440a66beb42" />
<img src="https://github.com/user-attachments/assets/16b6e350-a680-4945-a9ef-2f77600d01d5" />
<img src="https://github.com/user-attachments/assets/421fc6cb-7b4a-411f-84ae-2786899fdf51" />
<img src="https://github.com/user-attachments/assets/b3c7c272-250f-47fa-a718-94ef515190ce" />
<img src="https://github.com/user-attachments/assets/8a760c99-32b9-4baf-b278-407037251b69" />
<img src="https://github.com/user-attachments/assets/d59b4384-7946-4345-9d8e-7471e02a5cea" />
<img src="https://github.com/user-attachments/assets/aa7e093f-94a9-4bdd-9f44-63d19d75eb3c" />
<img src="https://github.com/user-attachments/assets/20831a43-a079-4d62-8cc8-15a3d633f952" />
<img src="https://github.com/user-attachments/assets/f31a5378-e877-4dab-8f7c-0e6d1cd25671" />
<img src="https://github.com/user-attachments/assets/9e54a2f8-1a92-4a67-a421-ce37bbdc6809" />
<img src="https://github.com/user-attachments/assets/dd1e1728-3b97-455f-8da0-73794b964f40" />
<img src="https://github.com/user-attachments/assets/f251e173-ff71-4ec7-b783-4c280ce5a1f8" />
<img src="https://github.com/user-attachments/assets/278d4bf5-a6f3-4f47-84be-663904711839" />
<img src="https://github.com/user-attachments/assets/902dd566-997a-4b4a-b161-2c1ca3dc4ab9" />
<img src="https://github.com/user-attachments/assets/0bd9e893-37f7-41c4-8ee7-ce3fd90a9b6e" />
<img src="https://github.com/user-attachments/assets/fa73157c-a65d-43f0-856d-781ec0a4f230" />