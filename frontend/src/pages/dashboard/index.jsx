import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import { createPost, deleteComment, deletePost, getAllPosts, getComments, likePost, postComment } from '@/config/redux/action/postAction';
import UserLayout from '@/layout/userLayout';
import DashBoardLayout from '@/layout/DashBoardLayout';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import clientServer, { BASE_URL } from '@/config';
import styles from './style.module.css'
import EmojiPicker from 'emoji-picker-react';
import { useRouter } from 'next/router';
import { authEmptyMessage, setTokenIsThere } from '@/config/redux/reducer/authReducer';

export default function Dashboard() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const postState = useSelector((state) => state.posts);
    const [postContent, setPostcontent] = useState("");
    const [comment, setComment] = useState("");
    const [filecontent, setFilecontent] = useState();
    const [showEmoji, setShowEmoji] = useState(false)
    const [postSummaries, setPostSummaries] = useState({});
    const [loadingSummaryPostId, setLoadingSummaryPostId] = useState(null);
    const [openSummaryPostId, setOpenSummaryPostId] = useState({});
    const textareaRef = useRef(null);
    const router = useRouter();

    const handleSummarizePost = async (postId, body) => {
        if (!body || !body.trim()) {
            alert("This post does not have any text to summarize.");
            return;
        }

        if (openSummaryPostId[postId]) {
            setOpenSummaryPostId((prev) => ({ ...prev, [postId]: false }));
            return;
        }

        if (postSummaries[postId]) {
            setOpenSummaryPostId((prev) => ({ ...prev, [postId]: true }));
            return;
        }

        setLoadingSummaryPostId(postId);
        try {
            const res = await clientServer.post("/summarize-post", { description: body });
            if (res.data && res.data.summary) {
                setPostSummaries((prev) => ({ ...prev, [postId]: res.data.summary }));
                setOpenSummaryPostId((prev) => ({ ...prev, [postId]: true }));
            }
        } catch (err) {
            console.error("Failed to summarize post", err);
            alert(err.response?.data?.message || "Failed to summarize post");
        } finally {
            setLoadingSummaryPostId(null);
        }
    };
    
    const handleUpload = async() => {
        await dispatch(createPost({file: filecontent, body: postContent}));
        setPostcontent("");
        setFilecontent();
        // Reset textarea height back to default after posting
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    }
    const formatDate = (date_time) => {
        const date = new Date(date_time);
        return date.toLocaleString();
    }

    useEffect(() => {
        dispatch(authEmptyMessage())
        dispatch(setTokenIsThere())
        if(authState.isTokenThere) {
            dispatch(getAllPosts());
            dispatch(getAboutUser({ token : localStorage.getItem("token") }))
        }
        if(!authState.all_profile_fetched) {
            dispatch(getAllUsers());
        }
    }, [authState.isTokenThere])
   
    return (
        <UserLayout>
            <DashBoardLayout>
                {/* ── Page heading ── */}
                <p className='text-lg font-semibold text-slate-700 mb-3'>Share your achievements or thoughts</p>

                {/* ── Compose card ── */}
                {authState.user.length == 0 ? (
                    <div className='text-slate-400 text-sm'>Loading…</div>
                ) : (
                    <div className={`${styles.userDashboard} p-4 shadow-md`}>
                        <div className='flex items-start gap-3'>
                            {/* Avatar */}
                            {authState.user?.userId?.profilePicture && (
                                <img
                                    src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                                    alt="Your avatar"
                                    className='h-10 w-10 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-200'
                                />
                            )}
                            {/* Textarea */}
                            <textarea
                                placeholder="What's on your mind?"
                                ref={textareaRef ?? 0}
                                rows={2}
                                className={`${styles.textArea} flex-1 rounded-xl border border-slate-200 p-3 resize-none overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 max-h-80`}
                                onChange={(e) => {
                                    setPostcontent(e.target.value);
                                    const el = textareaRef.current;
                                    if (!el) return;
                                    el.style.height = "auto";
                                    el.style.height = el.scrollHeight + "px";
                                }}
                                value={postContent}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                        e.preventDefault();
                                        handleUpload();
                                    }
                                }}
                            />
                        </div>

                        {/* ── Action row ── */}
                        <div className='flex items-center justify-between mt-4 pt-3 border-t border-slate-100 pl-13'>
                            {/* Image attach */}
                            <label htmlFor="fileUpload" className='flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 cursor-pointer transition'>
                                {filecontent ? (
                                    <span className='flex items-center gap-1 text-emerald-600 font-medium'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                                        </svg>
                                        Image attached
                                    </span>
                                ) : (
                                    <span className='flex items-center gap-1'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                        Add image
                                    </span>
                                )}
                            </label>
                            <input type="file" hidden id='fileUpload' onChange={(e) => setFilecontent(e.target.files[0])} />

                            <button className={styles.uploadBtn} onClick={handleUpload}>
                                Post
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Feed ── */}
                <div className='mt-6 flex flex-col gap-4 w-full'>
                    {authState.user.length == 0 ? (
                        <div className='text-slate-400 text-sm text-center py-8'>Loading feed…</div>
                    ) : (
                        postState.posts.map((post) => (
                            <div key={post._id} className='flex flex-col w-full bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.13)] transition-shadow duration-300 overflow-hidden'>

                                {/* ── Post header ── */}
                                <div className='flex items-center gap-3 p-4 pb-3 cursor-pointer' onClick={() => router.push(`/viewProfilePage/${post.userId.username}`)}>
                                    <div className='flex-shrink-0'>
                                        {post.userId?.profilePicture && (
                                            <img src={`${BASE_URL}/${post.userId.profilePicture}`} alt="Profile" className='h-10 w-10 object-cover rounded-full ring-2 ring-slate-100' />
                                        )}
                                    </div>
                                    <div className='flex flex-col min-w-0'>
                                        <p className='font-semibold text-slate-900 text-sm leading-tight truncate'>{post?.userId?.name}</p>
                                        <p className='text-slate-400 text-xs'>@{post?.userId?.username}</p>
                                    </div>
                                    <div className='ml-auto flex items-center gap-2'>
                                        <p className='text-xs text-slate-400 whitespace-nowrap'>{formatDate(post.createdAt)}</p>
                                        {post?.userId?._id == authState?.user?.userId?._id && (
                                            <button
                                                className='p-1.5 rounded-lg hover:bg-red-50 transition text-slate-400 hover:text-red-500'
                                                onClick={async (event) => {
                                                    event.stopPropagation();
                                                    dispatch(deletePost({ postId: post._id }));
                                                    dispatch(getAllPosts());
                                                }}
                                                title="Delete post"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* ── Post body ── */}
                                {post?.body && (
                                    <div className='px-4 pb-3'>
                                        <p className='text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words'>{post.body}</p>
                                    </div>
                                )}

                                {/* ── Post image ── */}
                                {post.media && (
                                    <div className='w-full cursor-pointer' onClick={() => router.push(`/viewProfilePage/${post.userId.username}`)}>
                                        <img src={`${BASE_URL}/${post.media}`} alt="post" className='w-full max-h-96 object-cover' />
                                    </div>
                                )}

                                {/* ── AI summary panel ── */}
                                {openSummaryPostId[post._id] && postSummaries[post._id] && (
                                    <div className="mx-4 mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-sm">
                                        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-indigo-200/70">
                                            <span className="font-semibold text-xs text-indigo-700 flex items-center gap-1">✨ AI Summary</span>
                                            <button
                                                onClick={() => setOpenSummaryPostId(prev => ({ ...prev, [post._id]: false }))}
                                                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1 cursor-pointer"
                                            >✕</button>
                                        </div>
                                        <p className="whitespace-pre-line text-xs leading-relaxed text-slate-700">{postSummaries[post._id]}</p>
                                    </div>
                                )}

                                {/* ── Action bar ── */}
                                <div className='flex items-center justify-between px-4 py-2.5 border-t border-slate-100'>
                                    <div className='flex items-center gap-1'>
                                        {/* Like */}
                                        <button
                                            className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition text-slate-500 hover:text-red-500 text-xs font-medium'
                                            onClick={async () => {
                                                await dispatch(likePost({ postId: post._id }));
                                                await dispatch(getAllPosts());
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill={post.likes.includes(authState?.user?.userId?._id) ? "red" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={post.likes.includes(authState?.user?.userId?._id) ? "red" : "currentColor"} className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                            </svg>
                                            <span>{post.likes.length}</span>
                                        </button>

                                        {/* Comment */}
                                        <button
                                            className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-amber-50 transition text-slate-500 hover:text-amber-600 text-xs font-medium'
                                            onClick={() => {
                                                setShowEmoji(false);
                                                dispatch(getComments({ postId: post._id }));
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                            </svg>
                                            <span>Comment</span>
                                        </button>

                                        {/* Share */}
                                        <button
                                            className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition text-slate-500 hover:text-blue-600 text-xs font-medium'
                                            onClick={async () => {
                                                const profileUrl = `https://connect-each.onrender.com/viewProfilePage/${post.userId.username}`;
                                                if (navigator.share) {
                                                    await navigator.share({ title: "Check this profile", text: post.body, url: profileUrl });
                                                } else {
                                                    alert("Sharing not supported on this browser");
                                                }
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                            </svg>
                                            <span>Share</span>
                                        </button>
                                    </div>

                                    {/* AI Summarize */}
                                    {post?.body && post.body.trim().length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => handleSummarizePost(post._id, post.body)}
                                            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-sm transition cursor-pointer"
                                            title="Summarize post description with AI"
                                        >
                                            {loadingSummaryPostId === post._id ? (
                                                <><span className="inline-block animate-spin">⏳</span><span>Summarizing…</span></>
                                            ) : (
                                                <><span>✨</span><span>{openSummaryPostId[post._id] ? "Hide" : "Summarize"}</span></>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* ── Comment section ── */}
                                {postState?.postId !== "" && postState?.postId === post._id && (
                                    <div className='flex flex-col gap-3 px-4 pb-4 pt-1'>
                                        {/* Comment input */}
                                        <div className='flex gap-2 items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#e9e91ef0" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 hover:shadow-lg md:flex hidden cursor-pointer text-slate-400 flex-shrink-0" onClick={() => setShowEmoji(!showEmoji)}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="Write a comment…"
                                                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 transition"
                                                onChange={(e) => setComment(e.target.value)}
                                                value={comment}
                                            />
                                            <button
                                                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex-shrink-0"
                                                onClick={() => {
                                                    dispatch(postComment({ token: localStorage.getItem("token"), postId: post._id, body: comment }));
                                                    setComment("");
                                                    setShowEmoji(false);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Emoji picker */}
                                        {showEmoji && (
                                            <div className='z-50'>
                                                <EmojiPicker onEmojiClick={(emojiData) => setComment(comment + emojiData.emoji)} />
                                            </div>
                                        )}

                                        {/* Comments list */}
                                        {postState?.comments?.length == 0 ? (
                                            <div className='flex justify-center py-4'>
                                                <img src="/images/no_comments.png" alt="No Comments" className='h-40' />
                                            </div>
                                        ) : (
                                            <div className='grid md:grid-cols-3 grid-cols-1 gap-2'>
                                                {postState?.comments?.map((comment) => (
                                                    <div key={comment._id} className='flex flex-col gap-1 p-3 rounded-xl border border-slate-200 bg-slate-50 shadow-xs'>
                                                        <div className='flex items-center gap-2'>
                                                            <div className='h-7 w-7 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-slate-200'>
                                                                <img src={`${BASE_URL}/${comment.userId.profilePicture}`} alt="Profile" className='h-full w-full object-cover' />
                                                            </div>
                                                            <p className='text-xs font-semibold text-slate-800'>{comment.userId.name}</p>
                                                        </div>
                                                        <p className='text-sm text-slate-600 pl-9'>{comment.body}</p>
                                                        {authState?.user?.userId?._id === comment.userId._id && (
                                                            <button
                                                                className="self-end text-xs px-2 py-0.5 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition mt-1"
                                                                onClick={() => dispatch(deleteComment({ commentId: comment._id, postId: post._id }))}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}
