"use client"
import Layout from '@/components/layout'
import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

function createData(
  rank: number,
  name: string,
  points: number
) {
  return {rank, name, points };
}

const rows = [
  createData(1,'Khanak Patwari', 159),
  createData(2,'Narendra Modi', 237)
];

const Leaderboard = ({users}) => {
  const calculateTotalPoints = (user: any) => {
    if (Array.isArray(user.Totalpoints)) {
      return user.Totalpoints.reduce((total, course) => total + course.points, 0);
    }
    return 0;
  };
  // const totalPoints = calculateTotalPoints(user);
  // console.log(totalPoints);
  return (
    <div className=''>
       {/* <div className="w-full flex justify-center m-4 font-bold text-2xl">Leaderboard</div> */}
       <TableContainer sx={{display:"flex",justifyContent:"center"}}>
      <Table sx={{ width: "900px",margin:"2rem" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Rank</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Institute</TableCell>
            <TableCell align="right">Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user,index) => (
            <TableRow
              key={user.username}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{index+1}</TableCell>
              <TableCell component="th" scope="row" sx={{display:"flex"}}>
                <Avatar sx={{ width: 24, height: 24,marginRight:"10px" }} alt="Remy Sharp" src={`https://ui-avatars.com/api/?name=${user.username.split(" ").join("+")}`} />
                 {user.username}
              </TableCell>
              <TableCell align="left">{user.institute ? user.institute : "N/A"}</TableCell>
              <TableCell align="right">{calculateTotalPoints(user)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default Leaderboard