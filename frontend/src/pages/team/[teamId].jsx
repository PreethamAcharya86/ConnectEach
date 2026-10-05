import clientServer, { BASE_URL } from '@/config';
import DashBoardLayout from '@/layout/DashBoardLayout';
import UserLayout from '@/layout/userLayout';
import React, { useEffect, useRef, useState } from 'react';
import styles from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addMembers, deleteChat, deleteTeam, getChat, getMyTeam, getTeam, postChat, removeMember } from '@/config/redux/action/teamAction';
import { getAboutUser, getMyConnections } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';

export default function index({ teamData }) {
    const [showTeamInfo, setShowTeamInfo] = useState(false);
    const [message, setMessage] = useState("");
    const [moreOption, setMoreOption] = useState({
        open : false,
        body : "",
        chatId : ""
    });
    const [selected, setSelected] = useState([]);
    const [showAddMember, setShowAddMember] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();
    const overlayRef = useRef(null);
    const bottomRef = useRef(null);

    const authState = useSelector((state) => state.auth);
    const teamState = useSelector((state) => state.team);

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
        if (teamData?._id) {
            dispatch(getChat({ teamId : teamData._id }))
            dispatch(getTeam({ teamId : teamData._id }))
        }
    },[teamData?._id])

    return (
        <UserLayout>
            <DashBoardLayout>
                <div className='flex flex-col h-[85vh] md:h-[84vh] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative'>
                    
                    {/* Header Bar */}
                    <div className='flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white/80 backdrop-blur-md shrink-0 z-10'>
                        <div className='flex items-center gap-3'>
                            <img 
                                src={`${BASE_URL}/${teamData?.teamPitcure}`} 
                                alt="team icon" 
                                className='h-11 w-11 rounded-full object-cover ring-2 ring-slate-100 border border-slate-200 shadow-xs' 
                            />
                            <div>
                                <h2 className='font-bold text-slate-900 text-lg leading-tight'>{teamData?.teamName}</h2>
                                <p className='text-xs font-medium text-slate-500'>
                                    {teamState?.teamMembers?.members?.length || 0} {teamState?.teamMembers?.members?.length === 1 ? 'member' : 'members'}
                                </p>
                            </div>
                        </div>
                        
                        <button 
                            className='p-2.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-slate-200/60 shadow-2xs active:scale-95'
                            onClick={() => setShowTeamInfo(!showTeamInfo)}
                            title="Team Details"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                            </svg>
                        </button>
                    </div>

                    {/* Chat Messages List */}
                    <div className={`${styles.modern_scrollbar} flex-1 overflow-y-auto px-4 py-4 bg-slate-50/70 space-y-3`}>
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
                                
                                const currentUserId = authState?.user?.userId?._id || authState?.user?.userId || authState?.user?._id;
                                const chatSenderId = typeof chat.chatBy === 'object' ? (chat.chatBy?._id || chat.chatBy?.id) : chat.chatBy;
                                const isSelf = Boolean(currentUserId && chatSenderId && String(currentUserId) === String(chatSenderId));

                                return (
                                    <div className='flex flex-col w-full py-0.5' key={chat._id}>
                                        {
                                            showDate && (
                                                <div className='flex items-center justify-center my-4'>
                                                    <span className='px-3 py-1 bg-white border border-slate-200/80 rounded-full text-[11px] font-semibold text-slate-500 shadow-2xs select-none'>
                                                        {currentDate}
                                                    </span>
                                                </div>
                                            )
                                        }
                                        {
                                            isSelf ? (
                                                <div className='w-full flex items-center justify-end py-1'>
                                                    <div className='flex items-center gap-2 group max-w-[85%] md:max-w-[70%]'>
                                                        <button 
                                                            className='opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg cursor-pointer shrink-0' 
                                                            title="Options"
                                                            onClick={() => {
                                                                setMoreOption({
                                                                    open : true,
                                                                    body : chat.body,
                                                                    chatId : chat._id
                                                                });
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="size-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                            </svg>
                                                        </button>
                                                        <div className='flex flex-col bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-xs text-sm break-words whitespace-pre-wrap max-w-full gap-2'>
                                                            <p className='leading-relaxed text-left text-sm font-normal'>{chat?.body}</p>
                                                            <span className='text-[10px] text-blue-100/90 font-medium self-end select-none shrink-0 leading-none pt-0.5'>
                                                                {new Date(chat.createdAt).toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='w-full flex justify-start py-1'>
                                                    <div className='flex items-start gap-2.5 max-w-[85%] md:max-w-[70%]'>
                                                        {
                                                            chat.chatBy?.profilePicture ? (
                                                                <img 
                                                                    src={`${BASE_URL}/${chat.chatBy.profilePicture}`} 
                                                                    alt={chat.chatBy?.username || "Profile"} 
                                                                    className='h-8 w-8 rounded-full object-cover mt-1 shrink-0 ring-1 ring-slate-200 bg-slate-200'
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.nextSibling.style.display = 'flex';
                                                                    }}
                                                                />
                                                            ) : null
                                                        }
                                                        <div className='h-8 w-8 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center mt-1 shrink-0 ring-1 ring-slate-300' style={{ display: chat.chatBy?.profilePicture ? 'none' : 'flex' }}>
                                                            {(typeof chat.chatBy === 'object' ? (chat.chatBy?.username || chat.chatBy?.name || 'U') : 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className='flex flex-col items-start min-w-0'>
                                                            <span className='text-[11px] font-semibold text-slate-500 mb-1 ml-1 truncate max-w-full'>
                                                                {typeof chat.chatBy === 'object' ? (chat.chatBy?.username || chat.chatBy?.name) : 'User'}
                                                            </span>
                                                            <div className='flex flex-col bg-white border border-slate-200/90 text-slate-800 px-4 py-3 rounded-2xl rounded-tl-xs shadow-2xs text-sm break-words whitespace-pre-wrap max-w-full gap-2'>
                                                                <p className='leading-relaxed text-left text-sm font-normal'>{chat?.body}</p>
                                                                <span className='text-[10px] text-slate-400 font-medium self-end select-none shrink-0 leading-none pt-0.5'>
                                                                    {new Date(chat.createdAt).toLocaleTimeString([], {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit"
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                );
                            }) : (
                                <div className='flex flex-col w-full h-full justify-center items-center gap-3 py-12'>
                                    <div className='w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.75.75 0 0 1-1.016-.944l.872-2.18A8.826 8.826 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                        </svg>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-base font-semibold text-slate-700'>No Messages Yet</p>
                                        <p className='text-xs text-slate-400 mt-1'>Start the conversation with your team members below!</p>
                                    </div>
                                </div>
                            )
                        }
                        <div ref={bottomRef}></div>
                    </div>

                    {/* Input Bar */}
                    <div className='p-3 bg-white border-t border-slate-100 shrink-0'>
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                if(message.trim()) {
                                    dispatch(postChat({
                                        token : localStorage.getItem("token"),
                                        teamId : teamData._id,
                                        body: message
                                    }));
                                    setMessage("");
                                }
                            }}
                            className='flex items-center gap-2'
                        >
                            <input
                                type="text"
                                className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 text-sm placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="Write a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button 
                                type="submit"
                                disabled={!message.trim()}
                                className='p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl shadow-xs shadow-blue-500/20 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center shrink-0'
                                title="Send Message"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Team Info Side Drawer */}
                    {
                        showTeamInfo && (
                            <div 
                                className='fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity'
                                ref={overlayRef} 
                                onClick={(e) => {
                                    if (overlayRef.current === e.target) {
                                        setShowTeamInfo(false);
                                    }
                                }}
                            >
                                <div className='w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-5 pt-5 border-l border-slate-200 z-[120] animate-in slide-in-from-right duration-200 justify-between'>
                                    <div className='flex flex-col gap-4 overflow-hidden'>
                                        {/* Header */}
                                        <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
                                            <div className='flex items-center gap-2'>
                                                <h3 className='font-bold text-slate-800 text-base'>Team Details</h3>
                                            </div>
                                            <button 
                                                className='p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer'
                                                onClick={() => setShowTeamInfo(false)}
                                                title="Close"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Team Admin */}
                                        <div>
                                            <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Team Admin</p>
                                            <div 
                                                className='flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/40 rounded-xl shadow-2xs transition-all cursor-pointer group'
                                                onClick={() => { 
                                                    router.push(`/viewProfilePage/${teamData?.createdBy.username}`) 
                                                }}
                                            >
                                                <img 
                                                    src={`${BASE_URL}/${teamData?.createdBy.profilePicture}`} 
                                                    alt="User profile" 
                                                    className='h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-blue-400 transition'
                                                />
                                                <div>
                                                    <p className='font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition'>{teamData?.createdBy.username}</p>
                                                    <p className='text-[11px] text-slate-400 font-medium'>Creator & Admin</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Members List */}
                                        <div className='flex flex-col flex-1 overflow-hidden min-h-0'>
                                            <div className='flex items-center justify-between mb-2'>
                                                <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Members</p>
                                                <span className='px-2 py-0.5 bg-slate-100 rounded-full text-[11px] font-bold text-slate-600'>
                                                    {teamState?.teamMembers?.members?.length || 0}
                                                </span>
                                            </div>

                                            {
                                                teamState?.teamMembers?.members?.length == 0 ? (
                                                    <div className='flex flex-col items-center justify-center py-8 text-center bg-slate-50 border border-slate-200/60 rounded-xl'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-slate-300 mb-1">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                                        </svg>
                                                        <p className='text-xs font-semibold text-slate-400'>No Members Added</p>
                                                    </div>
                                                ) : (
                                                    <div className={`${styles.modern_scrollbar} space-y-2 overflow-y-auto pr-1 py-1 max-h-[35vh]`}>
                                                        {
                                                            teamState?.teamMembers?.members?.map((user) => {
                                                                return (
                                                                    <div key={user._id} className='flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 rounded-xl transition group'>
                                                                        <div 
                                                                            className='flex items-center gap-2.5 cursor-pointer flex-1 min-w-0'
                                                                            onClick={() => { 
                                                                                router.push(`/viewProfilePage/${user.username}`) 
                                                                            }}
                                                                        >
                                                                            <img 
                                                                                src={`${BASE_URL}/${user?.profilePicture}`} 
                                                                                alt={user.name} 
                                                                                className='h-8 w-8 rounded-full object-cover shrink-0 border border-slate-200'
                                                                            />
                                                                            <p className='text-sm font-medium text-slate-700 truncate group-hover:text-blue-600 transition'>{user.name}</p>
                                                                        </div>
                                                                        {
                                                                            authState?.user?.userId?._id === teamData.createdBy._id && (
                                                                                <button 
                                                                                    className='p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer shrink-0'
                                                                                    title="Remove member"
                                                                                    onClick={() => {
                                                                                        dispatch(removeMember({ 
                                                                                            token : localStorage.getItem("token"),
                                                                                            teamId : teamData._id,
                                                                                            memberId : user._id
                                                                                        }))
                                                                                    }}
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="size-4">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                                    </svg>
                                                                                </button>
                                                                            )
                                                                        }
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>

                                    {/* Action Buttons at Bottom */}
                                    <div className='flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto'>
                                        { 
                                            authState?.user?.userId?._id === teamData.createdBy._id && (
                                                <button 
                                                    className='flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 font-semibold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95'
                                                    onClick={() => {
                                                        setShowTeamInfo(false);
                                                        setShowAddMember(true);
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                    Add Member
                                                </button>
                                            )
                                        }
                                        { 
                                            authState?.user?.userId?._id === teamData.createdBy._id ? (
                                                <button 
                                                    className='bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 font-semibold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95'
                                                    onClick={() => {
                                                        dispatch(deleteTeam({
                                                            token : localStorage.getItem("token"),
                                                            teamId : teamData._id
                                                        }))
                                                        router.push("/teams")
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                    Delete Team
                                                </button>
                                            ) : (
                                                <button 
                                                    className='w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 font-semibold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95'
                                                    onClick={() => {
                                                        dispatch(removeMember({
                                                            token : localStorage.getItem("token"),
                                                            teamId : teamData._id,
                                                            memberId : authState.user.userId._id
                                                        }))
                                                        setShowTeamInfo(false);
                                                        router.push("/teams")
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                                    </svg>
                                                    Leave Team
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div>

                {/* More Options / Delete Chat Modal */}
                { 
                    moreOption.open && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                                onClick={() => setMoreOption({ open: false, body: "", chatId: "" })}
                            ></div>
                            <div className='relative z-50 w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150'>
                                <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
                                    <h4 className='font-bold text-slate-800 text-sm'>Message Actions</h4>
                                    <button 
                                        className='p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer'
                                        onClick={() => setMoreOption({ open: false, body: "", chatId: "" })}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-slate-700 text-sm italic">
                                    "{moreOption.body}"
                                </div>

                                <div className='flex justify-end gap-2 pt-1'>
                                    <button 
                                        className='px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition cursor-pointer'
                                        onClick={() => setMoreOption({ open: false, body: "", chatId: "" })}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className='flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95'
                                        onClick={() => {
                                            dispatch(deleteChat({
                                                token : localStorage.getItem("token"),
                                                teamId : teamData._id,
                                                chatId : moreOption.chatId
                                            }));
                                            setMoreOption({ open: false, body: "", chatId: "" });
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        Delete Message
                                    </button>
                                </div>
                            </div>
                        </div> 
                    )
                }

                {/* Add Member Modal */}
                {
                    showAddMember && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                                onClick={() => setShowAddMember(false)}
                            ></div>
                            <div className='relative z-50 w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150'>
                                <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
                                    <div>
                                        <h4 className='font-bold text-slate-800 text-base'>Add Members</h4>
                                        <p className='text-xs text-slate-400'>Select connections to add to this team</p>
                                    </div>
                                    <button 
                                        className='p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer'
                                        onClick={() => setShowAddMember(false)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className={`${styles.modern_scrollbar} space-y-2 overflow-y-auto max-h-[50vh] pr-1`}>
                                    {
                                        authState?.myConnections?.filter((user) =>
                                            !teamState.teamMembers?.members?.some((member) => 
                                                member._id === user.userId._id
                                        )).length === 0 ? (
                                            <div className='flex flex-col items-center justify-center py-8 text-center bg-slate-50 border border-slate-200/60 rounded-xl'>
                                                <p className='text-sm font-semibold text-slate-500'>No Available Connections</p>
                                                <p className='text-xs text-slate-400 mt-1'>All your connections are already in this team.</p>
                                            </div>
                                        ) : (
                                            authState?.myConnections?.filter((user) =>
                                                !teamState.teamMembers?.members?.some((member) => 
                                                    member._id === user.userId._id
                                                )).map((user) => {
                                                return (
                                                    <label
                                                        key={user.userId._id}
                                                        className={`flex items-center gap-3 p-2.5 border rounded-xl cursor-pointer transition-all ${
                                                            selected.includes(user.userId._id) 
                                                                ? 'bg-blue-50/70 border-blue-300' 
                                                                : 'bg-slate-50 border-slate-200/70 hover:bg-slate-100/70'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
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
                                                        <img 
                                                            src={`${BASE_URL}/${user?.userId?.profilePicture}`} 
                                                            alt="User profile" 
                                                            className='h-8 w-8 rounded-full object-cover border border-slate-200'
                                                        />
                                                        <span className='text-sm font-medium text-slate-800'>{user?.userId?.name}</span>
                                                    </label>
                                                );
                                            })
                                        )
                                    }
                                </div>

                                <div className='flex justify-end gap-2 pt-2 border-t border-slate-100'>
                                    <button 
                                        className='px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition cursor-pointer'
                                        onClick={() => setShowAddMember(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        disabled={selected.length === 0}
                                        className='px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:cursor-not-allowed active:scale-95'
                                        onClick={() => {
                                            dispatch(addMembers({
                                                token : localStorage.getItem("token"),
                                                teamId : teamData._id,
                                                members : selected
                                            }));
                                            setShowAddMember(false);
                                        }}
                                    >
                                        Add {selected.length > 0 ? `(${selected.length})` : ''} Selected
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </DashBoardLayout>
        </UserLayout>
    )
}

export async function getServerSideProps(context) {
    try {
        const request = await clientServer.get("/get-team", {
            params :{
                teamId: context.query.teamId
            }
        })
        return { props: { teamData: request.data?.teamData || null }};
    } catch (error) {
        return { props: { teamData: null }};
    }
}
   