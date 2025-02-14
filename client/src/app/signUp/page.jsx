'use client'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Building2, CheckCircle, Code, CreditCard, FileText, Mail, MapPin, X } from 'lucide-react'

import { useRouter } from 'next/navigation'
import axios from 'axios'

const CreateAccount = () => {
    const [step, setstep] = useState(1);
    const [jobtitle, setJobTitle] = useState("");
    const [jobTitleList, setJobTitleList] = useState([]);
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", password: "", OTP: null
    });

    const navigate = useRouter();


    const jobLevels = ['Intern', 'Graduate', 'Assistant', 'Operator', 'Technician', 'Representative',
        'Coordinator', 'Analyst', 'Specialist', 'Administrator', 'Officer', 'Consultant', 'Engineer',
        'Advisor', 'Supervisor', 'Lead', 'Manager', 'Senior', 'Principal', 'Director', 'Executive',
        'Group', 'Vice President (VP)', 'Chief'
    ]
    const totalstep = 13;
    var progressWidth = `${((step / totalstep) * 100)}%`;
    const handlestep = () => {
        if (step < totalstep) {
            setstep(step + 1)
        }
    }
    const handleBackStep = () => {
        if (step <= totalstep) {
            setstep(step - 1)
        }
    }
    const handleJobTitle = () => {
        if (jobtitle.trim() !== '') {
            setJobTitleList((titles) => [...titles, jobtitle])
            setJobTitle('');
        }
    }
   
    const removeListItem = (index) => {
        const updatedList = jobTitleList.filter((_, i) => i !== index);
        setJobTitleList(updatedList);
    }

    const handleChaneForm = (e) => {
        console.log(e.target.name, e.target.value)
        setFormData(() => ({ ...formData, [e.target.name]: e.target.value}));
        
    }
    const handleSignUpUser = async () => {
        try {
            const response = await axios.post('http://localhost:8087/api_v1/user/register',
                {
                    firstName: formData.name,
                    lastName: formData.phone,
                    email: formData.email,
                    password: formData.password
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                if(response.data.status_code=='201')
                {
                    console.log("User Registered: ", response.data);
                    handleSendOTP()
                }
           
        } catch (error) {
            console.log("Error registering user:", error.response?.data || error.message);
        }
    }
    const handleSendOTP = async () => {
        const response = await axios.post('http://localhost:8087/api_v1/auth/send-otp', {
            "type": 1,
            "email": formData.email
        },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        if (response.data.status_code == '201') {
            handlestep()
        }
        console.log("OTP Send : ", response.data)
    }

   

    useEffect(() => {
        console.log(formData.name)
    }, [formData])

    const hadleAddOTP = async () => {
        const response = await axios.put('http://localhost:8087/api_v1/auth/verify-otp',
            {
                otp: parseInt( formData.OTP),
                email: formData.email
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        if (response.data.status_code == '201') {
           console.log('Verified')
        }
        console.log("OTP Send : ", response.data)
    }


    const haldleUerSteps = () => {
        switch (step) {
            case 1:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-4'>
                        <span className='text-[#247BAF]'><Mail size={60} /></span>

                        <p className='text-xl font-bold text-center'>Create Your Account</p>
                        <div className='flex flex-col w-full space-y-3'>
                            <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg'
                                type='text'
                                name='name'
                                value={formData.name}
                                placeholder='Enter your name'
                                onChange={handleChaneForm}
                            />
                            <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg'
                                type='tel'
                                placeholder='Phone'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChaneForm} />
                            <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg'
                                type='password'
                                placeholder='Password'
                                name='password'
                                value={formData.password}
                                onChange={handleChaneForm} />
                        </div>

                        <div className='flex flex-col w-full space-y-3'>
                            <button className='w-full bg-[#217346] text-white p-2 rounded-lg font-semibold' onClick={handlestep}>Continue</button>
                            <button className='w-full bg-transparent border-2 border-[#217346] text-[#217346] p-2 rounded-lg font-medium' onClick={()=> navigate.push('/') } >Back</button>

                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-4'>
                        <span className='text-[#247BAF]'><Mail size={60} /></span>

                        <p className='text-xl font-bold text-center'>Create Your Account</p>
                        <div className='flex flex-col w-full space-y-3'>
                            <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg'
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChaneForm}
                                placeholder='Enter your email' />

                        </div>

                        <div className='flex flex-col w-full space-y-3'>
                            <button className='w-full bg-[#217346] text-white p-2 rounded-lg font-semibold' onClick={handleSignUpUser}>Continue</button>
                            <button className='w-full bg-transparent border-2 border-[#217346] text-[#217346] p-2 rounded-lg font-medium' onClick={handleBackStep}>Back</button>

                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-4'>
                        <span className='text-[#247BAF]'><Mail size={60} /></span>

                        <p className='text-xl font-bold text-center'>Verify Your Email</p>
                        <div className='flex flex-col w-full space-y-3'>
                            <input className='p-3 w-full border-2 border-[#247BAF] focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg'
                                type='text'
                                name='OTP'
                                value={formData.OTP}
                                onChange={handleChaneForm}
                                placeholder='Enter OTP'
                            />
                            <button className='text-sm text-start text-[#247BAF]'>Resend OTP</button>
                        </div>

                        <div className='flex flex-col w-full space-y-3'>
                            <button className='w-full bg-[#217346] text-white p-2 rounded-lg font-semibold' onClick={hadleAddOTP}>Continue</button>
                            <button className='w-full bg-transparent border-2 border-[#217346] text-[#217346] p-2 rounded-lg font-medium' onClick={handleBackStep}>Back</button>

                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-4'>
                        <span className='text-[#217346]'> <FileText size={48} /></span>
                        <p className='text-2xl font-bold '>Set Up Your Profile</p>
                        <div className='flex flex-col bg-[#FFE066] bg-opacity-20 p-4 space-y-3'>
                            <p className='px-2 font-normal text-base'>To get the most out of the platform, share as much information as possible about what you're looking for. The more we know, the better we can match you with your dream opportunities!</p>
                        </div>

                        <p className='text-sm text-start w-full'>Paste Your Resume</p>
                        <textarea className='w-full min-h-48 focus:outline-none rounded-lg border-2 focus:ring-1 focus:border-[#247BAF] border-[#247BAF] p-2' type='text' placeholder='Copy and paste your resume here...'>

                        </textarea>
                        <p className='text-sm text-start w-full'>Job Preferences</p>
                        <textarea className='w-full min-h-32  focus:outline-none rounded-lg border-2 focus:ring-1 focus:border-[#247BAF] border-[#247BAF] p-2' type='text'
                            placeholder='Tell us more the kind of job you are looking for your skill'></textarea>

                        <div className='flex flex-row w-full space-x-6 justify-between'>
                            <button className='w-full border-2 border-[#217346] text-[#217346] p-3 rounded-lg font-semibold' onClick={handleBackStep}> <span className='flex flex-row justify-center items-center space-x-2'><ArrowLeft size={20} /> <p>Back </p></span>  </button>
                            <button className='w-full bg-[#217346] text-white p-3 rounded-lg font-semibold' onClick={handlestep}>Continue</button>

                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-6'>
                        <p className='text-2xl font-bold text-center'>Job Title</p>
                        <p className='text-sm px-1'>We use job titles as the main way to lookup jobs
                            for you to match with. From your resume and explanation,
                            it looks like you're targeting these job titles - is that correct?</p>
                        <div className='flex flex-row  w-full space-x-3 mt-8'>
                            <input className='w-full flex py-2 p-2 border-2 border-[#247BAF] focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg'
                                type='email' placeholder='Job title' value={jobtitle} onChange={(e) => setJobTitle(e.target.value)} />
                            <button className='flex text-sm text-start bg-transparent rounded-lg border-2 border-[#217346] p-2 text-[#247BAF] px-6 py-2' onClick={handleJobTitle}>Add</button>
                        </div>

                        <div className='flex flex-wrap w-full flex-row relative'>
                            {jobTitleList.length > 0 ? (
                                jobTitleList.map((value, index) =>
                                    <div key={index} className='flex flex-row justify-center px-2 py-0.5 space-x-2 items-center bg-[#217346] bg-opacity-20 rounded-full'>
                                        <p className='text-[#217346] text-sm '>{value}</p>
                                        <span className='flex text-[#217346] text-xs cursor-pointer' onClick={() => removeListItem(index)}><X size={15} /></span>

                                    </div>
                                )
                            ) : (<></>)}
                        </div>

                        <div className='flex flex-row w-full space-x-6 justify-between'>
                            <button className='w-full border-2 border-[#217346] text-[#217346] p-3 rounded-lg font-semibold' onClick={handleBackStep}> <span className='flex flex-row justify-center items-center space-x-2'><ArrowLeft size={20} /> <p>Back </p></span>  </button>
                            <button className='w-full bg-[#217346] text-white p-3 rounded-lg font-semibold' onClick={handlestep}>Continue</button>

                        </div>
                    </div>
                )

            case 6:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-4'>


                        <p className='text-2xl font-extrabold text-center'>Job Level</p>
                        <p className='flex text-sm text-gray-600'>
                            Are you looking at job titles with any of the following keywords?
                            Select any of these terms that are relevant to your search.
                        </p>
                        <div className='flex flex-col w-full h-80 space-y-2 overflow-auto'>

                            {jobLevels.map((value, index) => (
                                <div className='flex flex-col w-full items-start' key={index}>
                                    <div className='flex flex-row space-x-5'>
                                        <input className='w-5 h-5 border-2 border-[#247BAF] focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg' type='checkbox' />
                                        <span className='text-base'>{value}</span>
                                    </div>
                                </div>
                            ))}

                        </div>

                        <div className='flex flex-row w-full space-x-6 justify-between'>
                            <button className='w-full border-2 border-[#217346] text-[#217346] p-3 rounded-lg font-semibold' onClick={handleBackStep}> <span className='flex flex-row justify-center items-center space-x-2'><ArrowLeft size={20} /> <p>Back </p></span>  </button>
                            <button className='w-full bg-[#217346] text-white p-3 rounded-lg font-semibold' onClick={handlestep}>Continue</button>

                        </div>
                    </div>
                )
            case 7:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-4'>


                        <p className='text-2xl font-extrabold text-center'>Excluded Keywords</p>
                        <p className='text-sm px-2'>Are there any other keywords that we should exclude from your results?</p>
                        <div className='flex flex-row  w-full space-x-3 mt-8'>
                            <input className='w-full flex py-2 p-2 border-2 border-[#247BAF] focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg'
                                type='email' placeholder='Enter keyword to exclude' />
                            <button className='flex text-sm text-start bg-transparent rounded-lg border-2 border-[#217346] p-2 text-[#247BAF] px-6 py-2' onClick={handleJobTitle}>Add</button>
                        </div>
                        <div className='flex w-full flex-row relative'>
                            {jobTitleList.length > 0 ? (
                                jobTitleList.map((value, index) =>
                                    <div key={index} className='flex flex-row justify-center px-2 py-0.5 space-x-2 items-center bg-[#217346] bg-opacity-20 rounded-full'>
                                        <p className='text-[#217346] text-sm '>{value}</p>
                                        <span className='flex text-[#217346] text-xs cursor-pointer' onClick={() => removeListItem(index)}><X size={15} /></span>

                                    </div>
                                )
                            ) : (<></>)}
                        </div>
                        <div className='flex flex-row w-full space-x-6 justify-between'>
                            <button className='w-full border-2 border-[#217346] text-[#217346] p-3 rounded-lg font-semibold' onClick={handleBackStep}> <span className='flex flex-row justify-center items-center space-x-2'><ArrowLeft size={20} /> <p>Back </p></span>  </button>
                            <button className='w-full bg-[#217346] text-white p-3 rounded-lg font-semibold' onClick={handlestep}>Continue</button>

                        </div>
                    </div>
                )
            case 8:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-6'>
                        <span className='flex w-full flex-col justify-center items-center space-y-4'>
                            <span className='text-[#247BAF]'><MapPin size={50} /></span>
                            <div className='flex w-full flex-col justify-center space-y-5'>
                                <p className='text-2xl font-bold text-center'>Location Preferences</p>
                                <p className='flex text-sm text-start'>What location and work type are you looking for?</p>
                                <div className='flex flex-col w-full space-y-1'>
                                    <p className='text-sm'>Location (City)</p>
                                    <input className='p-3 w-full border-2 border-[#247BAF]  focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg' type='email' placeholder='San Fransisco' />
                                </div>
                                <div className='flex w-full flex-col space-y-2'>
                                    <p className='text-base'>Work Type</p>
                                    <span className='flex flex-row space-x-2 items-center'>
                                        <input type='checkbox' className='w-4 h-4' />
                                        <p className='text-base font-medium'>Remote</p>
                                    </span>
                                    <span className='flex flex-row space-x-2 items-center'>
                                        <input type='checkbox' className='w-4 h-4' />
                                        <p className='text-base font-medium'>Hybrid/On-Location</p>
                                    </span>
                                </div>
                            </div>
                        </span>
                        <div className='flex flex-row w-full space-x-6 justify-between'>
                            <button className='w-full border-2 border-[#217346] text-[#217346] p-3 rounded-lg font-semibold' onClick={handleBackStep}> <span className='flex flex-row justify-center items-center space-x-2'><ArrowLeft size={20} /> <p>Back </p></span>  </button>
                            <button className='w-full bg-[#217346] text-white p-3 rounded-lg font-semibold' onClick={handlestep}>Continue</button>

                        </div>
                    </div>
                )
            case 9:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-4'>
                        <span className='flex flex-col w-full justify-center items-center space-y-4'>
                            <span className='text-[#247BAF]'><Building2 size={50} /></span>
                            <p className='text-2xl font-bold text-center'>Excluded Companies</p>
                            <p className='text-sm px-2'>Are there any companies you don't want to work for?</p>

                            <div className='flex flex-row  w-full space-x-3 mt-8'>
                                <input className='w-full flex py-3 p-3 border-2 border-[#247BAF] focus:outline-none focus:ring-1 text-sm focus:ring-[#247BAF] rounded-lg' type='email' placeholder='Enter company to exclude...' />
                                <button className='flex text-sm text-start bg-transparent rounded-lg border-2 border-[#217346] p-2 text-[#247BAF] px-6 py-2'>Add</button>
                            </div>

                        </span>
                        <div className='flex flex-row w-full space-x-6 justify-between'>
                            <button className='w-full border-2 border-[#217346] text-[#217346] p-3 rounded-lg font-semibold' onClick={handleBackStep}> <span className='flex flex-row justify-center items-center space-x-2'><ArrowLeft size={20} /> <p>Back </p></span>  </button>
                            <button className='w-full bg-[#217346] text-white p-3 rounded-lg font-semibold' onClick={handlestep}>Continue</button>

                        </div>
                    </div>
                )
            case 10:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-6'>

                        <span className='flex flex-col justify-center items-center space-y-4'>
                            <span className='text-[#247BAF]'><Code size={50} /></span>
                            <p className='text-2xl font-bold text-center'>Excluded Technologies</p>
                            <p className='text-sm px-2'>
                                Are there any technologies or industries you don't want to work with?
                            </p>

                        </span>
                        <div className='flex flex-row  w-full space-x-3 mt-8'>
                            <input className='w-full flex py-3 p-3 border-2 border-[#247BAF] focus:outline-none focus:ring-1 text-sm focus:ring-[#247BAF] rounded-lg' type='email' placeholder='Enter technologies to exclude...' />
                            <button className='flex text-sm text-start bg-transparent rounded-lg border-2 border-[#217346] p-2 text-[#247BAF] px-6 py-2'>Add</button>
                        </div>

                        <div className='flex flex-row w-full space-x-6 justify-between'>
                            <button className='w-full border-2 border-[#217346] text-[#217346] p-3 rounded-lg font-semibold' onClick={handleBackStep}> <span className='flex flex-row justify-center items-center space-x-2'><ArrowLeft size={20} /> <p>Back </p></span>  </button>
                            <button className='w-full bg-[#217346] text-white p-3 rounded-lg font-semibold' onClick={handlestep}>Continue</button>

                        </div>
                    </div>
                )
            case 11:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-6'>
                        <span className='flex flex-col justify-center items-center space-y-4'>
                            <span className='text-[#217346]'><Code size={50} /></span>

                            <p className='text-2xl font-bold text-center'>Required Technologies</p>
                            <p className='text-sm px-2'>YWhat technologies or industries that must be present in the job description?</p>


                        </span>
                        <div className='flex flex-row  w-full space-x-3 mt-8'>
                            <input className='w-full flex py-2 p-2 border-2 border-[#247BAF] focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg' type='email' placeholder='Enter company to exclude' />
                            <button className='flex text-sm text-start bg-transparent rounded-lg border-2 border-[#217346] p-2 text-[#247BAF] px-6 py-2'>Add</button>
                        </div>
                        <div className='flex flex-row w-full space-x-6 justify-between'>
                            <button className='w-full border-2 border-[#217346] text-[#217346] p-3 rounded-lg font-semibold' onClick={handleBackStep}> <span className='flex flex-row justify-center items-center space-x-2'><ArrowLeft size={20} /> <p>Back </p></span>  </button>
                            <button className='w-full bg-[#217346] text-white p-3 rounded-lg font-semibold' onClick={handlestep}>Continue</button>

                        </div>
                    </div>
                )
            case 12:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-6'>
                        <span className='flex flex-col w-full justify-center items-center space-y-4'>
                            <span className='text-[#247BAF]'><CreditCard size={50} /></span>

                            <p className='text-2xl font-bold text-center'>Set Up Payment</p>
                            <span className='flex w-full px-2 py-2 rounded-lg flex-col bg-[#FFE066] bg-opacity-20 space-y-1'>
                                <p className='flex text-base'>Premium Plan</p>
                                <p className='text-gray-600 text-sm'>Get unlimited job matches and advanced features</p>
                                <p className='text-base font-medium'>$29.99/month</p>
                            </span>


                        </span>
                        <div className='flex flex-col  w-full space-y-4 mt-8'>
                            <input className='w-full flex py-2 p-2 border-2 border-[#247BAF] focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg' type='email' placeholder='Card number' />
                            <div className='flex flex-row w-full justify-between space-x-4'>
                                <input className='w-full flex py-2 p-2 border-2 border-[#247BAF] focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg' type='email' placeholder='MM/YY' />

                                <input className='w-full flex py-2 p-2 border-2 border-[#247BAF] focus:outline-none focus:ring-1 focus:ring-[#247BAF] rounded-lg' type='email' placeholder='CVV' />

                            </div>
                        </div>
                        <div className='flex flex-row w-full space-x-6 justify-between'>
                            <button className='w-full border-2 border-[#217346] text-[#217346] p-3 rounded-lg font-semibold' onClick={handleBackStep}> <span className='flex flex-row justify-center items-center space-x-2'><ArrowLeft size={20} /> <p>Back </p></span>  </button>
                            <button className='w-full bg-[#217346] text-white p-3 rounded-lg font-semibold' onClick={handlestep}>Complete Setup</button>

                        </div>
                    </div>
                )
            case 13:
                return (
                    <div className='flex w-full flex-col justify-center items-center space-y-6'>
                        <span className='flex flex-col w-full justify-center items-center space-y-4'>
                            <span className='text-[#217346]'><CheckCircle size={50} /></span>

                            <p className='text-2xl w-full font-black text-center font-alatsi'>Welcome to Your Smart Job Search!</p>

                            <p className='text-sm text-center'>Your profile is ready. Let's find your perfect job match.</p>

                        </span>

                        <div className='flex flex-row w-full justify-center space-x-6'>
                            <button className=' bg-[#217346] text-white p-3 rounded-lg font-semibold' onClick={ navigate.push('/jobFeed')}>Get Started</button>

                        </div>
                    </div>
                )
            default: return (
                <div className=''></div>
            )
        }
    }

    return (
        <div className="flex w-full  flex-col min-h-screen justify-center items-center">

            <div className='flex flex-col w-full lg:w-2/6 h-full shadow-lg bg-white justify-center items-center space-y-4 my-20 py-8 px-6 rounded-2xl'>

                {/* For Progress Bar  */}
                {step < 12 && (
                    <div className="w-full rounded-3xl">

                        <div className="w-full h-1.5 bg-gray-200 ">
                            <div className='flex justify-start items-start h-1.5 bg-green-600 rounded-3xl' style={{ width: progressWidth }}></div>
                        </div>
                        <p className='text-sm text-center mt-2'>{`Step ${step} of ${totalstep}`}</p>


                    </div>
                )}



                {haldleUerSteps()}

            </div>
        </div>
    )
}

export default CreateAccount