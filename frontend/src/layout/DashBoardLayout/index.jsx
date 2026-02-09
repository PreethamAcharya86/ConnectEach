import React, { useEffect, useState } from 'react'
import styles from './style.module.css'
import { useRouter } from 'next/router'
import { authEmptyMessage } from '@/config/redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getConnectionRequest, getMyConnections } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import { postEmptyMessage } from '@/config/redux/reducer/postReducer';
import { teamEmptyMessage } from '@/config/redux/reducer/teamReducer';
import { CircleLoader, DotLoader, HashLoader, MoonLoader, PuffLoader } from 'react-spinners';

export default function DashBoardLayout({ children }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const postState = useSelector((state) => state.posts);
    const teamState = useSelector((state) => state.team);
    const [active, setActive] = useState(""); 

    useEffect(() => {
        if(authState?.message) {
            setTimeout(() => {
                dispatch(authEmptyMessage())
            }, 3000)
        }
    }, [authState.message])
    useEffect(() => {
        if(postState?.message) {
            setTimeout(() => {
                dispatch(postEmptyMessage())
            }, 3000)
        }
    }, [postState.message])
    useEffect(() => {
        if(teamState?.message) {
            setTimeout(() => {
                dispatch(teamEmptyMessage())
            }, 3000)
        }
    }, [teamState.message])
    useEffect(() => {
        if(!authState.isTokenThere && !authState.logedIn && authState.isError) {
            router.push("/login")
        }
    },[authState.isTokenThere])
    useEffect(() => {
        if(localStorage.getItem('token') === null) {
            router.push("/login")
        }
        dispatch(getConnectionRequest({ token : localStorage.getItem("token") }))
        dispatch(getMyConnections({ token : localStorage.getItem("token")} ))
        setActive(router.pathname);
    },[])
    
    return (
        <div className="main_container !mb-auto !mt-2">
             <div className= {`${styles.homeContainer} homeContainer flex justify-between items-start`}>
                <div className={`${styles.navigate} homeContainer_left rounded p-1 flex flex-col hidden md:flex justify-start items-start gap-2 w-full`}>
                    <div className='flex flex-col w-full gap-2'>
                        <p className='text-center text-xl font-semibold w-40'>Your profile</p>
                        <div className="flex w-full p-0.5 cursor-pointer ring-2 ring-blue-400 hover:shadow-xl transition delay-100 shadow-lg gap-2 flex-col rounded-md" onClick={() => {
                            router.push("/profile")
                        }}>
                            <div className='flex flex-col'>
                                <img src={`${BASE_URL}/${authState?.user?.userId?.backgroundImage}`} alt="Background image" className='w-full h-20 rounded-lg object-cover' />
                                <img src={`${BASE_URL}/${authState?.user?.userId?.profilePicture}`} alt="User profile" className='object-cover h-16 w-16 rounded-full absolute !mt-12 !ml-2' />
                                </div>
                                    <div className='flex flex-col pt-6 gap-2 p-1'>
                                        <h1 className='font-bold'>{authState?.user?.userId?.name}</h1>
                                        <p className='line-clamp-4 text-gray-500'>{authState?.user?.bio}</p>
                                        <div className='flex px-1 items-end justify-center text-center rounded-lg bg-blue-500'>
                                            <p className='font-semibold text-white'>
                                                {authState?.user?.skills?.length} Skills
                                            </p>
                                        </div>
                                        <div className='flex px-1 items-end bg-blue-500 justify-center text-center rounded-lg'>
                                            <p className='font-semibold text-white'>
                                                {authState?.myConnections?.filter((connection) => connection.status_accepted === true ).length} Connections
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div className='flex p-1 ring-2 justify-center items-center w-full rounded-lg ring-blue-400 hover:ring-blue-500 hover:shadow-xl transistion hover:bg-blue-500 bg-blue-200 delay-50' onClick={() => {
                            router.push("/profile")
                        }}>
                            <button className='cursor-pointer' >View Profile</button>
                        </div>
                </div> 
                <div className="feedContainer justify-center w-full md:px-8 px-1 items-center">
                    {
                        authState?.message &&
                        <div className='fixed top-5 left-0 right-0 md:left-1/2 transform md:-translate-x-1/2 bg-white border shadow-lg rounded-lg px-4 py-2 z-100 justify-between flex'>
                            {
                                authState?.message?.ErrMsg &&
                                    <p className='text-lg text-red-500 font-semibold w-full text-center'>
                                        {authState.message.ErrMsg}
                                    </p>
                            }
                            {
                                authState?.message?.message &&
                                <p className='text-lg font-semibold w-full text-center'>
                                    {authState.message.message}
                                </p>
                            }
                            <p className='flex h-8 p-1 bg-red-100 rounded-lg justify-center items-center hover:text-red-400' onClick={() => {
                                dispatch(authEmptyMessage())
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </p>
                        </div>
                    }
                    {
                        postState?.message &&
                        <div className='fixed top-5 left-0 right-0 md:left-1/2 transform md:-translate-x-1/2 bg-white border shadow-lg rounded-lg px-4 py-2 z-100 justify-between flex'>
                        {
                            postState?.message?.ErrMsg &&
                            <p className='text-lg text-red-500 font-semibold w-full text-center'>
                                {postState.message.ErrMsg}
                            </p>
                        }
                        {
                            postState?.message?.message &&
                            <p className='text-lg font-semibold w-full text-center'>
                                {postState.message.message}
                            </p>
                        }
                                
                            <p className='flex h-8 p-1 bg-red-100 rounded-lg justify-center items-center hover:text-red-400' onClick={() => {
                                dispatch(postEmptyMessage())
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </p>
                        </div>
                    }  
                    {
                        teamState?.message &&
                        <div className='fixed top-5 left-0 right-0 md:left-1/2 transform md:-translate-x-1/2 bg-white border shadow-lg rounded-lg px-4 py-2 z-100 justify-between flex'>
                            {
                                teamState?.message?.ErrMsg &&
                                    <p className='text-lg text-red-500 font-semibold w-full text-center'>
                                        {teamState.message.ErrMsg}
                                    </p>
                            }
                            {
                                teamState?.message?.message &&
                                <p className='text-lg font-semibold w-full text-center'>
                                    {teamState.message.message}
                                </p>
                            }
                            <p className='flex h-8 p-1 bg-red-100 rounded-lg justify-center items-center hover:text-red-400' onClick={() => {
                                dispatch(teamEmptyMessage())
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </p>
                        </div>
                    } 
                    {
                        authState.isLoading &&
                        <div className='fixed inset-0 w-screen h-screen flex justify-center items-center z-200'>
                            <PuffLoader loading = {true} color='black' size={60}/>
                        </div>
                    }
                    {
                        postState.isLoading &&
                        <div className='fixed inset-0 w-screen h-screen flex justify-center items-center z-200'>
                            <PuffLoader loading = {true} color='black' size={60}/>
                        </div>
                    }
                    {
                        teamState.isLoading &&
                        <div className='fixed inset-0 w-screen h-screen flex justify-center items-center z-200'>
                            <PuffLoader loading = {true} color='black' size={60}/>
                        </div>
                    }
                    {children}
                </div>
                <div className="extraContainer hidden w-full md:flex bg-gray-100 flex-col h-[calc(100vh-118px)]">
                    <p className='font-semibold text-center p-1 rounded-lg border bg-white shadow-lg'>
                        Top Profiles
                    </p>
                    <div className={`${styles.modern_scrollbar} flex flex-col p-2 overflow-y-auto space-y-2`}>
                    {authState.all_profile_fetched && authState.all_users.map((profile) => {
                        return (
                            <div className='flex flex-col p-1 bg-white w-full cursor-pointer border-1 border-transparent hover:ring-3 hover:scale-104 transition-all hover:shadow-[0_4px_12px_rgba(96,165,250,0.3)] delay-50 !mt-2 rounded-xl shadow-lg  gap-2 ring-2 ring-blue-400 bg-white' key={profile._id} onClick={() => { 
                                router.push(`/viewProfilePage/${profile.userId.username}`);
                            }}>
                                <img src={`${BASE_URL}/${profile?.userId?.profilePicture}`} alt="User profile" className='h-8 w-8 rounded-full'/>
                                <p className='font-semibold'>{profile?.userId?.name}</p>
                                <p className='font-light italic text-sm'>{profile?.bio}</p>
                            </div>
                        )
                    })}
                    </div>
                </div>
            </div>
            
        </div>
  )
}
