import { acceptConnection, getAboutUser, getAllUsers, getMyConnections } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.css'
import clientServer, { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function MyConnections() {
    const dispatch = useDispatch();
    const router = useRouter();
    const authState = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState("pending"); // "pending" | "accepted"
    const [briefData, setBriefData] = useState({});
    const [loadingBriefId, setLoadingBriefId] = useState(null);
    const [openBriefId, setOpenBriefId] = useState({});
    const [briefCopiedId, setBriefCopiedId] = useState(null);

    const handleGetBrief = async (connectionUserId) => {
        if (openBriefId[connectionUserId]) {
            setOpenBriefId((prev) => ({ ...prev, [connectionUserId]: false }));
            return;
        }

        if (briefData[connectionUserId]) {
            setOpenBriefId((prev) => ({ ...prev, [connectionUserId]: true }));
            return;
        }

        const userProfile = authState.all_users?.find(
            (u) => u.userId?._id === connectionUserId || u.userId === connectionUserId
        );

        const payload = {
            name: userProfile?.userId?.name || "",
            currentPost: userProfile?.currentPost || "",
            bio: userProfile?.bio || "",
            skills: userProfile?.skills || [],
            education: userProfile?.education || [],
            pastWork: userProfile?.pastWork || [],
        };

        setLoadingBriefId(connectionUserId);
        try {
            const res = await clientServer.post("/summarize-profile", payload);
            if (res.data?.summary) {
                setBriefData((prev) => ({ ...prev, [connectionUserId]: res.data.summary }));
                setOpenBriefId((prev) => ({ ...prev, [connectionUserId]: true }));
            }
        } catch (err) {
            console.error("Failed to get brief", err);
            alert(err.response?.data?.message || "Failed to generate brief");
        } finally {
            setLoadingBriefId(null);
        }
    };

    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }))
        dispatch(getMyConnections({ token: localStorage.getItem("token") }))
    }, [])

    useEffect(() => {
        if(authState.myConnections.length !== 0) {
            dispatch(getMyConnections({ token: localStorage.getItem("token") }))
        }
    }, [authState.myConnections.length])

    useEffect(() => {
        if(!authState.all_profile_fetched) {
            dispatch(getAllUsers());
        }
    }, [])

    const pendingConnections = authState?.myConnections?.filter((c) => c.status_accepted == null) || [];
    const acceptedConnections = authState?.myConnections?.filter((c) => c.status_accepted === true) || [];

    return (
        <UserLayout>
            <DashBoardLayout>
                <div className={`${styles.container} flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto rounded-3xl border border-slate-200/80 shadow-xs bg-white`}>
                    {/* Header */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100'>
                        <div className='flex items-center gap-3'>
                            <span className='p-2 bg-blue-50 text-blue-600 rounded-2xl'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                            </span>
                            <div>
                                <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight'>
                                    My Connections
                                </h1>
                                <p className='text-xs sm:text-sm text-slate-500'>
                                    Manage your incoming requests and your professional network
                                </p>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className='flex items-center p-1 bg-slate-100 rounded-xl self-start sm:self-auto'>
                            <button
                                onClick={() => setActiveTab("pending")}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === "pending"
                                        ? 'bg-white text-blue-600 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <span>Pending</span>
                                <span className={`px-1.5 py-0.2 rounded-full text-2xs ${
                                    activeTab === "pending" ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {pendingConnections.length}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveTab("accepted")}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === "accepted"
                                        ? 'bg-white text-blue-600 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <span>Connected</span>
                                <span className={`px-1.5 py-0.2 rounded-full text-2xs ${
                                    activeTab === "accepted" ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {acceptedConnections.length}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Pending Requests Tab */}
                    {activeTab === "pending" && (
                        <div className='flex flex-col gap-4'>
                            {pendingConnections.length > 0 ? (
                                pendingConnections.map((connection) => (
                                    <div key={connection._id} className='flex flex-col'>
                                        <div 
                                            className='bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer'
                                            onClick={() => router.push(`/viewProfilePage/${connection.userId.username}`)}
                                        >
                                            <div className='flex items-center gap-3.5'>
                                                <img 
                                                    src={`${BASE_URL}/${connection.userId.profilePicture}`} 
                                                    alt={connection.userId.name} 
                                                    className='h-14 w-14 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0' 
                                                />
                                                <div className='overflow-hidden'>
                                                    <h3 className='font-bold text-slate-900 text-sm sm:text-base hover:text-blue-600 transition truncate'>
                                                        {connection.userId.name}
                                                    </h3>
                                                    <p className='text-xs text-slate-400 truncate'>
                                                        @{connection.userId.username}
                                                    </p>
                                                    <p className='text-xs text-slate-500 mt-0.5 truncate'>
                                                        {connection.userId.email}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className='flex items-center gap-2 self-end sm:self-auto'>
                                                {/* AI Brief button */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleGetBrief(connection.userId._id);
                                                    }}
                                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 transition cursor-pointer"
                                                    title="Get an AI summary about this candidate"
                                                >
                                                    {loadingBriefId === connection.userId._id ? (
                                                        <>
                                                            <span className="inline-block animate-spin">⏳</span>
                                                            <span>Loading...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>✨</span>
                                                            <span>{openBriefId[connection.userId._id] ? "Hide Brief" : "Get Brief"}</span>
                                                        </>
                                                    )}
                                                </button>

                                                {/* Accept Button */}
                                                <button 
                                                    className='px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        dispatch(acceptConnection({
                                                            token: localStorage.getItem("token"),
                                                            requestId: connection.userId._id,
                                                            action: "accept"
                                                        }));
                                                    }}
                                                >
                                                    Accept
                                                </button>

                                                {/* Decline Button */}
                                                <button 
                                                    className='px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-semibold text-xs rounded-xl transition cursor-pointer'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        dispatch(acceptConnection({
                                                            token: localStorage.getItem("token"),
                                                            requestId: connection.userId._id,
                                                            action: "reject"
                                                        }));
                                                    }}
                                                    title="Decline request"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>

                                        {/* AI Brief Expandable Panel */}
                                        {openBriefId[connection.userId._id] && briefData[connection.userId._id] && (
                                            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-slate-700 mt-2 transition-all">
                                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-200/70">
                                                    <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                                                        ✨ AI Executive Brief — {connection.userId.name}
                                                    </span>
                                                    <div className='flex items-center gap-2'>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(briefData[connection.userId._id]);
                                                                setBriefCopiedId(connection.userId._id);
                                                                setTimeout(() => setBriefCopiedId(null), 2000);
                                                            }}
                                                            className='text-2xs text-blue-700 hover:text-blue-800 font-semibold px-2 py-0.5 rounded bg-blue-100/60 transition cursor-pointer'
                                                        >
                                                            {briefCopiedId === connection.userId._id ? '✓ Copied' : 'Copy'}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenBriefId(prev => ({ ...prev, [connection.userId._id]: false }));
                                                            }}
                                                            className="text-slate-400 hover:text-slate-600 font-bold px-1 cursor-pointer"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="whitespace-pre-line leading-relaxed text-slate-800 font-sans">
                                                    {briefData[connection.userId._id]}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className='flex flex-col items-center justify-center py-16 bg-slate-50/60 rounded-2xl border border-slate-200/80 gap-3 text-center'>
                                    <img src="/images/no_request.png" alt="No Requests" className='h-32 opacity-70 object-contain' />
                                    <h3 className='font-bold text-slate-800 text-base'>No Pending Connection Requests</h3>
                                    <p className='text-xs text-slate-400 max-w-sm'>
                                        You are all caught up! Explore Discover to connect with new professionals.
                                    </p>
                                    <button 
                                        className='mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer'
                                        onClick={() => router.push("/discover")}
                                    >
                                        Explore Discover
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Accepted Connections Tab */}
                    {activeTab === "accepted" && (
                        <div className='flex flex-col gap-4'>
                            {acceptedConnections.length > 0 ? (
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    {acceptedConnections.map((connection) => (
                                        <div 
                                            key={connection._id}
                                            className='bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl p-4 shadow-xs hover:shadow-sm transition flex items-center justify-between gap-3 cursor-pointer'
                                            onClick={() => router.push(`/viewProfilePage/${connection.userId.username}`)}
                                        >
                                            <div className='flex items-center gap-3 overflow-hidden'>
                                                <img 
                                                    src={`${BASE_URL}/${connection.userId.profilePicture}`} 
                                                    alt={connection.userId.name} 
                                                    className='h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0' 
                                                />
                                                <div className='overflow-hidden'>
                                                    <h3 className='font-bold text-slate-900 text-sm truncate'>
                                                        {connection.userId.name}
                                                    </h3>
                                                    <p className='text-xs text-slate-400 truncate'>
                                                        @{connection.userId.username}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-2'>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/viewProfilePage/${connection.userId.username}`);
                                                    }}
                                                    className='px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer'
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='flex flex-col items-center justify-center py-16 bg-slate-50/60 rounded-2xl border border-slate-200/80 gap-3 text-center'>
                                    <h3 className='font-bold text-slate-800 text-base'>No Connections Yet</h3>
                                    <p className='text-xs text-slate-400 max-w-sm'>
                                        You haven't connected with any members yet. Start expanding your network!
                                    </p>
                                    <button 
                                        className='mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer'
                                        onClick={() => router.push("/discover")}
                                    >
                                        Find Connections
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}
