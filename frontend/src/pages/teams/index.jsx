import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/userLayout'
import CreateTeam from '@/component/CreateTeam'
import { Context } from '@/component/Context'
import React, { useEffect, useRef, useState } from 'react'
import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction'
import { useDispatch, useSelector } from 'react-redux'
import {  teamEmptyMessage } from '@/config/redux/reducer/teamReducer'
import { getChat, getMyTeam } from '@/config/redux/action/teamAction'
import clientServer, { BASE_URL } from '@/config'
import { useRouter } from 'next/router'

export default function index() {
    const [openCreateTeam, setOpenCreateTeam] = useState(false);
    const [openSummaryModal, setOpenSummaryModal] = useState(false);
    const [selectedTeamForSummary, setSelectedTeamForSummary] = useState(null);
    const [summaryText, setSummaryText] = useState("");
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState("");
    const [isFallback, setIsFallback] = useState(false);
    const [copied, setCopied] = useState(false);
    const summaryModalRef = useRef(null);

    const teamState = useSelector((state) => state.team)
    const overlayRef = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch()

    const handleSummarize = async (e, team) => {
        e.stopPropagation();
        setSelectedTeamForSummary(team);
        setOpenSummaryModal(true);
        setIsSummarizing(true);
        setSummaryText("");
        setSummaryError("");
        setIsFallback(false);
        setCopied(false);

        try {
            // Use redux for getting chat history of the clicked team thread
            const actionResult = await dispatch(getChat({ teamId: team._id }));
            const chats = actionResult.payload;

            if (!Array.isArray(chats) || chats.length === 0) {
                setSummaryText("No chat messages found for this team yet.");
                setIsSummarizing(false);
                return;
            }

            const today = new Date();
            const isSameDay = (d1, d2) =>
                d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate();

            let filteredChats = chats.filter((c) => c.createdAt && isSameDay(new Date(c.createdAt), today));
            let fallbackUsed = false;

            if (filteredChats.length === 0) {
                filteredChats = chats.slice(-25);
                fallbackUsed = true;
            }

            setIsFallback(fallbackUsed);

            const formattedMessages = filteredChats.map((c) => ({
                sender: c.chatBy?.name || c.chatBy?.username || "Member",
                text: c.body,
                time: c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
            }));

            const res = await clientServer.post("/summarize-chat", {
                teamName: team.teamName,
                messages: formattedMessages,
                isFallback: fallbackUsed
            });

            if (res.data?.summary) {
                setSummaryText(res.data.summary);
            } else {
                setSummaryError("Could not generate summary.");
            }
        } catch (err) {
            console.error("Error summarizing chat:", err);
            setSummaryError(err.response?.data?.message || err.message || "Failed to generate summary.");
        } finally {
            setIsSummarizing(false);
        }
    };

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
                                    <div className='flex gap-2 p-2 rounded-lg ring-2 ring-blue-200 shadow-lg rounded hover:scale-104 transition delay-100 hover:shadow-[0_4px_12px_rgba(59,130,246,0.5)] bg-gradient-to-br from-blue-100 via-white to-blue-200 cursor-pointer' key={team._id} onClick={() => {
                                                router.push(`/team/${team._id}`)
                                    }}>
                                        <img src={`${BASE_URL}/${team.teamPitcure}`} alt="team icon" className='h-14 w-14 rounded-full object-cover' />
                                        <div className='flex flex-col px-2 w-full'>
                                            <div className='flex justify-between items-start gap-2'>
                                                <h1 className='font-semibold text-gray-800 truncate'> {team.teamName} </h1>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleSummarize(e, team)}
                                                    className='flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 text-blue-600 font-medium shadow-sm hover:shadow ring-1 ring-blue-300 transition duration-150 cursor-pointer flex-shrink-0'
                                                    title="Summarize today's chat activity with AI"
                                                >
                                                    <span>✨</span>
                                                    <span>Summarize</span>
                                                </button>
                                            </div>
                                            <div className='flex !mt-auto self-end items-center justify-center pt-2'>
                                            {
                                                team.members?.slice(0,3).map((member) => {
                                                    return (
                                                        <div  key={member._id}>
                                                            <img src={`${BASE_URL}/${member.profilePicture}`} className='h-5 w-5 rounded-full object-cover' />
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

                    {/* Today's Activity Summary Modal */}
                    {openSummaryModal && (
                        <div
                            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'
                            ref={summaryModalRef}
                            onClick={(e) => {
                                if (summaryModalRef.current === e.target) {
                                    setOpenSummaryModal(false);
                                }
                            }}
                        >
                            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100'>
                                {/* Header */}
                                <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50'>
                                    <div className='flex items-center gap-3'>
                                        <img
                                            src={`${BASE_URL}/${selectedTeamForSummary?.teamPitcure}`}
                                            alt="team"
                                            className='h-10 w-10 rounded-full object-cover ring-2 ring-blue-200'
                                        />
                                        <div>
                                            <h2 className='font-bold text-gray-800 text-base'>
                                                {selectedTeamForSummary?.teamName}
                                            </h2>
                                            <span className='text-xs text-blue-600 font-medium flex items-center gap-1'>
                                                ✨ Today's Activity Summary
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setOpenSummaryModal(false)}
                                        className='text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-white/80 transition cursor-pointer text-xl leading-none'
                                        title="Close"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Body */}
                                <div className='p-6 overflow-y-auto flex-1 text-sm text-gray-700'>
                                    {isSummarizing ? (
                                        <div className='flex flex-col items-center justify-center py-12 gap-3 text-center'>
                                            <div className='w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                                            <p className='font-semibold text-gray-700'>Analyzing chat activity with Groq AI...</p>
                                            <p className='text-xs text-gray-400'>Fetching thread from Redux & synthesizing key discussions</p>
                                        </div>
                                    ) : summaryError ? (
                                        <div className='p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-center flex flex-col gap-2'>
                                            <p className='font-medium'>{summaryError}</p>
                                            <button
                                                onClick={(e) => handleSummarize(e, selectedTeamForSummary)}
                                                className='self-center px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition cursor-pointer'
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='space-y-3'>
                                            {isFallback && (
                                                <div className='px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-1.5'>
                                                    <span>ℹ️</span>
                                                    <span>No messages sent today yet. Showing summary of latest activity.</span>
                                                </div>
                                            )}
                                            <div className='whitespace-pre-wrap leading-relaxed text-gray-800 bg-gray-50/70 p-4 rounded-xl border border-gray-100 font-sans'>
                                                {summaryText}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className='px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50'>
                                    {summaryText && !isSummarizing && !summaryError ? (
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(summaryText);
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 2000);
                                            }}
                                            className='text-xs text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white border border-gray-200 transition cursor-pointer'
                                        >
                                            {copied ? '✓ Copied!' : '📋 Copy Summary'}
                                        </button>
                                    ) : <div></div>}
                                    <button
                                        onClick={() => setOpenSummaryModal(false)}
                                        className='px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer'
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}
