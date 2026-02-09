import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/userLayout'
import CreateTeam from '@/component/CreateTeam'
import { Context } from '@/component/Context'
import React, { useEffect, useRef, useState } from 'react'
import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction'
import { useDispatch, useSelector } from 'react-redux'
import {  teamEmptyMessage } from '@/config/redux/reducer/teamReducer'
import { getMyTeam } from '@/config/redux/action/teamAction'
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'

export default function index() {
    const [openCreateTeam, setOpenCreateTeam] = useState(false);
    const teamState = useSelector((state) => state.team)
    const overlayRef = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getMyTeam({
            token : localStorage.getItem("token")
        }))
    },[teamState.myTeams.length])
    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        dispatch(getAllUsers({ token :localStorage.getItem("token")}))
        
    }, [])
    return (
        <UserLayout>
            <DashBoardLayout>
                <div className='p-4'>
                    <h1 className='text-xl font-bold !mb-2'>Your Teams</h1>
                    <div>
                        <button className='bg-blue-100 p-2 ring-2 ring-blue-400  cursor-pointer hover:bg-blue-400 transition delay-100 rounded-lg ' onClick={() => {
                            dispatch(teamEmptyMessage())
                            setOpenCreateTeam(!openCreateTeam);
                        }}>Create Team</button>
                    </div>
                    {
                        teamState?.myTeams?.length === 0 &&
                        <div className='flex justify-center items-center flex-shrink-0'>
                            <img src="/images/not_in_any_team.png" alt="No team found" className='h-80 object-cover pt-20 '/>
                        </div>
                    }
                    <div className='grid md:grid-cols-2 gap-4 !mt-4'>
                        {
                            teamState?.myTeams?.map((team) => {
                                return (
                                    <div className='flex gap-2 p-2 rounded-lg ring-2 ring-blue-200 shadow-lg rounded hover:scale-104 transition delay-100 hover:shadow-[0_4px_12px_rgba(59,130,246,0.5)] bg-gradient-to-br from-blue-100 via-white to-blue-200' key={team._id} onClick={() => {
                                                router.push(`/team/${team._id}`)
                                    }}>
                                        <img src={`${BASE_URL}/${team.teamPitcure}`} alt="team icon" className='h-14 w-14 rounded-full' />
                                        <div className='flex flex-col px-2 w-full'>
                                            <h1 className='font-semibold'> {team.teamName} </h1>
                                            <div className='flex !mt-auto self-end items-center justify-center'>
                                            {
                                                team.members?.slice(0,3).map((member) => {
                                                    return (
                                                        <div  key={member._id}>
                                                            <img src={`${BASE_URL}/${member.profilePicture}`} className='h-5 w-5 rounded-full' />
                                                        </div>
                                                    )
                                                })
                                            }
                                            {team.members?.length > 3 && (
                                                <div className="-ml-3 h-8 w-8 flex items-center justify-center rounded-full bg-gray-300 text-xs font-semibold border-2 border-white">
                                                    +{team.members.length - 3}
                                                </div>
                                            )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <Context.Provider value = {{openCreateTeam, setOpenCreateTeam}}>
                        {
                            openCreateTeam &&
                            <div className='fixed inset-0 z-50 flex items-center justify-center 
                            bg-black/20 backdrop-blur-md' ref={overlayRef} onClick={(e) => {
                                if (overlayRef.current === e.target) {
                                    setOpenCreateTeam(false);
                                }
                            }}>
                                <CreateTeam/>
                            </div>
                        }
                    </Context.Provider>
                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}
