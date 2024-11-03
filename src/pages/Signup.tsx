import React, { useState } from 'react';
import axios from 'axios';
import "../app/globals.css";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface ButtonProps {
  value: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ value, onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="mt-6 transition-all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-gray-600 to-gray-400 hover:from-gray-700 hover:to-gray-500 focus:bg-gray-900 transform hover:-translate-y-1 hover:shadow-lg">
      {value}
    </button>
  );
};

interface InputProps {
  type: string;
  id: string;
  name: string;
  label: string;
  placeholder: string;
  autofocus?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ type, id, name, label, placeholder, autofocus, value, onChange }) => {
  return (
    <label className="text-gray-500 block mt-3">
      {label}
      <input
        autoFocus={autofocus}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100"/>
    </label>
  );
};

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setusername] = useState('');
  const router = useRouter();


  const handleSignup = async () => {
    try {
      const response = await axios.post('/api/auth/signup', {
        email,
        password,
        username
      });

      if (response.status === 200) {
        console.log("signup successful:", response.data);
        router.push('/Dashboard');
      } else {
        console.error("singup failed");
      }
    } catch (error) {
      // console.error("Error during signin:", error);
      toast.error(error?.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="bg-gray-200 flex justify-center items-center h-screen w-screen">
      <div className="border-t-8 rounded-sm border-gray-600 bg-white p-12 shadow-2xl w-96">
        <h1 className="font-bold text-center block text-2xl">Sign Up</h1>
        <form>
          <Input
            type="email"
            id="email"
            name="email"
            label="Email Address"
            placeholder="me@example.com"
            autofocus={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="username"
            id="username"
            name="username"
            label="Username"
            placeholder="me@example.com"
            autofocus={true}
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
          <Input
            type="password"
            id="password"
            name="password"
            label="Password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button value="Submit" onClick={handleSignup} />
        </form>
      </div>
         <Toaster />
    </div>
  );
};

export default SignupForm;