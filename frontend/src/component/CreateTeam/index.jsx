import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createTeam } from '@/config/redux/action/teamAction';
import { Context } from '../Context';

export default function CreateTeam() {
    const [teamName, setTeamName] = useState("")
    const [filecontent, setFilecontent] = useState();
    
    const teamState = useSelector((state) => state.team);
    const {openCreateTeam, setOpenCreateTeam} = useContext(Context);
    const dispatch = useDispatch();

    const handleCreateTeam = async() => {
            dispatch(createTeam({
                token: localStorage.getItem("token"),
                teamName: teamName,
                file : filecontent
            }));
            if(teamState?.isError) {
                setOpenCreateTeam(true);
            }
            else {
                setOpenCreateTeam(false);
            }
    }
    
  return (
        <div className='bg-white w-full max-w-lg mx-4 p-6 rounded-xl shadow-xl flex justify-center items-center ring-2 ring-black flex-col gap-2'>
            {
                teamState?.message &&
                <p>{teamState?.message}</p>
            }
            <div className='flex w-full justify-between gap-3'>
                <div className='flex flex-col w-full'>
                    <label className="mb-1 text-gray-600 font-medium self-start">Team name</label>
                    <input type="text" className='w-full px-4 py-2 rounded-xl ring-blue-300 ring-2 bg-gray-200 border-gray-700  placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition' placeholder='Team name' name='degree' onChange={(e) => setTeamName(e.target.value)} required/>
                </div>
                <label htmlFor="fileUpload" className='self-end h-10 flex justify-center items-center'>
                    {
                        filecontent ?
                        <div className="Fab p-2 ring-2 ring-blue-200 rounded-lg hover:bg-blue-100 transition delay-50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="green" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                            </svg>
                        </div> :
                        <div className="Fab p-2 ring-2 ring-blue-200 rounded-lg hover:bg-blue-100 transition delay-50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </div>}
                </label>
                <input type="file" hidden id='fileUpload' onChange={(e) => setFilecontent(e.target.files[0])}/>
            </div>
            
            <button className='bg-blue-300 ring py-1 px-2 !mt-1 shadow-lg rounded-lg hover:bg-blue-500 hover:ring-2 transition delay-50' onClick={handleCreateTeam}>Create Team</button>
        </div>
  )
}
