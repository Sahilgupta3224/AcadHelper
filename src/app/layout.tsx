"use client";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">

        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
          <ToastContainer 
            position="top-center" 
            autoClose={5000} 
            hideProgressBar={false} 
            newestOnTop 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover 
          /> 
        </body>
    </html>
  );
}
