import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import { createPost, deleteComment, deletePost, getAllPosts, getComments, likePost, postComment } from '@/config/redux/action/postAction';
import UserLayout from '@/layout/userLayout';
import DashBoardLayout from '@/layout/DashBoardLayout';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '@/config';
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
    const textareaRef = useRef(null);
    const router = useRouter();
    
    const handleUpload = async() => {
        await dispatch(createPost({file: filecontent, body: postContent}));
        setPostcontent("");
        setFilecontent();
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
                <p className='text-xl font-semibold'>Share your achievements or thoughts</p>
                {
                    authState.user.length == 0 ? 
                    <div>
                        Loading..
                    </div> :
                    <div className="dashboardComponent md:px-5 px-1  !mt-8 relative">
                        <div className={`${styles.userDashbaord} flex justify-evenly items-center p-2 bg-blue-400 rounded-md`}>
                            {authState.user?.userId?.profilePicture && <img src={`${BASE_URL}/${authState.user.userId.profilePicture}`} alt="" className='h-12 w-12 rounded-full self-start'/>}
                            <textarea placeholder='Type here' ref={textareaRef ?? 0}  rows={1} className={`${styles.textArea} rounded-md !mx-2 w-full resize-none overflow-auto border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out max-h-80`} onChange={(e) => {
                                setPostcontent(e.target.value);
                                const el = textareaRef.current;
                                if (!el) return;
                                el.style.height = "auto";
                                el.style.height = el.scrollHeight + "px";
                                }} value={postContent}
                                onKeyDown={(e) => {
                                    if(e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleUpload();
                                    }
                                }}></textarea>
                            <label htmlFor="fileUpload" className='h-10 flex justify-center items-center'>
                                {
                                    filecontent ?
                                    <div className='p-1 ring-1 rounded-lg hover:ring-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                                        </svg>
                                    </div> :
                                    <div className="Fab p-1 ring-1 rounded-lg hover:ring-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                    </div>
                                }
                            </label>
                            <input type="file" hidden id='fileUpload' onChange={(e) => setFilecontent(e.target.files[0])}/>
                        </div>
                        <button className={`${styles.uploadBtn} !mt-2 p-1 rounded-md bg-blue-200`} onClick={handleUpload}>Upload</button>
                    </div>
                }
                <div className='!mt-4 flex flex-col gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 w-full justify-center items-center bg-white'>
                    {
                        authState.user.length == 0?
                        <div>Loading....</div> :
                        postState.posts.map((post) => {
                            return (
                                <div key={post._id} className='flex transition-all duration-300 border flex-col w-full shadow-[0_4px_12px_rgba(96,165,250,0.3)] p-4  !mt-2 rounded-lg gap-2 bg-gradient-to-br from-blue-50 via-white to-blue-50'>
                                    <div className='flex flex-col'>
                                        <div className='flex gap-2 cursor-pointer' onClick={() => {
                                            router.push(`/viewProfilePage/${post.userId.username}`)
                                        }}>
                                            <div className='flex-shrink-0'>
                                                { post.userId?.profilePicture && <img src={`${BASE_URL}/${post.userId.profilePicture}`} alt="Profile" className='h-10 w-10 object-cover rounded-full' />}
                                            </div>
                                            <div className='flex flex-col justify-center items-start'>
                                                <p className='font-semibold'>{post?.userId?.name}</p>
                                                <p className='opacity-50'>@{post?.userId?.username}</p>
                                            </div>
                                            <div className='items-end !ml-auto'>
                                                <p className='text-sm self-end text-gray-500'>{formatDate(post.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className='flex'>
                                            <p className='text-gray-600'>{post?.body}</p>
                                        </div>
                                        
                                        {
                                            post?.userId?._id == authState?.user?.userId?._id &&
                                            <div className='!ml-auto p-2 h-10 rounded-xl shadow-lg hover:shadow-xl hover:bg-red-100 transition-all duration-300 cursor-pointer' onClick={ async (event) => {
                                                event.stopPropagation()
                                                dispatch(deletePost({
                                                    postId: post._id }))
                                                dispatch(getAllPosts())
                                            }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </div>
                                        }
                                    </div>
                                    {
                                        post.media &&
                                        <div className='w-80 object-cover self-center'>
                                            <img src={`${BASE_URL}/${post.media}`} alt="post" className='cover rounded-xl cursor-pointer' onClick={() => {
                                                router.push(`/viewProfilePage/${post.userId.username}`)
                                            }}/>
                                        </div>
                                    }
                                    
                                    <div className = "flex justify-between items-center">
                                        <div className='likes flex p-1 hover:bg-red-100 transition rounded-lg cursor-pointer shadow-md' onClick={
                                            async () => {
                                                await dispatch(likePost({
                                                    postId : post._id
                                                }))
                                                await dispatch(getAllPosts());
                                            
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill={                                                
                                                post.likes.includes(authState?.user?.userId?._id)   ?
                                                "red":"none"
                                            } viewBox="0 0 24 24" strokeWidth={1.5} stroke={                                                
                                                post.likes.includes(authState?.user?.userId?._id) ?
                                                "red":"currentColor"
                                            } className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                            </svg>
                                            <p className='text-sm'>{post.likes.length}</p>
                                        </div>
                                        <div className='comment flex p-1 hover:bg-yellow-100 transition rounded-lg cursor-pointer shadow-md' onClick={() => {
                                            setShowEmoji(false)
                                            dispatch(getComments({
                                                postId : post._id
                                            }))
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                            </svg>
                                        </div>
                                        <div className='share flex p-1 transition hover:bg-blue-100 rounded-lg cursor-pointer shadow-md' onClick={async() => {
                                            const profileUrl = `https://connect-each.onrender.com/viewProfilePage/${post.userId.username}`;
                                            if (navigator.share) {
                                                await navigator.share({
                                                    title: "Check this profile",
                                                    text: post.body,
                                                    url: profileUrl,
                                                });
                                            } else {
                                                alert("Sharing not supported on this browser");
                                            }
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {
                                        postState?.postId !== "" && postState?.postId === post._id &&
                                        <div className='flex flex-col'>
                                            <div className="flex-1 flex flex-col gap-2 md:px-4 sm:px-8">
                                                <div className='flex gap-1'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#e9e91ef0" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 hover:shodow-lg md:flex !mt-1 hidden cursor-pointer" onClick={() => setShowEmoji(!showEmoji)}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                                    </svg>
                                                    <input
                                                        type="text"
                                                        placeholder="Write a comment..."
                                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                                                    onChange={(e) => {
                                                        setComment(e.target.value);
                                                    }} value={comment}/>
                                                    <button className="self-center p-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" onClick={() => {
                                                    dispatch(postComment({
                                                        token: localStorage.getItem("token"),
                                                        postId: post._id,
                                                        body: comment
                                                    }))
                                                    setComment("")
                                                    setShowEmoji(false)
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                                    </svg>
                                                </button>
                                                </div>
                                                {
                                                    showEmoji &&
                                                    <div className='z-90'>
                                                        <EmojiPicker onEmojiClick={(emojiData) => {
                                                            setComment(comment+emojiData.emoji)
                                                        }}/>
                                                    </div>
                                                }
                                            </div>
                                            <div className='flex flex-col gap-2'>
                                                {
                                                    postState?.comments?.length == 0 ? 
                                                    (
                                                        <div className='flex justify-center'>
                                                            <img src="/images/no_comments.png" alt="No Comments" className='h-50'/>
                                                        </div> 
                                                    ) : 
                                                    (
                                                        <div className='grid md:grid-cols-3 grid-cols-1 px-4 md:px-2 gap-2 bg-gray-100 p-2 rounded-lg'>
                                                        {
                                                            postState?.comments?.map((comment) => {
                                                                return (
                                                                    <div key={comment._id} className='flex flex-col gap-0.5 p-2 rounded-lg ring-2 ring-blue-400 shadow-lg bg-white rounded'>
                                                                        <div className='flex gap-2'>
                                                                            <div className='overflow-hidden h-8 w-8 rounded-full flex-shrink-0'>
                                                                                <img src={`${BASE_URL}/${comment.userId.profilePicture}`} alt="Profile" className='h-full w-full object-cover rounded-full'/>
                                                                            </div>
                                                                        <div>
                                                                        <p className='text-sm'>{comment.userId.name}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p>{comment.body}</p>
                                                                </div>
                                                                {
                                                                    authState?.user?.userId?._id === comment.userId._id && 
                                                                    <button className="self-end px-2 py-0.5 bg-blue-400 text-white rounded-md hover:bg-blue-700 transition !mt-auto" onClick={() => {
                                                                        dispatch(deleteComment({
                                                                            commentId : comment._id,
                                                                            postId: post._id
                                                                        }))
                                                                    }} >
                                                                        <p className='text-sm'>Delete</p>
                                                                    </button>
                                                                }
                                                            </div>
                                                            
                                                        )
                                                    })
                                                }
                                                </div>
                                                )}
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}
