"use client"
import GroupPage from "@/pages/[groupId]/GroupPage";
import Dashboard from "../pages/Dashboard";
// import Image from "next/image";
import './globals.css'
import Leaderboard from "@/components/Leaderboard";
import Login from "@/pages/Login";

export default function Home() {
  return (
    <>
        <Login />
    </>
  );
}