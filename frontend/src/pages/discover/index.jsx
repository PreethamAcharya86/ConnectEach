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
        dispatch(getAboutUser({ token: localStorage.getItem("token") }))
        if(!authState.all_profile_fetched) {
            dispatch(getAllUsers());
        }
    }, [])

    useEffect(() => {
        if(authState?.message) {
            setTimeout(() => {
                dispatch(authEmptyMessage())
            }, 3000)
        }
    }, [authState.message])

    useEffect(() => {
        dispatch(getMyConnections({ token: localStorage.getItem("token") }))
        dispatch(getConnectionRequest({ token: localStorage.getItem("token") }))
    }, [])

    useEffect(() => {
        getAboutUser({ token: localStorage.getItem("token") });
        dispatch(authEmptyMessage())
    }, [authState.user])

    const renderUserCard = (user) => {
        const isSelf = authState?.user?.userId?._id === user.userId._id;
        const connected = isConnected(user.userId._id);
        const pending = requestSent(user.userId._id);

        return (
            <div 
                key={user._id} 
                className='bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition duration-200 flex flex-col overflow-hidden group cursor-pointer'
                onClick={() => router.push(`/viewProfilePage/${user.userId.username}`)}
            >
                {/* Mini Cover Backdrop */}
                <div className='h-20 sm:h-22 w-full bg-slate-100 overflow-hidden relative'>
                    {user.userId.backgroundImage ? (
                        <img 
                            src={`${BASE_URL}/${user.userId.backgroundImage}`} 
                            alt="Cover" 
                            className='w-full h-full object-cover group-hover:scale-105 transition duration-300' 
                        />
                    ) : (
                        <div className='w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100' />
                    )}
                </div>

                {/* Avatar Overlap */}
                <div className='px-4 -mt-8 relative z-10 flex items-end justify-between'>
                    <img 
                        src={`${BASE_URL}/${user.userId.profilePicture}`} 
                        alt={user.userId.name} 
                        className='h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-md bg-white' 
                    />
                </div>

                {/* Content */}
                <div className='p-4 pt-2 flex flex-col flex-1'>
                    <h3 className='font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition truncate'>
                        {user.userId.name}
                    </h3>
                    <p className='text-xs text-slate-400 truncate'>
                        @{user.userId.username}
                    </p>
                    
                    {user.currentPost && (
                        <p className='text-xs font-semibold text-blue-700 mt-1 truncate'>
                            {user.currentPost}
                        </p>
                    )}

                    {user.bio ? (
                        <p className='text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed'>
                            {user.bio}
                        </p>
                    ) : (
                        <p className='text-xs text-slate-400 italic mt-1.5'>
                            ConnectEach Member
                        </p>
                    )}

                    {/* Action Button */}
                    <div className='mt-auto pt-3 border-t border-slate-100 flex items-center justify-end'>
                        {isSelf ? (
                            <button 
                                className='px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push("/profile");
                                }}
                            >
                                Your Profile
                            </button>
                        ) : connected ? (
                            <span className='px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-xl flex items-center gap-1.5'>
                                <span className='size-1.5 rounded-full bg-emerald-500'></span>
                                <span>Connected</span>
                            </span>
                        ) : pending ? (
                            <span className='px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-xl flex items-center gap-1.5'>
                                <span className='size-1.5 rounded-full bg-amber-500'></span>
                                <span>Pending</span>
                            </span>
                        ) : (
                            <button 
                                className='px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(sendConnectionRequest({ 
                                        token: localStorage.getItem("token"),
                                        connectionId: user.userId._id
                                    }));
                                    dispatch(getMyConnections({ token: localStorage.getItem("token") }));
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.765Z" />
                                </svg>
                                <span>Connect</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <UserLayout>
            <DashBoardLayout>
                <div className={`${styles.container} flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto rounded-3xl border border-slate-200/80 shadow-xs bg-white`}>
                    {/* Header */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100'>
                        <div className='flex items-center gap-3'>
                            <span className='p-2 bg-blue-50 text-blue-600 rounded-2xl'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </span>
                            <div>
                                <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight'>
                                    Discover Professionals
                                </h1>
                                <p className='text-xs sm:text-sm text-slate-500'>
                                    Connect and grow your network with talented peers
                                </p>
                            </div>
                        </div>

                        {/* Search Input Bar */}
                        <div className='relative w-full sm:w-72 md:w-80'>
                            <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder='Search people or skills...' 
                                className='w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition'
                                value={searchData} 
                                onChange={(e) => {
                                    setSearchData(e.target.value);
                                    dispatch(searchUsers({ userData: e.target.value }));
                                    dispatch(authEmptyMessage());
                                }}
                            />
                            {searchData && (
                                <button 
                                    onClick={() => {
                                        setSearchData("");
                                        dispatch(searchUsers({ userData: "" }));
                                    }}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search Results Display */}
                    {searchData && (
                        <div className='flex flex-col gap-4'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-base font-bold text-slate-800 flex items-center gap-2'>
                                    <span>Search Results</span>
                                    <span className='px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md'>
                                        {authState?.get_users?.length || 0}
                                    </span>
                                </h2>
                            </div>

                            {authState?.get_users && authState.get_users.length > 0 ? (
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                                    {authState.get_users.map(renderUserCard)}
                                </div>
                            ) : (
                                <div className='flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border border-slate-200/80 gap-2 text-center'>
                                    <p className='text-slate-600 font-semibold text-sm'>No users matching "{searchData}"</p>
                                    <p className='text-xs text-slate-400'>Try searching with a different name, username, or role</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* All Community Members */}
                    <div className='flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2'>
                                <span>All Community Members</span>
                                <span className='px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md font-semibold'>
                                    {authState?.all_users?.filter(u => u?.userId?._id !== authState?.user?.userId?._id).length || 0}
                                </span>
                            </h2>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                            {authState?.all_users && authState.all_users.length !== 0 && (
                                authState.all_users
                                    .filter(user => user?.userId?._id !== authState?.user?.userId?._id)
                                    .map(renderUserCard)
                            )}
                        </div>
                    </div>
                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}