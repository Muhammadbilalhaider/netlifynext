// Code: src/app/register/page.js.jsx
'use client'
import React from 'react'
import { Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation';

const authOptions = () => {
    const navigate = useRouter();
     
    return (
        <div className="flex w-full flex-col h-screen justify-center items-center">
            <div className='flex font-alatsi  flex-col w-full lg:w-2/6 md:w-2/6 min-h-56 shadow-lg bg-white justify-center items-center space-y-4 p-4 rounded-2xl'>
                <span className='text-[#217346]'><Rocket size={60} /></span>
                <div className='flex flex-col justify-center items-center space-y-1'>
                    <p className='text-4xl font-alatsi text-center  font-black'>All the Jobs</p>
                    <p className='text-gray-600 font-alatsi text-center text-xl'>Aim Higher, Land Faster</p>
                </div>
                <div className='flex flex-col w-full space-y-3 px-3'>
                    <button className='w-full bg-[#217346] text-white p-2 rounded-lg' onClick={() =>navigate.push('/signUp')}>Create Account</button>
                    <button className='w-full bg-transparent border-2 border-[#217346] text-[#217346] p-2 rounded-lg' onClick={() => navigate.push('/login')}>Login</button>
                </div>
            </div>
        </div>
    )
}
export default authOptions