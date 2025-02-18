'use client'
import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Banknote, Briefcase, Building2, Calendar, Clock, Heart, MapPin, X, Earth } from 'lucide-react';

const JobFeed = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const datePickerRef = useRef<DatePicker | null>(null);
  const keyResponsibilities = [
    "Run service calls for residential customers.",
    "Perform faucet and toilet repairs or replacements.",
    "Conduct water heater maintenance and installations.",
    "Handle boiler maintenance and installations.",
    "Diagnose and resolve various plumbing issues.",
    "Build relationships with a loyal customer base.",
  ];
  const keyRequirements = [
    "Valid Journeyman Plumbing License (MA).",
    "Valid Driver’s License.",
    "A customer-focused attitude and commitment to quality work.",
  ];
  const handleCalClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true)
    }
  }
  return (
    <div className="flex w-full flex-col items-center mt-10 mb-52 px-4 md:px-8">
      <div
        className="flex p-3 flex-wrap justify-center items-center py-2 rounded-lg mb-3 bg-transparent hover:bg-white cursor-pointer space-y-2 sm:space-y-0 sm:space-x-3"
        onClick={handleCalClick}
      >
        <span className="text-blue-500">
          <Calendar size={18} />
        </span>
        <DatePicker
          className="w-36 text-black bg-transparent text-center cursor-pointer"
          ref={datePickerRef}
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          placeholderText="Date"
          dateFormat="MMMM d, yyyy"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
        <input
          type="text"
          placeholder="10 jobs"
          value="10 Jobs"
          className="w-16 text-sm bg-[#c8d6e9] bg-opacity-50 rounded-2xl text-blue-400 text-center outline-none border-none cursor-pointer"
        />
      </div>

      <div className="flex flex-col p-5 items-start bg-white w-full md:w-11/12 lg:w-8/12 shadow-lg rounded-lg">
         
        <div className="lg:mb-4 w-full">
          <p className="font-bold lg:text-lg text-base lg:text-start md:text-start text-center mb-2 text-neutral-dark">Journeyman Plumber</p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="flex items-center">
            <span className="text-blue-500">
              <Building2 size={18} />
            </span>
            <p className="lg:text-base md:text-sm text-xs text-gray-600 ml-2">G&C Plumbing & Heating LLC</p>
          </div>
          <div className="flex items-center">
            <span className="text-green-700">
              <MapPin size={18} />
            </span>
            <p className="lg:text-base md:text-sm text-xs text-gray-600 ml-2">Bellingham, MA, US</p>
          </div>
          <div className="flex items-center">
            <span className="text-orange-500">
              <Banknote size={18} />
            </span>
            <p className="lg:text-base md:text-sm text-xs text-gray-600 ml-2">$72,800 - $115,000</p>
          </div>
          <div className="flex items-center ">
            <span className='flex text-primary'><Earth size={18} /></span>
            <p className="lg:text-base md:text-sm text-xs ml-2 text-gray-600">Remote, Hybrid, On-Location</p>
          </div>
        </div>

         
        <div className="w-full py-6 mt-6">
          <hr className="border border-gray-400 opacity-40" />
        </div>
     <div className='w-full'>
     <p className="lg:text-lg md:text-base text-sm lg:text-start md:text-start text-center font-semibold text-neutral-dark mb-2">About G&C Plumbing & Heating LLC</p>
        <p className="text-gray-600 lg:text-base md:text-sm text-xs lg:text-start md:text-start text-center leading-relaxed">
          G&C Plumbing & Heating is a company dedicated to providing exceptional plumbing services while fostering a supportive and growth-oriented work environment.
        </p>
     </div>
        <div className="w-full py-6">
          <hr className="border border-gray-400 opacity-40" />
        </div>
        <div className='w-full'>
        <p className="lg:text-lg text-base lg:text-start md:text-start text-center font-semibold text-neutral-dark mb-2">Position Overview</p>
        <p className="leading-relaxed lg:text-base md:text-sm text-xs lg:text-start md:text-start text-center text-gray-600">
          The Journeyman Plumber will provide top-notch plumbing services to residential customers, focusing on service calls and maintenance. The role offers growth opportunities, competitive pay, and a supportive team culture.
        </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-4 w-full">
          <div className="flex flex-col w-full">
            <span className="items-center flex flex-row ">
             <span className='text-blue-500 '><Briefcase size={18} /></span> 
              <p className="lg:text-base md:text-sm text-xs ml-2">Experience Required</p>
            </span>


            <p className="lg:text-base md:text-sm text-gray-600 text-xs ml-7">NaN</p>

          </div>

          <div className="flex flex-col">
            <span className="items-center  flex -row ">
            <span className='text-[#038134] '><Clock size={18} /> </span>
              <p className="lg:text-base md:text-sm text-xs ml-2">Work Schedule</p>
            </span>


            <p className="lg:text-base md:text-sm text-xs text-gray-600 ml-7">Flexible 8-hour shifts, day shift, rotating weekends, year-round work</p>

          </div>
        </div>
        <div className="w-full mt-6">
          <p className="lg:text-lg text-base lg:text-start text-center md:text-start text-neutral-dark font-semibold mb-2">Key Responsibilities</p>
          <ul className="list-disc ml-5 space-y-3">
            {keyResponsibilities.map((responsibility, index) => (
              <li key={index} className="lg:text-base md:text-sm text-xs text-gray-600 leading-relaxed">
                {responsibility}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full mt-6">
          <p className="lg:text-lg text-base text-neutral-dark lg:text-start md:text-start text-center font-semibold mb-2">Requirements</p>
          <ul className="list-disc ml-5 space-y-3">
            {keyRequirements.map((requirement, index) => (
              <li key={index} className="lg:text-base md:text-sm text-xs text-gray-600 leading-relaxed">
                {requirement}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex flex-col lg:w-8/12 md:w-9/12 w-full">
          <p className="lg:text-lg text-base lg:text-start md:text-start text-center text-neutral-dark font-semibold mb-2">Soft Skills</p>
          <div className="w-full grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 p-0 gap-2 sm:items-center sm:justify-center">
            <div className="bg-accent-light justify-center items-center px-3 rounded-full">
            <p className="text-accent-secondary p-0.5 lg:text-base md:text-sm text-xs font-medium text-center">Customer-focused attitude</p>
            </div>
            <div className="bg-accent-light justify-center items-center px-3 rounded-full">
            <p className="w-full text-accent-secondary p-0.5 lg:text-base md:text-sm text-xs font-medium text-center">Commitment to quality work</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col lg:w-8/12 md:w-9/12 w-full">
          <p className="lg:text-lg text-base lg:text-start md:text-start text-center text-neutral-dark font-semibold mb-2">Required Technologies</p>
          <div className="w-full grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 p-0 gap-2 sm:items-center sm:justify-center">
            <div className="bg-accent-light justify-center items-center px-3 rounded-full">
              <p className="text-accent-secondary p-0.5 lg:text-base md:text-sm text-xs font-medium text-center">Customer-focused attitude</p>
            </div>
            <div className="bg-accent-light justify-center items-center px-3 rounded-full">
            <p className="w-full text-accent-secondary p-0.5 lg:text-base md:text-sm text-xs font-medium text-center">Commitment to quality work</p>
            </div>
          </div>
        </div>
         <div className="w-full py-3 mt-6">
          <hr className="border border-gray-400 opacity-40" />
        </div>
      </div>

    
      <div className="fixed bottom-16 flex justify-center w-full space-x-6">
        <div className="p-4 border-2 hover:text-white border-[#f83b22] hover:bg-[#f83b22] text-[#f83b22] rounded-full cursor-pointer hover:scale-110 transition-transform">
          <X size={30} />
        </div>
        <div className="p-4 border-2 hover:text-white border-[#038134] text-[#038134] hover:bg-[#038134] rounded-full cursor-pointer hover:scale-110 transition-transform">
          <Heart size={30} />
        </div>
      </div>
    </div>

  );
};

export default JobFeed;
