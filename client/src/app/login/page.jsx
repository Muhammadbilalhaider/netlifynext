'use client'
import {  KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Login = () => {
  const [forgotPass, setOpenForgotpass] = useState(false);
  const [openLogin, setOpenLogin] = useState(true);
  const [resetPass, setOpenResetPass] = useState(false);
  const navigate = useRouter();
  const openForgotPass = () => {
    setOpenLogin(false);
    setOpenResetPass(false);
    setOpenForgotpass(true);
  }


  const handleBackLogin = () => {
    setOpenForgotpass(false);
    setOpenResetPass(false);
    setOpenLogin(true);
  }


  const handleResetCode = () => {
    setOpenForgotpass(false);
    setOpenLogin(false);
    setOpenResetPass(true);
  }

  const handleReestPass = () => {
    setOpenForgotpass(false);

    setOpenResetPass(false);
    setOpenLogin(true);
  }

  const handleContinue =()=>{
    navigate.push('/jobFeed')
  }

  return (
    <div className='flex w-full flex-col justify-center items-center space-y-4'>

      {openLogin && (
        <div className='flex flex-col w-full lg:w-2/6 h-full shadow-lg bg-white justify-center items-center space-y-4 my-20 py-8 px-6 rounded-2xl'>
          <span className='text-[#217346]'><KeyRound size={60} /></span>

          <p className='text-xl font-bold text-center'>Welcome Back</p>
          <div className='flex flex-col w-full space-y-3'>
            <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg' type='email' placeholder='Enter your email' />
            <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg' type='password' placeholder='Password' />

          </div>
          <span className='justify-start flex w-full'>
            <button className=' bg-transparent  text-sm border-[#217346] text-[#217346]  font-medium' onClick={openForgotPass}>Forgot Password?</button>
          </span>
          <div className='flex flex-col w-full space-y-3'>
            <button className='w-full bg-[#217346] text-white p-2 rounded-lg font-semibold' onClick={handleContinue}>Continue</button>

          </div>
        </div>
      )}





      {forgotPass && (
        <div className='flex flex-col w-full lg:w-2/6 h-full shadow-lg bg-white justify-center items-center space-y-4 my-20 py-8 px-6 rounded-2xl'>
          <span className='text-[#217346]'><KeyRound size={60} /></span>

          <p className='text-xl font-bold text-center'>Reset password</p>
          <div className='flex flex-col w-full space-y-3'>
            <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg' type='email' placeholder='Email' />
          </div>
          <div className='flex flex-col w-full space-y-3'>
            <button className='w-full bg-[#217346] text-white p-2 rounded-lg font-semibold' onClick={handleResetCode}>Send Reset Code</button>
            <button className='w-full bg-transparent text-[#217346] p-2 border-2 border-[#217346] rounded-lg font-semibold' onClick={handleBackLogin}>Back to Login</button>

          </div>
        </div>
      )}



      {
        resetPass && (
          <div className='flex flex-col w-full lg:w-2/6 h-full shadow-lg bg-white justify-center items-center space-y-4 my-20 py-8 px-6 rounded-2xl'>
            <span className='text-[#217346]'><KeyRound size={60} /></span>

            <p className='text-xl font-bold text-center'>Create New Password</p>
            <div className='flex flex-col w-full space-y-3'>
              <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg' type='email' placeholder='Reset Code' />
              <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg' type='password' placeholder='New Password' />
              <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg' type='password' placeholder='Confirm Password' />

            </div>

            <div className='flex flex-col w-full space-y-3'>
              <button className='w-full bg-[#217346] text-white p-2 rounded-lg font-semibold' onClick={handleReestPass}>Reset Password</button>

            </div>
          </div>
        )
      }
    </div>
  )
}

export default Login