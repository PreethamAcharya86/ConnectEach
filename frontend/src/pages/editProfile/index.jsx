import { deleteEducation, deleteWorkHistory, getAboutUser, updateProfile, updateUser } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/userLayout'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function index() {
    
    const authState =  useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter()

    const [name, setName ] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [currentPost, setCurrentPost] = useState("");
    const [inputData, setInputData] = useState({ school: "", degree: "", fieldOfStudy: ""});
    const [workData, setWorkData] = useState({ company: "", position: "", years: ""});
    const [openEducationInput, setOpenEducationInput] = useState(false);
    const [openWorkInput, setOpenWorkInput] = useState(false);


    const handleEductaionInput = (e) => {
        const { name, value } = e.target;
        setInputData({ ...inputData, [name]: value });
    }
    const handleWorkInput = (e) => {
        const {name, value} = e.target;
        setWorkData({ ...workData, [name]: value });
    }

    const handleSubmit = () => {
        dispatch(updateUser({
            token: localStorage.getItem("token"),
            name,
            username,
            email,
            bio,
            currentPost,
            router
        }));
        const body = {
            token: localStorage.getItem("token"),
        }
        if(inputData.school || inputData.degree || inputData.fieldOfStudy){
            body.education = [inputData];
        }

        if(workData.company || workData.position || workData.years){
            body.pastWork = [workData];
        }

        if(body.education || body.pastWork) {
            dispatch(updateProfile(body));
        }
        
    }
    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }, [])
    useEffect(() => {
        setName(authState?.user?.userId?.name ?? "");
        setUsername(authState?.user?.userId?.username ?? "");
        setEmail(authState?.user?.userId?.email ?? "");
        setBio(authState?.user?.bio ?? "");
        setCurrentPost(authState?.user?.currentPost ?? "");
    }, [authState.user]);
    return (
        <UserLayout>
            <DashBoardLayout>
                <div className='flex flex-col gap-4 justify-center items-center'>
                    <h1 className='text-lg font-bold'>Edit user Profile</h1>
                    <div className='flex flex-col items-center justify-center w-2/3 md:px-0'>
                        <label className="mb-1 text-gray-600 font-medium self-start">Name</label>
                        <input
                        type="text"
                        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        placeholder={authState?.user?.userId?.name}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                        />
                    </div>
                    <div className='flex flex-col items-center justify-center w-2/3 md:px-0'>
                        <label className="mb-1 text-gray-600 font-medium self-start">User Name</label>
                        <input
                        type="text"
                        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        placeholder={authState?.user?.userId?.username}
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                        />
                    </div>
                    <div className='flex flex-col items-center justify-center w-2/3 md:px-0'>
                        <label className="mb-1 text-gray-600 font-medium self-start">Email</label>
                        <input
                        type="text"
                        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        placeholder={authState?.user?.userId?.email}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        />
                    </div>
                    <div className='flex flex-col items-center justify-center w-2/3 md:px-0'>
                        <label className="mb-1 text-gray-600 font-medium self-start">Bio</label>
                        <textarea
                        rows={2}
                        type="text"
                        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        placeholder={authState?.user?.bio}
                        value={bio}
                        onChange={(e) => {
                            setBio(e.target.value)
                        }}
                        />
                    </div>
                    <div className='flex flex-col items-center justify-center w-2/3 md:px-0'>
                        <label className="mb-1 text-gray-600 font-medium self-start">Profession</label>
                        <select
                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-800 text-gray-600 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                            value={currentPost}
                            onChange={(e) => setCurrentPost(e.target.value)}
                        >
                            <option value="">Select Profession</option>
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Engineer">Engineer</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Designer">Designer</option>
                            <option value="Developer">Developer</option>
                            <option value="Business">Business</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {/* Education input */}
                    <div className='flex flex-col items-center justify-center w-2/3 md:px-0'>
                        <label className="mb-1 text-gray-600 font-medium self-start">Education</label>
                        {
                            authState?.user?.education?.map((el) => {
                                return (
                                <div className='w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition !mb-5' key={el._id}>
                                    <label className="mb-1 text-gray-600 font-medium self-start">School/College</label>
                                    <input type="text" name = "school" className='w-full px-4 py-2 rounded-xl bg-gray-200 border-gray-700 border  text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition' placeholder='School/College' value={el.school}  readOnly/>
                                    <label className="mb-1 text-gray-600 font-medium self-start">Degree</label>
                                    <input type="text" className='w-full px-4 py-2 rounded-xl  border bg-gray-200 border-gray-700 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition' placeholder='Degree' name='degree' value={el.degree} readOnly/>
                                    <label className="mb-1 text-gray-600 font-medium self-start">Field of study</label>
                                    <input type="text" className='w-full px-4 py-2 rounded-xl  border bg-gray-200 border-gray-700 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition' name='fieldOfStudy' value={el.fieldOfStudy} readOnly/>
                                    <button className='bg-gray-200 py-1 px-2 !mt-1 shadow-lg rounded-lg' onClick={() => {
                                        dispatch(deleteEducation({
                                            token: localStorage.getItem("token"),
                                            eduId: el._id
                                        }))
                                    }}>
                                        <i className="fa-solid fa-trash text-sm text-red-400"></i>
                                    </button>
                                </div>
                                )
                            })
                        }
                        {
                            !openEducationInput &&
                            <button className='p-1.5 rounded-full shadow-[0_8px_12px_rgba(96,165,250,0.3)]' onClick={() => setOpenEducationInput(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="blue" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>
                        }
                        {
                            openEducationInput &&
                            <div className='w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition'>
                            <label className="mb-1 text-gray-600 font-medium self-start">School/College</label>
                            <input type="text" name = "school" className='w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition' onChange={handleEductaionInput} required/>
                            <label className="mb-1 text-gray-600 font-medium self-start">Degree</label>
                            <input type="text" className='w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition'  name='degree' onChange={handleEductaionInput} required/>
                            <label className="mb-1 text-gray-600 font-medium self-start">Field of study</label>
                            <input type="text" className='w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition' name='fieldOfStudy' onChange={handleEductaionInput} required/>
                        </div>
                        }
                        
                    </div>

                    {/* Work History input */}
                    <div className='flex flex-col items-center justify-center w-2/3 md:px-0'>
                        <label className="mb-1 text-gray-600 font-medium self-start">Work Experience</label>
                        {
                            authState?.user?.pastWork?.map((el) => {
                                return (
                                <div className='w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition !mb-5' key={el._id}>
                                    <label className="mb-1 text-gray-600 font-medium self-start">Company</label>
                                    <input type="text" name = "company" className='w-full px-4 py-2 rounded-xl bg-gray-200 border-gray-700 border  text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition' placeholder='Company' value={el.company} readOnly/>
                                    <label className="mb-1 text-gray-600 font-medium self-start">Position</label>
                                    <input type="text" className='w-full px-4 py-2 rounded-xl  border bg-gray-200 border-gray-700 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition' placeholder='Position' name='position' value={el.position} readOnly/>
                                    <label className="mb-1 text-gray-600 font-medium self-start">Years</label>
                                    <input type="text" className='w-full px-4 py-2 rounded-xl  border bg-gray-200 border-gray-700 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition' name='years' value={el.years} readOnly/>
                                    <button className='bg-gray-200 py-1 px-2 !mt-1 shadow-lg rounded-lg' onClick={() => {
                                        dispatch(deleteWorkHistory({
                                            token: localStorage.getItem("token"),
                                            workId: el._id
                                        }))
                                    }}>
                                        <i className="fa-solid fa-trash text-sm text-red-400"></i>
                                    </button>
                                </div>
                                )
                            })
                        }
                        {
                            !openWorkInput &&
                            <button className='p-1.5 rounded-full shadow-[0_8px_12px_rgba(96,165,250,0.3)]' onClick={() => setOpenWorkInput(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="blue" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>
                        }
                        
                        {
                            openWorkInput &&
                            <div className='w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition'>
                            <label className="mb-1 text-gray-600 font-medium self-start">Company</label>
                            <input type="text" name = "company" className='w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition' onChange={handleWorkInput} required/>
                            <label className="mb-1 text-gray-600 font-medium self-start">Position</label>
                            <input type="text" className='w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition'  name='position' onChange={handleWorkInput} required/>
                            <label className="mb-1 text-gray-600 font-medium self-start">Years</label>
                            <input type="text" className='w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition' name='years' onChange={handleWorkInput} required/>
                        </div>
                        }
                        
                        
                    </div>
                    <div className='flex w-full p-2 justify-center items-center'>
                        <div className='flex'>
                            <button className='py-2 px-5 bg-blue-100 ring-2 hover:bg-blue-400 ring-blue-400 rounded-lg' onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                    
                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}
