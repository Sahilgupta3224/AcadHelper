"use client"
import Timer from '@/components/Timer'
import dynamic from 'next/dynamic';
const Layout = dynamic(() => import('@/components/layout'), {
  ssr: false,
});
import Auth from '@/components/Auth'
import React from 'react'

const Focus = () => {
  return (
    <div>
        <Layout>
          <Timer/>
        </Layout>
    </div>
  )
}
export default Auth(Focus)