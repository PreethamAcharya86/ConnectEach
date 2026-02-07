import clientServer, { BASE_URL } from '@/config';
import DashBoardLayout from '@/layout/DashBoardLayout';
import UserLayout from '@/layout/userLayout';
import React, { useEffect, useRef, useState } from 'react'
import styles from './style.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { addMembers, deleteChat, deleteTeam, getChat, getMyTeam, getTeam, postChat, removeMember } from '@/config/redux/action/teamAction';
import { getAboutUser, getMyConnections } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';

export default function index({ teamData }) {
    const [showTeamInfo, setShowTeamInfo] = useState(false);
    const [message, setMessage] = useState("")
    const [moreOption, setMoreOption] = useState({
        open : false,
        body : "",
        chatId : ""
    });
    const [selected, setSelected] = useState([]);
    const [showAddMember, setShowAddMember] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter()
    const overlayRef = useRef(null);
    const bottomRef = useRef(null);

    const authState = useSelector((state) => state.auth)
    const teamState = useSelector((state) => state.team)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [teamState?.team_chat]);

    useEffect(() => {
        if(authState.isTokenThere) {
            dispatch(getAboutUser({ token : localStorage.getItem("token") }))
        }
    }, [authState.isTokenThere])
    useEffect(() => {
        dispatch(getAboutUser({ token : localStorage.getItem("token")}))
        dispatch(getMyConnections({ token : localStorage.getItem("token")}))
        dispatch(getChat({ teamId : teamData._id }))
        dispatch(getTeam({ teamId : teamData?._id }))
    },[])
    
    return (
        <UserLayout>
            <DashBoardLayout>
                <div className='flex flex-col items-between md:h-[83vh] h-[100vh] gap-1 bg-gray-300 p-1'>
                    <div className='flex flex-col'>
                        <div className='flex gap-2 items-center'>
                            <img src={`${BASE_URL}/${teamData?.teamPitcure}`} alt="team icon" className='h-10 w-10 rounded-full' />
                            <p className='text-center font-semibold text-lg'>{teamData?.teamName}</p>
                            <div className='flex gap-0.5 p-2 rounded-lg ring-2 ring-blue-400 shadow-lg rounded hover:scale-104 transition delay-100 hover:shadow-[0_4px_12px_rgba(59,130,246,0.5)] !ml-auto cursor-pointer'>
                                <button className='text-sm cursor-pointer' onClick={() => setShowTeamInfo(!showTeamInfo)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {
                        showTeamInfo && 
                        <div className='flex z-110 shadow-xl gap-3 h-full md:h- flex-col absolute top-0  bg-white border rounded-md p-2 right-5 w-80 justify-between' ref={overlayRef} onClick={(e) => {
                                if (overlayRef.current === e.target) {
                                    setShowTeamInfo(false);
                                }
                            }}>
                            <div className='flex justify-between'>
                                <div>
                                    <p className='font-semibold'>Team Admin</p>
                                </div>
                                <div className='p-0.5 rounded hover:scale-108 cursor-pointer' onClick={() => {
                                    setShowTeamInfo(false);                                
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                            </div>
                            <div className='flex justify-center items-center bg-gray-400 p-2 rounded-md'>
                                <div className='p-2 bg-white w-full cursor-pointer border border-transparent hover:border-black md:hover:scale-105 transition-all delay-50 rounded-xl w-1/2 shadow-lg flex gap-2 cursor-pointer'  
                                onClick={() => { 
                                    router.push(`/viewProfilePage/${teamData?.createdBy.username}`) 
                                }}>
                                    <img src={`${BASE_URL}/${teamData?.createdBy.profilePicture}`} alt="User profile" className='h-8 w-8 rounded-full'/>
                                    <p>{teamData?.createdBy.username}</p>
                                </div>
                            </div>
                            <p className='font-semibold !mt-2'>Members</p>
                            {
                                teamState?.teamMembers?.members?.length == 0 ?
                                    <div className='h-full flex justify-center items-center'>
                                        <p className='text-xl font-semibold text-gray-400'>No Members</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="size-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                    </div> :                            
                                    <div className={` ${styles.modern_scrollbar} grid content-start gap-2 bg-gray-400 rounded-md p-2 overflow-y-auto h-full`}>
                                    {
                                        teamState?.teamMembers?.members?.map((user) => {
                                            return (
                                                <div className='flex w-full shadow-lg gap-1'>
                                                    <div className='p-2 bg-white w-full cursor-pointer border border-transparent hover:border-black md:hover:scale-105 transition-all delay-50  rounded-xl h-10  flex gap-2 cursor-pointer' key={user._id}  onClick={() => { 
                                                        router.push(`/viewProfilePage/${user.username}`) 
                                                    }}>
                                                        <img src={`${BASE_URL}/${user?.profilePicture}`} alt="User profile" className='h-7 w-7 rounded-full'/>
                                                        <p>{user.name}</p>
                                                    </div>
                                                    {
                                                        authState?.user?.userId?._id === teamData.createdBy._id &&
                                                        <div className='flex p-1 rounded-lg hover:text-red-500 justfy-center items-center' onClick={() => {
                                                            dispatch(removeMember({ 
                                                                token : localStorage.getItem("token"),
                                                                teamId : teamData._id,
                                                                memberId : user._id
                                                            }))
                                                        }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                            <div className='flex justify-between p-0.5 items-center'>
                                { 
                                    authState?.user?.userId?._id === teamData.createdBy._id &&
                                    <div className='flex ring-2 ring-blue-400 bg-blue-100 hover:bg-blue-400 rounded-lg p-1 !mr-auto !m-1 transition delay-50 text-bold'
                                        onClick={() => {
                                            setShowTeamInfo(false);
                                            setShowAddMember(true);
                                        }}
                                    >
                                        <p>Add</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg> 
                                    </div>
                                }
                                { 
                                    authState?.user?.userId?._id === teamData.createdBy._id ?
                                    <div className='flex p-1 border-2 border-red-500 hover:bg-red-100 rounded-md transition delay-50'
                                        onClick={() => {
                                            dispatch(deleteTeam({
                                                token : localStorage.getItem("token"),
                                                teamId : teamData._id
                                            }))
                                            router.push("/teams")
                                        }}
                                    >
                                        <p>Delete Team</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </div> :
                                    <div className='flex p-1 border-2 border-red-500 hover:bg-red-100 rounded-md gap-1' onClick={() => {
                                        dispatch(removeMember({
                                            token : localStorage.getItem("token"),
                                            teamId : teamData._id,
                                            memberId : authState.user.userId._id
                                        }))
                                        setShowTeamInfo(false);
                                        router.push("/teams")
                                    }}>
                                        <p>Logout</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                        </svg>
                                    </div> 
                                }
                            </div>
                        </div>
                    }
                    <div className={`${styles.modern_scrollbar} chat flex flex-col gap-3 h-full overflow-y-auto space-y-2 rounded-md bg-white`}>
                        {
                            teamState?.team_chat?.length !== 0 ? teamState?.team_chat?.map((chat, index) => {
                                const prevChat = teamState.team_chat[index - 1];
                                const currentDate = new Date(chat.createdAt).toLocaleDateString([], {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                    weekday: "long"
                                });

                                const prevDate = prevChat
                                ? new Date(prevChat.createdAt).toLocaleDateString([], {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                    weekday: "long"
                                })
                                : null;

                                const showDate = currentDate !== prevDate;
                                return(
                                    <div className='flex flex-col px-1 py-2 w-full' key={chat._id}>
                                        {
                                            showDate && 
                                            <p className='text-center !m-2 font-semibold'>
                                                {currentDate}
                                            </p>
                                        }
                                        {
                                            chat.chatBy?._id === authState?.user?.userId?._id ?
                                            <div className='flex !ml-auto gap-1 max-w-[70%] min-w-[80px]'>
                                                <div className='flex flex-col px-4 py-1 rounded-lg text-center ring-2 ring-blue-400 shadow-lg bg-white'>
                                                    <p>{chat?.body}</p>
                                                    <p className='text-sm font-light !mt-auto !ml-auto'>
                                                        {new Date(chat.createdAt).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </p>
                                                </div>
                                                <div className='flex !mb-auto rounded-lg hover:bg-blue-100 text-blue-600 transition cursor-pointer p-0.5' 
                                                    onClick={() => {
                                                        setMoreOption({
                                                            open : true,
                                                            body : chat.body,
                                                            chatId : chat._id
                                                        });
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            :
                                            <div className='flex flex-col !mr-auto gap-1 max-w-[70%] min-w-[80px]'>
                                                <div className='flex gap-2'>
                                                    <img src={`${BASE_URL}/${chat.chatBy.profilePicture}`} alt="Profile" className='h-6 w-6 rounded-full'/>
                                                    <p className=' text-gray-400'>{chat.chatBy.username}</p>
                                                </div>
                                                
                                                <div className='flex flex-col px-4 py-1 rounded-lg text-center ring-2 ring-blue-400 shadow-lg bg-white '>
                                                    <p>{chat?.body}</p>
                                                    <p className='text-sm font-light !mt-auto !mr-auto'>
                                                        {new Date(chat.createdAt).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )
                            }) : 
                            <div className='flex w-full h-full justify-center items-center'>
                                <p className='text-2xl font-semibold text-gray-400'>No Messages Yet!</p>
                            </div>
                        }
                        <div ref={bottomRef}></div>
                    </div>
                    <div className='input flex justify-center items-end h-auto bg-gray-300'>
                        <div className='flex gap-1 w-full !mb-1'>
                            <input
                                type="text"
                                className="w-full stretch px-4 py-2 rounded-xl !mt-auto bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                                placeholder="Message"
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value)
                                }}
                                onKeyDown={(e) => {
                                    if(e.key === "Enter") {
                                        dispatch(postChat({
                                            token : localStorage.getItem("token"),
                                            teamId : teamData._id,
                                            body: message
                                        }));
                                        setMessage("")
                                    }
                                }}
                            />
                            <button className='p-1 cursor-pointer hover:scale-104 transistion delay-50 hover:text-blue-500 rounded-xl' onClick={() => {
                                dispatch(postChat({
                                    token : localStorage.getItem("token"),
                                    teamId : teamData._id,
                                    body: message
                                }));
                                setMessage("")
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                { moreOption.open && 
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setMoreOption(false)}
                        > 
                        </div>
                        <div className='flex flex-col gap-2 relative z-50 w-full max-w-lg rounded-2xl bg-white p-4 shadow-2xl'>
                            <div className='flex justify-between items-center'>
                                <p className='font-semibold opacity-80 text-gray-400'>Message</p>
                                <div className='flex border-2 justify-center items-center border-red-200 hover:bg-red-100 rounded-md' onClick={() => {
                                    dispatch(deleteChat({
                                        token : localStorage.getItem("token"),
                                        teamId : teamData._id,
                                        chatId : moreOption.chatId
                                    }))
                                    setMoreOption({
                                        open : false
                                    })
                                }}>
                                    <div className='flex justify-center items-center p-1 shrink-0'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center ">
                                {moreOption.body}
                            </div>
                        </div>
                    </div> 
             }
                {
                    showAddMember && 
                    <div className="fixed inset-0 z-50 flex h-full items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setShowAddMember(false)}
                        > 
                        </div>
                        <div className='flex flex-col gap-2 relative z-50 w-full max-w-lg rounded-2xl bg-white p-4 shadow-2xl'>
                            <div className='flex flex-col gap-2 justify-between h-full'>
                                <div className='flex justify-between'>
                                    <p className='text-lg font-semibold'>Your connections</p>
                                    <div className='p-0.5 rounded-full hover:bg-red-200 hover:scale-108 cursor-pointer' onClick={() => {
                                        setShowAddMember(false);                                
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                <div className={`${styles.modern_scrollbar} w-full h-full p-2 flex flex-col gap-2 overflow-y-auto max-h-[50vh]`}>
                                    {
                                        authState?.myConnections?.filter((user) =>
                                            !teamState.teamMembers?.members?.some((member) => 
                                                member._id === user.userId._id
                                        )).length === 0 ?
                                        <div className='flex justify-center items-center'>
                                            <p className='text-gray-400 font-semibold text-xl'>Empty Connection</p>
                                        </div> :
                                        authState?.myConnections?.filter((user) =>
                                            !teamState.teamMembers?.members?.some((member) => 
                                                member._id === user.userId._id
                                            )).map((user) => {
                                            return(
                                                <label
                                                    key={user.userId._id}
                                                    className="flex items-center gap-2 p-1 ring-2 ring-blue-400 rounded-lg cursor-pointer hover:bg-blue-100 transition-all delay-50"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selected.includes(user.userId._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelected([...selected, user.userId._id]);
                                                            } else {
                                                                setSelected(
                                                                    selected.filter((id) => id !== user.userId._id)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <div className='p-2 w-full cursor-pointer flex gap-2 cursor-pointer' key={user.userId._id}>
                                                        <img src={`${BASE_URL}/${user?.userId?.profilePicture}`} alt="User profile" className='h-8 w-8 rounded-full'/>
                                                        <p>{user?.userId?.name}</p>
                                                    </div>
                                                </label>
                                            )
                                        })
                                    }
                                </div>
                                <div className='flex' onClick={() => {
                                    dispatch(addMembers({
                                        token : localStorage.getItem("token"),
                                        teamId : teamData._id,
                                        members : selected
                                    }))
                                    setShowAddMember(false);
                                }}>
                                    <button className='p-2 ring-2 ring-blue-500 bg-blue-200 rounded-lg hover:bg-blue-500 transition-all dely-50'>Add</button>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                }
            </DashBoardLayout>
        </UserLayout>
            
    )
}

export async function getServerSideProps(context) {
    const request = await clientServer.get("/get-team", {
        params :{
            teamId: context.query.teamId
        }
    })
    const response = await request.data
    return { props: { teamData: request.data.teamData }};
}
   