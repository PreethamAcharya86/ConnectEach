import { BASE_URL } from '@/config'
import styles from './style.module.css'
import { getAboutUser, getAllUsers, getConnectionRequest, getMyConnections, searchUsers, sendConnectionRequest } from '@/config/redux/action/authAction'
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { authEmptyMessage } from '@/config/redux/reducer/authReducer'

export default function Discover() {

    const authState = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const router = useRouter();
    const [searchData, setSearchData] = useState("")
  
    const isConnected = (userId) => {
        return authState?.myConnections?.some(
            (conn) =>
            conn.status_accepted === true &&
            conn.userId?._id === userId
        );
    }
    const requestSent = (userId) => {
        return authState?.connections?.some(
            (conn) =>
            conn.userId === authState?.user?.userId?._id &&
            conn.connectionId._id === userId &&
            conn.status_accepted === null
        );
    }
    useEffect(() => {
        dispatch(getAboutUser({ token : localStorage.getItem("token") }))
        if(!authState.all_profile_fetched) {
            dispatch(getAllUsers());
        }
    },[])
    useEffect(() => {
        if(authState?.message) {
            setTimeout(() => {
                dispatch(authEmptyMessage())
            }, 3000)
        }
    }, [authState.message])
    useEffect(() => {
        dispatch(getMyConnections({ token : localStorage.getItem("token") }))
        dispatch(getConnectionRequest({ token : localStorage.getItem("token") }))
    },[])
    useEffect(() => {
        getAboutUser({ token : localStorage.getItem("token") });
        dispatch(authEmptyMessage())
    }, [authState.user])
    return (
        <UserLayout>
            <DashBoardLayout>
                <div className='flex flex-col'>
                    <h2 className='text-xl font-semibold'>Discover people</h2>
                    <div className='flex gap-1 w-full justify-center hover:scale-101 transition delay-50 items-center p-2 '> 
                        <input type="text" placeholder='Discover' className='className="w-full px-4 py-2 rounded-lg w-2/3 focus:shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-500 ring-2 ring-blue-400' 
                        value = {searchData} 
                        onChange={(e) => {
                            setSearchData(e.target.value);
                            dispatch(searchUsers({ userData : searchData}));
                            dispatch(authEmptyMessage())
                        }}/>
                        <button className='p-2 rounded-md ring-2 ring-blue-400 hover:bg-blue-400 transistion delay-50' onClick={() => {
                            dispatch(searchUsers({ userData : searchData}))
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </div>
                        {
                            authState?.get_users?.length !== 0 ? 
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:px-2 px-8 !mt-4 !mb-4'>
                                {authState?.get_users?.map((user) => {
                                    return (
                                        <div key={user._id} className='bg-gradient-to-br from-blue-100 via-white to-blue-200 flex w-full p-2 hover:shadow-xl hover:scale-[1.02] transition h-65 delay-100 shadow-lg cursor-pointer gap-2 flex-col rounded-md' onClick={() => {
                                            router.push(`/viewProfilePage/${user.userId.username}`)
                                        }}>
                                            <div className='flex flex-col '>
                                                <img src={`${BASE_URL}/${user.userId.backgroundImage}`} alt="Background image" className='w-full h-25 rounded-lg object-cover' />
                                                <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="User profile" className='object-cover h-20 w-20 rounded-full absolute !mt-12 !ml-2' />
                                            </div>
                                            <div className='flex flex-col pt-6 pl-4'>
                                                <h1 className='font-bold'>{user.userId.name}</h1>
                                                {
                                                    user.bio &&
                                                    <p className='line-clamp-2'>{user.bio}</p>
                                                }
                                            </div>
                                            {
                                                authState?.user?.userId?._id === user.userId._id ?
                                                <div className='flex px-1 !mt-auto justify-center items-cente'>
                                                    <button className='bg-blue-400 px-6 py-1 hover:bg-blue-500  transition delay-100 ring-2 ring-blue-400 hover:ring-black ring-inset rounded-lg text-white' onClick={() => {
                                                        router.push("/profile")
                                                    }}>
                                                        View Profile
                                                    </button>
                                                </div> :
                                                <div className='flex px-1 !mt-auto justify-center items-center'>
                                                {
                                                    isConnected(user.userId._id) ?
                                                    (
                                                        <div className='bg-white ring-black ring-2 px-4 py-1 rounded-lg'>
                                                            Connected
                                                        </div> )
                                                    :
                                                    requestSent(user.userId._id) ? 
                                                    (
                                                        <div className='bg-gray-200 ring-black ring-2 px-4 py-1 rounded-lg'>
                                                            Pending
                                                        </div> 
                                                    )
                                                    : (
                                                        <button className='bg-blue-400 px-6 py-1 hover:bg-blue-500  transition delay-100 ring-2 ring-blue-400 hover:ring-black ring-inset rounded-lg'   
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                dispatch(sendConnectionRequest({ 
                                                                    token: localStorage.getItem("token"),
                                                                    connectionId: user.userId._id
                                                            }));
                                                            dispatch(getMyConnections({ token: localStorage.getItem("token") }))
                                                        }}>Connect</button> 
                                                    )
                                                }
                                            </div>
                                            }
                                        </div>
                                    )
                                })} 
                            </div> :
                            searchData ?
                            <div className='flex w-full h-full justify-center items-center'>
                                <p className='text-xl font-semibold text-gray-400 py-20'>User not found!</p>
                            </div> : <div></div>
                        }   
                    <div className='flex justify-center gap-2 items-center !mt-5'>
                        <p className='text-xl text-center font-semibold'>
                            All Peoples
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:px-2 px-8 !mt-4 !mb-4'>
                        {
                            authState?.all_users.length !==0 && authState?.all_users?.filter(user => user?.userId?._id !== authState?.user?.userId?._id).map((user) => {
                                return (
                                    <div key={user._id} className='bg-gradient-to-br from-blue-100 via-white to-blue-200 flex w-full p-2 hover:shadow-xl hover:scale-[1.02] transition h-65 delay-100 shadow-lg cursor-pointer gap-2 flex-col rounded-md' onClick={() => {
                                        router.push(`/viewProfilePage/${user.userId.username}`)
                                    }}>
                                        <div className='flex flex-col '>
                                            <img src={`${BASE_URL}/${user.userId.backgroundImage}`} alt="Background image" className='w-full h-25 rounded-lg object-cover' />
                                            <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="User profile" className='object-cover h-20 w-20 rounded-full absolute !mt-12 !ml-2' />
                                        </div>
                                        <div className='flex flex-col pt-6 pl-4'>
                                            <h1 className='font-bold'>{user.userId.name}</h1>
                                            {
                                                user.bio &&
                                                <p className='line-clamp-2'>{user.bio}</p>
                                            }
                                        </div>
                                        <div className='flex px-1 !mt-auto justify-center items-center'>
                                            {
                                                isConnected(user.userId._id) ?
                                                (
                                                    <div className='bg-white ring-black ring-2 px-4 py-1 rounded-lg'>
                                                        Connected
                                                    </div> )
                                                :
                                                requestSent(user.userId._id) ? 
                                                (
                                                    <div className='bg-gray-200 ring-black ring-2 px-4 py-1 rounded-lg'>
                                                        Pending
                                                    </div> 
                                                )
                                                : (
                                                    <button className='bg-blue-400 px-6 py-1 hover:bg-blue-500  transition delay-100 ring-2 ring-blue-400 hover:ring-black ring-inset rounded-lg' onClick={(e) => {
                                                        e.stopPropagation()
                                                        dispatch(sendConnectionRequest({ 
                                                            token: localStorage.getItem("token"),
                                                            connectionId: user.userId._id
                                                        }));
                                                        dispatch(getMyConnections({ token: localStorage.getItem("token") }))
                                                    }}>Connect</button> 
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}