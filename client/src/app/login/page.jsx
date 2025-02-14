'use client'
import React, { useEffect, useState } from 'react'
import { KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation';

import axios from 'axios';
const Login = () => {
  const [forgotPass, setOpenForgotpass] = useState(false);
  const [openLogin, setOpenLogin] = useState(true);
  const [resetPass, setOpenResetPass] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', linkHash: null, newPassword: '', confirmPassword: ''
  });

  const userID = localStorage.getItem("userId")
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


  const handleChaneForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUserSignIn = async () => {
    try {
      const response = await axios.post('http://localhost:8087/api_v1/auth/login',
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        })
      console.log("User SignedIn: ", response.data)
      if(response.data.status_code ===200)
      {
        navigate.push('/jobFeed')
      }
    } catch (error) {
      console.log("Error registering user:", error.response?.data || error.message);

    }
  }


  const handleSendResetCode = async () => {
    const response = await axios.post('http://localhost:8087/api_v1/auth/forgot-password',
      {
        email: formData.email
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    if (response.data.status_code == '200') {
      setOpenForgotpass(false);
      setOpenLogin(false);
      setOpenResetPass(true);
    }
  }

  useEffect(()=>{},[userID])

  const handleResetPassword = async () => {
    const response = await axios.post('http://localhost:8087/api_v1/auth/reset-password',
      {
        _id: userID,
        linkHash: parseInt(formData.linkHash),
        password: formData.newPassword,
       
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    if (response.data == "200") {
      setOpenForgotpass(false);
      setOpenResetPass(false);
      setOpenLogin(true);
    }

  }


  return (
    <div className='flex w-full flex-col justify-center items-center space-y-4'>

      {openLogin && (
        <div className='flex flex-col w-full lg:w-2/6 h-full shadow-lg bg-white justify-center items-center space-y-4 my-20 py-8 px-6 rounded-2xl'>
          <span className='text-[#217346]'><KeyRound size={60} /></span>

          <p className='text-xl font-bold text-center'>Welcome Back</p>
          <div className='flex flex-col w-full space-y-3'>
            <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg'
              type='email'
              name='email'
              onChange={handleChaneForm}
              placeholder='Enter your email'
            />
            <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg'
              type='password'
              name='password'
              onChange={handleChaneForm}
              placeholder='Password' />

          </div>
          <span className='justify-start flex w-full'>
            <button className=' bg-transparent  text-sm border-[#217346] text-[#217346]  font-medium' onClick={openForgotPass}>Forgot Password?</button>
          </span>
          <div className='flex flex-col w-full space-y-3'>
            <button className='w-full bg-[#217346] text-white p-2 rounded-lg font-semibold' onClick={handleUserSignIn}>Continue</button>

          </div>
        </div>
      )}

      {forgotPass && (
        <div className='flex flex-col w-full lg:w-2/6 h-full shadow-lg bg-white justify-center items-center space-y-4 my-20 py-8 px-6 rounded-2xl'>
          <span className='text-[#217346]'><KeyRound size={60} /></span>

          <p className='text-xl font-bold text-center'>Reset password</p>
          <div className='flex flex-col w-full space-y-3'>
            <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg'
              type='email'
              value={formData.email}
              name='email'
              onChange={handleChaneForm}
              placeholder='Email' />
          </div>
          <div className='flex flex-col w-full space-y-3'>
            <button className='w-full bg-[#217346] text-white p-2 rounded-lg font-semibold'

              onClick={handleSendResetCode}>Send Reset Code</button>
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
             
              <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg'
                type='password'
               name='newPassword'
                value={formData.newPassword}
                onChange={handleChaneForm}
                placeholder='New Password' />
              <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg'
                type='password'
                name='confirmPassword' 
                value={formData.confirmPassword}
                onChange={handleChaneForm}
                placeholder='Confirm Password' />

            </div>

            <div className='flex flex-col w-full space-y-3'>
              <button className='w-full bg-[#217346] text-white p-2 rounded-lg font-semibold' onClick={handleResetPassword}>Reset Password</button>

            </div>
          </div>
        )
      }
    </div>
  )
}

export default Login