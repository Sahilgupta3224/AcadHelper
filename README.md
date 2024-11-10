This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the re# AcadHelper

AcadHelper is a comprehensive academic assistance platform built using Next.js, designed to streamline educational management and enhance the learning experience. The platform offers a variety of features including course management, assignment tracking, and user submissions, making it a valuable tool for both educators and students.

AcadHelper was developed as part of the Codesangam Hackathon, under the event named Webster. This project showcases innovative solutions for education technology and exemplifies the power of team collaboration and coding proficiency demonstrated during the hackathon.

## Team Members
- [Shikhar Pandya](https://github.com/shikharpandya0487)
- [Khanak Patwari](https://github.com/Khanak21)
- [Sahil Gupta](https://github.com/Sahilgupta3224)

---
## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Pictures](#Project_Pictures)


## Features

- **User Management**: Register, log in, and manage user profiles with unique roles (admin, student).
- **Course Management**: Add, update, and track courses.
- **Assignment Tracking**: Manage assignments with details like due dates, submission status, and points.
- **Submission Handling**: Submit assignments and challenges with status tracking.
- **Event planning**:A built-in event scheduling feature to help users plan and organize academic events effectively, ensuring no important dates are missed.
- **Notification System**: Receive inbox messages for updates related to assignments and courses.
- **Email Verification**: Ensures that users verify their email addresses for account validation and security.
- **Admin Panel**: Dedicated interface for managing courses, users, and study materials.
- **Cloud Management** :Integration with Cloudinary for media storage and management.
- **Group Collaboration** :Includes a Pomodoro timer for group study, shared task management (to-do list visible to all members), and the ability for users to send requests to add members to the group.
-**Leaderboard** : Compare your position among other learners  
- **Virtual Room** : Allows the user to use Pomodaro Timer for himself without any distractions. The timer is made such that the user can work on the website along with the timer running

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
![WhatsApp Image 2024-11-10 at 09 42 18](https://github.com/user-attachments/assets/12eccf82-84a2-471a-baf7-dc5a9a112ebb)

![WhatsApp Image 2024-11-10 at 09 42 18 (1)](https://github.com/user-attachments/assets/6bf8b897-b12a-4559-8097-bff93d5dca96)

![WhatsApp Image 2024-11-10 at 09 42 18 (2)](https://github.com/user-attachments/assets/4e47d1a9-ab22-4c61-856c-d24b7d86cb1c)

![WhatsApp Image 2024-11-10 at 09 42 18 (3)](https://github.com/user-attachments/assets/bb34fae8-4cb2-4561-a6b2-0d5d2be2ad0d)

![WhatsApp Image 2024-11-10 at 09 42 18 (4)](https://github.com/user-attachments/assets/141fc0d6-92d7-485c-a430-23e91ffbc1e9)

![WhatsApp Image 2024-11-10 at 09 42 18 (5)](https://github.com/user-attachments/assets/ca7e7830-b89b-4bdf-99f0-fb5a56e7c87f)

![WhatsApp Image 2024-11-10 at 09 42 18 (6)](https://github.com/user-attachments/assets/6bf03a34-b445-4177-b230-959f183941cd)

![WhatsApp Image 2024-11-10 at 09 42 18 (7)](https://github.com/user-attachments/assets/55077258-1acc-4344-bbc5-0e83c7cfddfe)

![WhatsApp Image 2024-11-10 at 09 42 18 (8)](https://github.com/user-attachments/assets/bf70d14d-ec83-4153-9ccb-30bd470178de)

![WhatsApp Image 2024-11-10 at 09 42 18 (9)](https://github.com/user-attachments/assets/48c82f02-4c0c-4b08-8820-756425a81440)

![WhatsApp Image 2024-11-10 at 09 42 18 (10)](https://github.com/user-attachments/assets/e97bd313-e9bf-4d20-85e9-5bb805d3d429)

![WhatsApp Image 2024-11-10 at 09 42 18 (11)](https://github.com/user-attachments/assets/8093003e-bab6-4574-a67b-83641e235094)

![WhatsApp Image 2024-11-10 at 09 42 18 (12)](https://github.com/user-attachments/assets/0ae6004b-d884-4734-b873-dfc78e58af87)

![WhatsApp Image 2024-11-10 at 09 42 18 (13)](https://github.com/user-attachments/assets/d25cd745-b201-4103-87eb-be07510b54cc)

![WhatsApp Image 2024-11-10 at 09 43 04](https://github.com/user-attachments/assets/e42d3d29-4607-48ee-9136-da70ff4f1589)

![WhatsApp Image 2024-11-10 at 09 44 42](https://github.com/user-attachments/assets/8a4e9d39-df1e-43d5-a71d-2f1f4eb54bea)

![WhatsApp Image 2024-11-10 at 09 44 42 (1)](https://github.com/user-attachments/assets/6fa9381b-29ee-447c-abae-200879230b0e)

![WhatsApp Image 2024-11-10 at 09 44 42 (2)](https://github.com/user-attachments/assets/0e13ed54-3ad9-4edd-80fa-e0cf05b180c4)

![WhatsApp Image 2024-11-10 at 09 44 02](https://github.com/user-attachments/assets/058c6aea-d202-4f89-ae0c-7452effaa2fd)

![WhatsApp Image 2024-11-10 at 09 44 21](https://github.com/user-attachments/assets/efb40f37-258f-4ca8-8efe-2e42be0889c2)



sult.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
