import Image from "next/image";
import googleLogo from "@/public/google.png";
import githubLogo from "@/public/github.png";
import {
  CredentialsSignInButton,
  GithubSignInButton,
  GoogleSignInButton,
} from "@/components/authButtons";
import { CredentialsForm } from "@/components/credentialsForm";
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '@/components/options';
import { getCsrfToken } from 'next-auth/react';

// Page component
const AuthPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center mt-10 p-10 shadow-md">
        <h1 className="mt-10 mb-4 text-4xl font-bold">Sign In</h1>
        <GoogleSignInButton />
        <GithubSignInButton />
        <span className="text-2xl font-semibold text-white text-center mt-8">
          Or
        </span>
        <CredentialsForm />
      </div>
    </div>
  );
};

export default AuthPage;

// Server-side session check and redirect
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, options);
  if (session) {
    return {
      redirect: { destination: '/timeline', permanent: false },
    };
  }
  // Provide CSRF token if needed for CredentialsForm
  const csrfToken = await getCsrfToken(context);
  return { props: { csrfToken } };
};