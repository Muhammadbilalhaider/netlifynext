'use client'
import { AlertCircle, Award, Ban, Calendar, CheckCircle2, ClipboardList, CreditCard, PhoneCall, X } from 'lucide-react';
import React, { useState } from 'react';

const UserPortal = () => {
  const [openCancelForm, setOpenCancelForm] = useState<boolean | null>(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [confirmCancelSub, setConfirmCancel] = useState<boolean>(false)

  const stats = [
    {
      name: 'Total Applications',
      totalNumber: '25',
      icon: ClipboardList,
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
    {
      name: 'Total Applies',
      icon: CheckCircle2,
      totalNumber: '18',
      color: 'text-success',
      bgColor: 'bg-success-light',
    },
    {
      name: 'Total Follow Up',
      totalNumber: '12',
      icon: PhoneCall,
      color: 'text-accent-secondary',
      bgColor: 'bg-accent-light',
    },
    {
      name: 'Total Skips',
      icon: Ban,
      totalNumber: '7',
      color: 'text-danger',
      bgColor: 'bg-danger-light',
    },
  ];


  const handleCancelSub = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setOpenCancelForm(true)
    console.log("Subscription Kept!");
  }

  const handleConfirmCancel = () => {
    setOpenCancelForm(false)
    setConfirmCancel(true)
  }


  const handleKeepSub = () => {
    setConfirmCancel(false);
    setOpenCancelForm(false);
  }

  const handleConfirmedCancel = () => {
    setConfirmCancel(false);
    setOpenCancelForm(false);
  }
  const handleGoBack = () => {
    setConfirmCancel(false);
    setOpenCancelForm(true);
  }

  return (
    <div className="w-full flex flex-col justify-center items-start pb-24 py-10 px-5 sm:px-10 lg:px-48">
      <div className="flex flex-col py-4 w-full rounded-md shadow-md bg-white">
        <div className="flex flex-col mx-8">
          <p className="font-bold lg:text-3xl text-xl lg:text-start md:text-start text-center text-neutral-dark">Account Settings</p>
          <p className="md:text-base text-xs md:text-start lg:text-start text-center text-gray-500">Manage your profile and account settings</p>
        </div>

        <hr className="border w-full mt-6" />
        <div className="flex flex-col mx-8 mt-6">
          <p className="text-neutral-dark font-semibold lg:text-lg text-base md:text-xl lg:text-start text-center">Application Statistics</p>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 w-full mt-4 flex-row justify-between gap-4">
            {stats.map((value, index) => (
              <div
                key={index}
                className="flex flex-col w-full p-6 items-center justify-center rounded-md shadow-md border cursor-pointer"
              >
                <span
                  className={`flex  text-xl w-12 h-12 justify-center rounded-full items-center ${value.bgColor}`}
                >
                  <value.icon size={20} />
                </span>

                <p className="text-center mt-2 lg:text-lg md:text-lg text-sm font-semibold">{value.totalNumber}</p>
                <p className="text-center mt-2 text-gray-500 md:text-sm text-xs">{value.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:mx-8 md:mx-4 mx-3">
          <div className='flex flex-row justify-between mt-8 w-full'>

            <p className='md:text-xl lg:text-2xl text-base text-neutral-dark font-bold'>Profile Information</p>
            <p className='text-primary md:text-base text-xs'> Edit Profile</p>
          </div>
          <div className='grid lg:grid-cols-2 sm:grid-cols-1 w-full gap-x-3'>
            <span className='flex flex-col mt-4 space-y-1'>
              <p className='md:text-base lg:text-base text-sm'>Name</p>
              <input className='md:text-base text-sm lg:text-base text-gray-800 p-2 rounded-lg border' placeholder='John Doe' />

            </span>
            <span className='flex flex-col mt-4 space-y-1'>
              <p className='md:text-base lg:text-base text-sm'>Email</p>
              <input className='md:text-base text-sm lg:text-base text-gray-800 p-2 rounded-lg border' placeholder='john@gmail.com' />

            </span>
            <span className='flex flex-col mt-4 space-y-1'>
              <p className='md:text-base lg:text-base text-sm'>Address</p>
              <input className='md:text-base text-sm lg:text-base text-gray-800 p-2 rounded-lg border' placeholder='Address' />

            </span>
            <span className='flex flex-col mt-4 space-y-1'>
              <p className='md:text-base lg:text-base text-sm'>Phone</p>
              <input className='md:text-base text-sm lg:text-base text-gray-800 p-2 rounded-lg border' placeholder='+1 000 000 00' />


            </span>
          </div>
        </div>
        <hr className='flex w-full border mt-4'></hr>
        <div className='flex flex-col md:px-8 px-4 mt-4'>
          <p className='md:text-xl lg:text-2xl text-base text-neutral-dark lg:text-start text-start font-bold'>Change Password</p>
          <span className='flex flex-col w-full space-y-2 mt-2'>
            <p className='text-gray-900 md:text-base lg:text-base text-sm '>Current Password</p>
            <input type='password' className='w-full md:text-base text-sm border p-2 rounded-md' placeholder='Current Password' />
          </span>

          <span className='flex flex-col w-full space-y-2 mt-2'>
            <p className='text-gray-900 md:text-base lg:text-base text-sm'>New Password</p>
            <input type='password' className='w-full border p-2 md:text-base text-sm rounded-md' placeholder='New Password' />
          </span>
          <span className='flex flex-col w-full space-y-2 mt-2'>
            <p className='text-gray-900 md:text-base lg:text-base text-sm'>Current Password</p>
            <input type='password' className='w-full border p-2 md:text-base text-sm rounded-md' placeholder='Confirm Password' />
          </span>
          <button className='w-full bg-primary lg:text-base text-sm text-white p-1.5 rounded-md mt-5'>Update Password</button>
        </div>
        <hr className='flex w-full border mt-4'></hr>
        <div className='flex flex-col md:px-8 px-4 pt-4 '>
          <h2 className='md:text-xl lg:text-xl text-base text-neutral-dark lg:text-start text-start font-bold'>Subscription Details
          </h2>
        </div>
        <div className='flex flex-col md:mx-8 lg:mx-8 mx-2 mt-4 lg:p-6 p-2 border rounded-lg'>
          <div className='flex flex-col space-y-5'>
            <div className='flex flex-row justify-between'>
              <div className='flex flex-row space-x-2'>
                <span className='flex text-center items-center bg-primary-light lg:px-2 rounded-lg text-primary'><Award size={20} /></span>
                <div>
                  <h3 className='font-semibold text-neutral-dark lg:text-lg md:text-base text-sm'>Professional Plan</h3>
                  <p className=' text-gray-600 lg:text-sm md:text-sm text-xs'>Member since January 20, 2024</p>
                </div>
              </div>
              <span>
                <p className='px-3 py-1 bg-success-light text-success text-sm font-medium rounded-full'>
                  Active
                </p>
              </span>

            </div>
            <div className='flex flex-row space-x-2'>
              <span className='text-gray-500 mt-1'><Calendar size={18} /> </span>
              <p className='lg:w-full md:w-full text-gray-500 lg:text-base md:text-base text-sm'>Current period: January 20, 2024 - February 20, 2024</p>
            </div>

            <div className='flex flex-row space-x-2'>
              <span className='text-gray-500 mt-1'><CreditCard size={18} /> </span>
              <p className='text-gray-500 lg:text-base md:text-base text-sm'>Next payment: $29.99 on February 20, 2024</p>
            </div>
          </div>

          <span className='flex w-full'><hr className='flex w-full border mt-6' ></hr></span>
          <div className='w-full flex justify-end lg:mt-6 mt-3 mb-1'>
            <button className='flex lg:text-base md:text-base text-xs border border-danger rounded-lg p-2 text-danger hover:bg-danger-light' onClick={handleCancelSub}>Cancel Subscription</button>
          </div>
        </div>


      </div>
      {openCancelForm && (
        <div className="fixed inset-0 flex-col bg-gray-600 bg-opacity-70 z-30 flex justify-center lg:p-10 md:p-5 p-3 items-center">
          <div className='flex flex-col lg:w-5/12 md:w-5/6  h-auto justify-center items-center rounded-lg bg-white'>
            <span className='flex justify-between w-full py-2 px-4'>
              <h3 className='font-bold text-start lg:text-lg text-sm text-gray-900'>
                Cancel Subscription
              </h3>
              <button
                className='w-8 h-8 rounded-full flex justify-center items-center hover:bg-slate-300 cursor-pointer'
                onClick={handleKeepSub}
              >
                <X size={20} />
              </button>
            </span>
            <div className='flex w-full'>
              <hr className="border-gray-400  w-full border opacity-30" />
            </div>
            <div className='flex flex-col p-2 py-2 mx-2 space-y-2'>
              <div className='flex flex-row justify-center items-start bg-danger-light space-x-2  p-3 rounded-lg'>
                <span className='text-danger mt-1'><AlertCircle size={20} /></span>
                <div className='flex flex-col'>
                  <span className='text-danger lg:text-base text-sm font-medium'>Are you sure you want to cancel?</span>
                  <span className="block text-danger lg:text-sm md:text-sm text-xs">You'll lose access to all Professional features at the end of your billing period.</span>
                </div>

              </div>
              <label className='text-sm text-gray-800 py-1'>Please tell us why you're leaving</label>
              <select className='p-1 rounded-md lg:text-base md:text-base text-sm'
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                <option value="expensive">Too expensive</option>
                <option value="not_using">Not using enough</option>
                <option value="missing_features">Missing features</option>
                <option value="found_alternate">Found an alternate</option>
                <option value="other">Other</option>
              </select>
              <div className='flex flex-row space-x-4 py-4 lg:justify-end md:justify-end justify-center items-end w-full mr-6'>
                <button className='bg-transparent border p-2 rounded-md px-4 cursor-pointer lg:text-base md:text-sm text-xs'
                  onClick={handleKeepSub}>Keep Subscription</button>
                <button className='bg-danger p-2 text-white lg:text-base px-4 md:text-sm text-xs rounded-md'
                  onClick={handleConfirmCancel}
                  disabled={!selectedReason}
                  style={{
                    cursor: selectedReason ? "pointer" : "not-allowed",
                    opacity: selectedReason ? 1 : 0.5,
                  }}>Continue to cancel</button>
              </div>
            </div>


          </div>

        </div>
      )}

      {confirmCancelSub && (
        <div className="fixed inset-0 flex-col bg-gray-600 bg-opacity-70 z-30 flex justify-center lg:p-10 md:p-5 p-3 items-center">
          <div className='flex flex-col lg:w-5/12 md:w-5/6 w-full h-auto justify-center items-center rounded-lg bg-white'>
            <span className='flex justify-between w-full px-4 py-1 lg:mt-0 md:mt-0 mt-1 lg:py-2'>
              <h3 className='font-bold text-start lg:text-lg text-sm text-gray-900'>
                Cancel Subscription
              </h3>
              <button
                className='w-8 h-8 rounded-full flex justify-center items-center hover:bg-slate-300 cursor-pointer'             >
                <X size={20} />
              </button>
            </span>
            <div className='flex w-full '>
              <hr className="border-gray-400 w-full border opacity-30" />
            </div>
            <div className='flex flex-col py-4 px-2 text-gray-600 mx-2 space-y-2'>
              <p className='text-sm lg:text-base md:text-base'>Are you absolutely sure you want to cancel your subscription? This action cannot be undone.</p>


              <div className='flex flex-row space-x-4  justify-end items-end w-full mr-6'>
                <button className='bg-transparent border p-2 rounded-md px-4 cursor-pointer lg:text-base text-sm'

                  onClick={handleGoBack}>Go Back</button>
                <button className='bg-danger p-2 text-white lg:text-base px-4 text-sm rounded-md'
                  onClick={handleConfirmedCancel}
                  disabled={!selectedReason}
                  style={{
                    cursor: selectedReason ? "pointer" : "not-allowed",
                    opacity: selectedReason ? 1 : 0.5,
                  }}>Confirm Cancelation</button>
              </div>
            </div>


          </div>

        </div>
      )}
    </div>

  );
};

export default UserPortal;
