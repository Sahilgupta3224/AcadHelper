import Layout from '@/components/layout'
import React from 'react'
import '../app/globals.css';
import { Button } from '@mui/material';
import { toast } from 'react-toastify'; 

const Dashboard = () => {
  return (
    <Layout>
        <div className='bg-red-400'>
            hi there
            <div>
                good job

                <Button variant="outlined" onClick={()=>{toast.info("Hello");console.log("helo")}}>
                  Click0
                </Button>
            </div>
        </div>
    </Layout>
  )
}

export default Dashboard