// import dynamic from 'next/dynamic';
import Layout from '@/components/layout';
// const Layout = dynamic(() => import('@/components/layout'), { ssr: false });
import '../app/globals.css';

const Course = () => {
  return (
    <Layout key="courses">
      <div className="bg-white min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Hi there</h1>
        <div className="bg-red-100 p-4 rounded-lg shadow-md">
          <p className="text-lg bg-red text-gray-700">Good job!</p>
        </div>
      </div>
    </Layout>
  )
}

export default Course