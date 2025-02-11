'use client'
import React, { useState, useEffect } from 'react'
import { X, Building2, Clock, FileText, Ghost, MapPin, PartyPopper, Phone, Rocket, Skull, Users } from 'lucide-react'


const Applied = () => {
 const [tracker, setTracker] = useState<number | null>(null);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [openNotes, setOPenNotes] = useState(false);
  const [appliedData, setAppliedData] = useState<string | string[]>([]);

  
  const stages = [
    { name: "Applied", description: 'Application submitted! 🚀', icon: Rocket },
    { name: "Rejected", description: 'Better luck next time 💪', icon: Skull },
    { name: "Ghosted", description: 'No response... 👻', icon: Ghost },
    { name: "Phone Screen", description: 'Time to chat! 📞', icon: Phone },
    { name: "Interview", description: 'Show your skills! 💫', icon: Users },
    { name: "Offer", description: 'Congratulations! 🎉', icon: PartyPopper },
  ];

  const handleChangeTracker = (index: number) => {
    setTracker(index)
 
  }

  const handleMouseEnter = (index: number) => {
   
    setHoveredStage(index);
  };

  const handleMouseLeave = () => {
    setHoveredStage(null);
  };

  const handleAddNotes = () => {

    setOPenNotes(true)
  }

  const handlecancelNotes = () => {
    setOPenNotes(false)
  }

  useEffect(() => {
    setAppliedData("hello");
  }, [appliedData])


  return (
    <div className='w-full flex flex-col justify-center items-start py-10 px-4 sm:px-10 lg:px-32'>

      <div className='px-3 flex w-full flex-col'>
        <p className='lg:text-2xl font-bold text-lg'>Application Tracker</p>
        <p className='text-gray-500 mt-1 text-xs lg:text-base'>
          Review and apply to jobs you've matched with
        </p>
      </div>
      <div className='flex flex-col justify-center mb-14 w-full mt-10 bg-white border border-gray-300 rounded-xl px-5 py-7 sm:px-7 md:py-10'>

        {/* For empty selection  */}

        {appliedData.length > 0 ? 
        (<>
        <div className='flex flex-col'>
          <div className='flex flex-row items-center justify-between'>
            <p className='font-semibold text-gray-900 lg:text-lg text-sm md:text-xl'>Journeyman Plumber</p>
            <div className='flex flex-row items-center justify-center  space-x-2 border rounded-md px-1 py-1 lg:px-3 lg:py-1.5 hover:bg-slate-100 cursor-pointer'
              onClick={() => handleAddNotes()}
            >
              <FileText size={20} />
              <button className='font text-xs w-full' >Add Notes</button>
            </div>
          </div>

          <div className='flex flex-row items-center space-x-2 py-1 mt-3 text-gray-600 '>
            <Building2 size={18} />
            <span className='lg:text-sm text-xs text-gray-600 md:text-base'>G&C Plumbing & Heating LLC</span>
          </div>

          <div className='flex flex-row items-center space-x-2 py-1 text-gray-600 '>
            <MapPin size={18} />
            <span className='lg:text-sm text-xs text-gray-600 md:text-base'>Bellingham, MA, US</span>
          </div>

          <div className='flex flex-row items-center space-x-2 py-1 text-gray-600 '>
            <Clock size={18} />
            <span className='lg:text-sm text-xs text-gray-500 md:text-base'>Applied</span>
          </div>

          <div className="relative w-full mb-4">
            <div className='flex w-full mt-5'>
              <hr className="border-gray-400 w-full border opacity-70 absolute md:top-1/2 md:bottom-0 lg:bottom-0 bottom-5" />
            </div>

            <div className="flex flex-row justify-between items-center w-full relative z-10">

              {stages.map((stage, index) => (

                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleChangeTracker(index)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {hoveredStage === index && (
                    <span
                      className={`absolute text-nowrap mt-28 sm:mt-32  md:text-xs text-[8px] p-1 px-2 rounded-lg lg:mb-3 text-center text-white bg-slate-800 lg:bottom-20 md:bottom-20 bottom-10 sm:bottom-10 hover:scale-110`}
                    >
                      {stage.description}
                    </span>
                  )}


                  <span
                    className={`flex flex-col lg:w-14 md:w-12 md:h-12 lg:h-14 w-6 h-6 rounded-full items-center justify-center transition-transform duration-300 hover:scale-110
                    ${tracker === index
                        ? (index === 0
                          ? 'lg:border-8 md:border-4 border-4 border-sky-800 bg-white text-[#247BAF]'
                          : index === 1
                            ? 'lg:border-8 md:border-4 border-4 border-red-500 bg-white text-[#F24D4F]'
                            : index === 2
                              ? 'lg:border-8 md:border-4 border-4 border-[#E0E1E0] bg-white text-[#E0E1E0]'
                              : index === 3
                                ? 'lg:border-8 md:border-4 border-4 border-[#FFE066] bg-white text-[#FFE066]'
                                : index === 4
                                  ? 'lg:border-8 md:border-4 border-4 border-[#247BAF] bg-white text-[#247BAF]'
                                  : index === 5
                                    ? 'lg:border-8 md:border-4 border-4 border-[#217346] bg-white text-[#217346]'
                                    : ''
                        )
                        : 'lg:border-2 md:border-4 border-4 border-gray-400 bg-white text-sky-700'
                      }`}>

                    {<stage.icon size={"50%"} />}
                  </span>
                  <span
                    className={`lg:text-base text-[7px] sm:text-sm ${tracker === index
                      ? (index === 0
                        ? 'text-[#247BAF]'
                        : index === 1
                          ? 'text-[#F24D4F]'
                          : index === 2
                            ? 'text-[#E0E1E0]'
                            : index === 3
                              ? 'text-[#FFE066]'
                              : index === 4
                                ? 'text-[#247BAF]'
                                : index === 5
                                  ? 'text-[#217346]'
                                  : ''
                      )
                      : 'text-gray-500'
                      }`}
                  >
                    {stage.name}
                  </span>
                </div>
              ))}
            </div>

          </div>
          {openNotes && (
            <div className="fixed inset-0 flex-col bg-gray-600 bg-opacity-70 z-30 flex justify-center lg:p-10 md:p-5 p-3 items-center">
              <div className='flex flex-col lg:w-5/12 md:w-5/6 w-full h-auto justify-center items-center rounded-lg bg-white'>
                <span className='flex justify-between w-full px-4 py-2'>
                  <p className='font-bold text-start lg:text-2xl text-sm text-gray-900'>
                    Application Notes
                  </p>
                  <button
                    className='w-8 h-8 rounded-full flex justify-center items-center hover:bg-slate-300 cursor-pointer'
                    onClick={handlecancelNotes}
                  >
                    <X size={20} />
                  </button>
                </span>
                <div className='flex w-full mt-3'>
                  <hr className="border-gray-400  w-full border opacity-30" />
                </div>
                <span className='flex w-full px-3'>
                  <textarea className='w-full mt-3 h-44 border lg:text-base text-sm rounded-lg py-0.5 px-2' placeholder='Add your notes about this application...'></textarea>
                </span>

                <div className='flex flex-row space-x-2 py-3 justify-end items-end w-full mr-6'>
                  <button className='bg-gray-100 border p-2 rounded-md cursor-pointer lg:text-base text-sm' onClick={handlecancelNotes}>Cancel</button>
                  <button className='bg-primary p-2 text-white lg:text-base text-sm rounded-md'>Save Notes</button>
                </div>
              </div>

            </div>
          )}
        </div>
        </>
        ) : 
        <>
          <div className='flex flex-col items-center space-y-1 md:min-h-56 justify-center w-full'>
          <span className=' text-[#247BAF]'><Rocket size={50} /></span>
          <p className='text-lg font-semibold text-center'>No applications yet</p>
          <p className='md:text-base lg:text-base text-sm text-center text-gray-600'>Start applying to matched jobs to track them here!</p>
        </div>
        </>
        }

      </div>


    </div>
  )
}

export default Applied