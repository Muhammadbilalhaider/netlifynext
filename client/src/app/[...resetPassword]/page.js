'use client'
import React, { useEffect, useState } from 'react'
import { KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const page = () => {
  const navigate = useRouter()
    const [formData, setFormData] = useState({
    email: '', password: '', linkHash: null, newPassword: '', confirmPassword: ''
  });


  
  const handleChaneForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

useEffect(()=>{
  console.log(formData)
},[formData])


  const handleResetPassword = async () => {
    const response = await axios.post('http://localhost:8087/api_v1/auth/reset-password',
      {
        _id: formData._id,
       
        password: formData.newPassword,
        confirmPassword: formData.confirmPassword
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    if (response.data == "200") {
     navigate.push('/login')
    }

  }



  return (
    <div className='flex w-full flex-col justify-center items-center space-y-4'>
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

    </div>
  )
}

export default page