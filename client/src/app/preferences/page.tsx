'use client'
import React, { useEffect, useState } from 'react'
import { Briefcase, Building2, Code, MapPin } from 'lucide-react'


const Preferences = () => {
  const [progressValue, setProgressValue] = useState<number | null>(25);
  
  return (
    <div className="w-full flex flex-col justify-center items-start lg:pb-24 pb-20 sm:pb-20 py-10 md:px-5 px-2 sm:px-3 lg:px-48">

      <div className='flex flex-col py-4 w-full rounded-md shadow-md bg-white'>

        <div className='flex flex-col w-full pl-6 p-4 md:pl-10'>
          <p className='lg:text-2xl font-bold text-lg'>Job Preferences</p>
          <p className='text-gray-500 md:text-base text-xs'>Customize your job search criteria to find the perfect match</p>
        </div>
        <hr className='border w-full '></hr>

        <div className='flex flex-col border mt-6 lg:m-8 md:m-5 m-4 rounded-md p-4'>
          <div className='flex space-x-1 items-center text-[#247BAF] flex-row'>
            <Briefcase size={20} />
            <p className='font-semibold lg:text-lg md:text-base text-sm'>Job Title Preferences</p>
          </div>
          <div className='flex flex-col  space-y-2 mt-5'>
            <p className='font-medium text-xs lg:text-sm text-gray-700 rounded-lg '>Desired Job Titles</p>
            <input className='lg:text-sm text-xs text-gray-600 p-1.5 rounded-lg border' placeholder='e.g. Software Engineer, Frontend Developer'/>
            <input className=' lg:text-sm text-xs text-gray-600 p-1.5 rounded-lg border' placeholder='Separate multiple titles with commas'/>
            
          </div>


          <div className='flex flex-col space-y-2 mt-5'>
          <p className='font-medium text-xs lg:text-sm text-gray-700 rounded-lg '>Desired Job Titles</p>
          <input className='lg:text-sm text-xs text-gray-600 p-1.5 rounded-lg border' placeholder='e.g. Lead, Technical, Intern'/>
            <input className='lg:text-sm text-xs text-gray-600 p-1.5 rounded-lg border' placeholder='Jobs containing these words will be filtered out'/>
            </div>

        </div>

        <div className='flex flex-col border mt-4 lg:m-8 md:m-5 m-4   rounded-md p-4'>
          <div className='flex space-x-1 text-[#217346] items-center flex-row'>
            <Building2 size={20} />
            <p className='font-semibold lg:text-lg md:text-base text-sm'>Company Preferences</p>
          </div>
          <div className='flex flex-col  space-y-2 mt-5'>
          <p className='font-semibold text-sm text-gray-700'>Excluded Companies</p>
            <input className='md:text-sm text-xs text-gray-800 p-1.5 rounded-lg border' placeholder='e.g. Company A, Company B'/>
       
            <p className='md:text-sm text-xs text-gray-500'>Jobs from these companies will be filtered out</p>
          </div>

        </div>


        <div className='flex flex-col border mt-4 lg:m-8 md:m-5 m-4   rounded-md p-4'>
          <div className='flex space-x-1 text-[#FFE066] items-center flex-row'>
            <MapPin size={20} />
            <p className='font-semibold lg:text-lg md:text-base text-sm'>Location Preferences</p>
          </div>
          <div className='flex flex-col  space-y-2 mt-5'>
          <p className='font-medium text-xs lg:text-sm text-gray-700 rounded-lg '>Cities</p>
          <input className='md:text-sm text-xs text-gray-800 p-1.5 rounded-lg border' placeholder='e.g. New York, San Francisco'/>
            <p className='md:text-sm text-xs text-gray-500 border-gray-200'>Jobs from these companies will be filtered out</p>
          </div>

          <div className='flex flex-col w-full mt-5'>
            <p className='md:text-sm text-xs lg:text-sm font-medium'>
              Search Radius: {progressValue} miles
            </p>
            <span className='w-full relative h-1 bg-transparent justify-center'>
              <hr className='p-1 bg-gray-200 opacity-65 w-full absolute top-1.5 rounded-lg z-0'></hr>
              <input
                type="range"
                min="0"
                max="100"
                onChange={(e)=>{setProgressValue(Number(e.target.value))}}
                className="w-full h-5 appearance-none bg-none z-20 cursor-pointer"
                style={{
                  background: 'transparent', 
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto', 
                }}
              />
            </span>
            <div className='flex w-full justify-between md:mt-4 lg:mt-3'>
            <p className='md:text-sm text-xs lg:text-sm font-medium'>0</p>
            <p className='md:text-sm text-xs lg:text-sm font-medium'>50</p>
            <p className='md:text-sm text-xs lg:text-sm font-medium'>100</p>
            </div>

          </div>

          <div className='flex flex-col  mt-2 my-2 py-1'>
          <p className='font-medium md:text-sm text-sm  text-gray-700 rounded-lg '>Work Type</p>
            <div className='flex flex-col mt-2 space-y-2'>

              <span className='flex flex-row space-x-2'>
                <input type='checkbox' />
                <p className='lg:text-sm text-xs text-gray-600'>Remote</p>
              </span>
              <span className='flex flex-row space-x-2'>
                <input type='checkbox' />
                <p className='lg:text-sm text-xs text-gray-600'>
                  Hybrid</p>
              </span>
            </div>

          </div>

        </div>

        <div className='flex flex-col border mt-6 lg:m-8 md:m-5 m-3  rounded-md p-4'>
          <div className='flex space-x-1 items-center text-[#217346] flex-row'>
            <Code size={20} />
            <p className='font-semibold lg:text-lg md:text-base text-sm'>Technology Preferences</p>
          </div>
          <div className='flex flex-col  space-y-2 mt-5'>
          <p className='font-medium text-xs lg:text-sm text-gray-700 rounded-lg '>Required Technologies</p>
            <input className='text-sm text-gray-800 p-1.5 rounded-lg border' placeholder='e.g. React, TypeScript'/>
          
            <p className='lg:text-sm md:text-sm text-xs text-gray-700'>Only show jobs that include these technologies</p>
          </div>


          <div className='flex flex-col space-y-2 mt-5'>
            <p className='font-semibold text-sm text-gray-700'>Excluded Technologies</p>
            <input className='md:text-sm text-xs text-gray-800 p-1.5 rounded-lg border' placeholder='e.g. PHP, WordPress'/>
            <p className='md:text-sm text-xs text-gray-700'>Filter out jobs with these technologies</p>
          </div>

        </div>


        <div className='flex flex-col lg:mt-6 lg:m-4 rounded-md p-4'>
          <button className='w-full p-2 md:text-base text-sm rounded-md bg-[#247BAF] text-white'>Save Preferences</button>
        </div>

      </div>
    </div>
  )
}

export default Preferences