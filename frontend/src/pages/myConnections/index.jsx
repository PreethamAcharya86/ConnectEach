import { acceptConnection, getAboutUser, getAllUsers, getMyConnections } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from'./style.module.css'
import clientServer, { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function MyConnections() {
    const dispatch = useDispatch();
    const router = useRouter();
    const authState = useSelector((state) => state.auth);

    const [briefData, setBriefData] = useState({});
    const [loadingBriefId, setLoadingBriefId] = useState(null);
    const [openBriefId, setOpenBriefId] = useState({});

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
        dispatch(getAboutUser({ token : localStorage.getItem("token") }))
        dispatch(getMyConnections({ token: localStorage.getItem("token")}))
    },[])
    useEffect(() => {
        if(authState.myConnections.length !== 0) {
            dispatch(getMyConnections({ token: localStorage.getItem("token")}))
        }
    }, [authState.myConnections.length])

    useEffect(() => {
        if(!authState.all_profile_fetched) {
            dispatch(getAllUsers());
        }
    }, [])
    return (
    <UserLayout>
        <DashBoardLayout>
            <div>
                <h2 className='text-xl font-semibold'>Connection requests</h2>
                <div className='flex flex-col gap-4 px-2 !mt-2'>
                        {
                            authState.myConnections.length !== 0 && authState?.myConnections?.filter((connection) => connection.status_accepted == null).map((connection) => {
                                return (
                                    <div key={connection._id} className='flex flex-col'>
                                        <div className={`${styles.container} flex w-full p-2 hover:shadow-xl transition delay-200 shadow-lg cursor-pointer gap-2 rounded-md`} onClick={() => {
                                            router.push(`/viewProfilePage/${connection.userId.username}`)
                                        }}>
                                            <img src={`${BASE_URL}/${connection.userId.profilePicture}`} alt="user image" className='h-15 w-15 rounded-full' />
                                            <div className='flex flex-col'>
                                                <h1 className='font-bold'> @{connection.userId.username} </h1>
                                                <p>{connection.userId.name}</p>
                                            </div>
                                            <div className='flex !ml-auto gap-2 py-3 items-center'>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleGetBrief(connection.userId._id);
                                                    }}
                                                    className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow transition cursor-pointer"
                                                    title="Get an AI brief about this person"
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
                                                {
                                                    connection.status_accepted === null &&
                                                    <>
                                                        <button className={`${styles.accept_btn}  py-1 px-2 rounded-xl text-sm hover:scale-[1.02] transition delay-200`} onClick={(e) => {
                                                            e.stopPropagation();
                                                            dispatch(acceptConnection({
                                                                token: localStorage.getItem("token"),
                                                                requestId : connection.userId._id,
                                                                action : "accept"
                                                            }))
                                                        }}>Accept</button>
                                                        <button className={`${styles.reject_btn} py-1 px-2 rounded-xl hover:scale-[1.02] transition delay-200`} onClick={(e) => {
                                                            e.stopPropagation();
                                                            dispatch(acceptConnection({
                                                                token: localStorage.getItem("token"),
                                                                requestId : connection.userId._id,
                                                                action : "reject"
                                                            }));
                                                        }}>
                                                            <i className="fa-solid text-sm fa-xmark"></i>
                                                        </button>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        {openBriefId[connection.userId._id] && briefData[connection.userId._id] && (
                                            <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-b-xl text-sm transition-all">
                                                <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-blue-200/70">
                                                    <span className="font-semibold text-xs text-blue-800 tracking-wide flex items-center gap-1">
                                                        ✨ AI Brief — @{connection.userId.username}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenBriefId(prev => ({ ...prev, [connection.userId._id]: false }));
                                                        }}
                                                        className="text-gray-400 hover:text-gray-600 text-xs font-bold px-1 cursor-pointer"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                                <p className="whitespace-pre-line text-xs leading-relaxed text-gray-700">
                                                    {briefData[connection.userId._id]}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        }
                        {
                            authState.myConnections?.filter((connection) => connection.status_accepted == null).length === 0 &&
                            <div className='flex justify-center items-center flex-shrink-0'>
                                <img src="/images/no_request.png" alt="No Request" className='h-80 object-cover pt-20 '/>
                            </div>
                        }
                    </div>
            </div>
           
        </DashBoardLayout>
    </UserLayout>
  )
}

