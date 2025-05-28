"use client"
import dynamic from 'next/dynamic';
const Layout = dynamic(() => import('@/components/layout'), {
  ssr: false,
});
import React, { useEffect, useState } from 'react'
import '../app/globals.css';
import axios from 'axios';
import LeaderboardComponent from '@/components/Leaderboard';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { institutes } from '@/utils/Sample Data/Sample';
import toast, { Toaster } from 'react-hot-toast';
import Auth from '@/components/Auth'
import User from '@/utils/Interfaces/userInterface';

interface UserWithPoints extends User {
  totalPoints: number;
}
const Leaderboard = () => {
    const [users,setUsers] = useState([])
    const [institute,setInstitute] = useState("")

    const fetchUsers = async()=>{
      try{
      const {data} = await axios.get('/api/user/getAllUsers')
      console.log(data)
      if(data?.success){
          const usersWithPoints = data.users.map((user:User) => {
              const totalPoints = user.Totalpoints.reduce((sum:number, course) => sum + course.points, 0);
              return {
                ...user,
                totalPoints
              };
            });
        
            // Sort users by totalPoints in descending order 
            usersWithPoints.sort((a:UserWithPoints, b:UserWithPoints) => b.totalPoints - a.totalPoints);
          setUsers(usersWithPoints)
      }
      
      }catch(error){
          toast.error("Error fetching users")
          return
      }
  }


    useEffect(()=>{
        fetchUsers()
    },[])


    const handleFilter=async()=>{
        try{
            const {data} = await axios.get('/api/user/filter',{params:{filter:institute}})
            if(data?.success){
                const usersWithPoints = data.users.map((user:User) => {
                    const totalPoints = user.Totalpoints.reduce((sum:number, course) => sum + course.points, 0);
                    return {
                      ...user,
                      totalPoints
                    };
                  });
              
                  // Sort users by totalPoints in descending order 
                  usersWithPoints.sort((a:UserWithPoints, b:UserWithPoints) => b.totalPoints - a.totalPoints);
                setUsers(usersWithPoints)
            }
        }catch(e:any){
            toast.error(e.response.data.message)
        }
    }

    const clearFilter=()=>{
      setInstitute("")
      fetchUsers()
    }
  return (
    <div>
      <Layout>
        <div className='m-4 w-full text-center text-3xl font-bold p-2'>Global Leaderboard</div>
        <div className="flex justify-center">
          <InputLabel id="demo-simple-select-label">Institute</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={institute}
            label="Age"
            onChange={(e) => setInstitute(e.target.value)}
            sx={{ width: "40%", marginX: "20px" }}
            placeholder='hi'
          >
            {institutes.map(uni => (
              <MenuItem value={uni}>{uni}</MenuItem>
            ))}
          </Select>
          <Button variant="outlined" onClick={handleFilter}>Filter</Button>
          <Button variant="outlined" onClick={clearFilter} sx={{ marginLeft: "10px" }}>Clear Filter</Button>
        </div>

        <LeaderboardComponent users={users} />
      </Layout>

    </div>
  )
}
export default Auth(Leaderboard)