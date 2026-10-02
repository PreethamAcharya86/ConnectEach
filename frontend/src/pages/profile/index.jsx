import React, { useEffect, useState } from 'react'
import clientServer, { BASE_URL } from '@/config';
import DashBoardLayout from '@/layout/DashBoardLayout';
import UserLayout from '@/layout/userLayout';
import EmojiPicker from 'emoji-picker-react';
import styles from './style.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, deletePost, getAllPosts, getComments, likePost, postComment } from '@/config/redux/action/postAction';
import { addSkill, getAboutUser, getAllUsers, getConnectionRequest, getMyConnections, removeSkill, sendConnectionRequest, updateBackgroundImage, updateProfilePicture } from '@/config/redux/action/authAction';
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';

export default function profilePage() {
    const router = useRouter()
    const postReducer = useSelector((state) => state.posts);
    
    const [userPost, setUserPost] = useState([]);
    const [openConnection, setOpenConnection] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [comment, setComment] = useState("");
    const [profilePicture, setProfilePicture] = useState();
    const [backgroundImg, setBackgroundImg] = useState();
    const [userProfile, setUserProfile] = useState({});
    const [copy, setCopy] = useState("");
    const [skill, setSkill] = useState("")
    const [showAddSkill, setShowAddSkill] = useState(false);

    const authState = useSelector((state) => state.auth);   
    const postState = useSelector((state) => state.posts);
    const dispatch = useDispatch();

    const updatePicture = async () => {
        const formData = new FormData();
        formData.append("file", profilePicture);
        formData.append("token", localStorage.getItem("token"));
        dispatch(updateProfilePicture(formData))
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
    const updateBackgroundImg = async () => {
        const formData = new FormData();
        formData.append("file", backgroundImg);
        formData.append("token", localStorage.getItem("token"));
        dispatch(updateBackgroundImage(formData));
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
    const formatDate = (date_time) => {
        const date = new Date(date_time);
        return date.toLocaleString();
    }
    useEffect(() => {
        dispatch(setTokenIsThere());
        if(authState.isTokenThere) {
            dispatch(getAboutUser({ token: localStorage.getItem("token")}))
        }
        dispatch(getAllPosts());
        dispatch(getAllUsers());
        dispatch(getConnectionRequest({
            token: localStorage.getItem("token")
        }))
        dispatch(getMyConnections({
            token: localStorage.getItem("token")
        }))
    }, []);

    useEffect(() => {
        let post = postReducer.posts.filter((post) => {
            return post.userId._id === userProfile?.userId?._id;
        })
        setUserPost(post);
    }, [postReducer.posts, userProfile]);
    
    useEffect(() => {
        if (profilePicture) {
            updatePicture();
        }
    }, [profilePicture]);
    useEffect(() => {
        if(backgroundImg) {
            updateBackgroundImg();
        }
    },[backgroundImg])
    useEffect(() => {
        setUserProfile(authState.user);
    }, [authState.user, postReducer.posts]);
    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }))
    },[])
    return (
        <UserLayout>
            <DashBoardLayout>
                <div className={`${styles.container} flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto rounded-3xl border border-slate-200/80 shadow-xs bg-white`}>
                    {/* Header Banner & Profile Card */}
                    <div className='relative w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-slate-100 group'>
                        <label htmlFor="setBackgroundImage" className='w-full cursor-pointer block relative'>
                            <img 
                                src={`${BASE_URL}/${userProfile?.userId?.backgroundImage}`}  
                                alt="Cover backdrop" 
                                className='w-full h-44 sm:h-52 md:h-60 object-cover transition duration-300 group-hover:brightness-90'
                            />
                            <div className='absolute top-3 right-3 bg-slate-900/75 hover:bg-slate-900 text-white text-xs font-medium px-3.5 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 shadow-sm transition'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                                <span>Change Cover</span>
                            </div>
                        </label>
                    </div>

                    {/* Profile Avatar & Info Row */}
                    <div className='relative flex flex-col md:flex-row md:items-end justify-between px-2 sm:px-4 -mt-16 sm:-mt-20 gap-4'>
                        <div className='flex flex-col sm:flex-row items-center sm:items-end gap-4'>
                            <div className='relative group cursor-pointer'>
                                <label htmlFor="setProfilePicture" className='cursor-pointer block relative'>
                                    <img 
                                        src={`${BASE_URL}/${userProfile?.userId?.profilePicture}`} 
                                        alt={userProfile?.userId?.name || "User profile"} 
                                        className='h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-white shadow-xl bg-white transition duration-200 group-hover:brightness-90'
                                    />
                                    <div className='absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition flex items-center justify-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                        </svg>
                                    </div>
                                </label>
                            </div>
                            <div className='flex flex-col text-center sm:text-left'>
                                <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
                                    {userProfile?.userId?.name}
                                </h1>
                                <p className='text-slate-500 font-medium text-sm sm:text-base'>
                                    @{userProfile?.userId?.username}
                                </p>
                                {userProfile?.currentPost && (
                                    <p className='text-blue-700 font-semibold text-sm sm:text-base mt-0.5'>
                                        {userProfile.currentPost}
                                    </p>
                                )}
                                <div className='flex items-center justify-center sm:justify-start gap-3 mt-1 text-xs text-slate-500'>
                                    <span className='flex items-center gap-1.5'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-slate-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                        {userProfile?.userId?.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Bar */}
                        <div className='flex flex-wrap items-center justify-center sm:justify-end gap-2.5 mt-2 md:mt-0'>
                            <button 
                                className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer'
                                onClick={() => router.push("/editProfile")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                                <span>Edit Profile</span>
                            </button>

                            <button 
                                className='px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl border border-slate-200/90 shadow-xs transition flex items-center gap-2 cursor-pointer'
                                onClick={async () => {
                                    const response = await clientServer.get(`/download-resume?id=${userProfile.userId._id}`);
                                    window.open(`${BASE_URL}/${response.data.convert_data}`, "_blank");
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-blue-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                <span>Download Resume</span>
                            </button>

                            {authState.user?.userId?._id === userProfile?.userId?._id && (
                                <button 
                                    className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                                        openConnection 
                                            ? 'bg-blue-50 border-blue-300 text-blue-700' 
                                            : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700 shadow-xs'
                                    }`}
                                    onClick={() => setOpenConnection(!openConnection)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-blue-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                    </svg>
                                    <span>Connections</span>
                                    <span className='px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold'>
                                        {authState.myConnections.filter((connection) => connection.status_accepted === true).length}
                                    </span>
                                </button>
                            )}

                            <button 
                                className='p-2 rounded-xl border border-slate-200/90 hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition shadow-xs flex items-center justify-center cursor-pointer'
                                title="Share profile"
                                onClick={() => {
                                    const url = `${window.location.origin}/viewProfilePage/${userProfile.userId.username}`;
                                    navigator.clipboard.writeText(url);
                                    setCopy("Copied");
                                    setTimeout(() => setCopy(""), 1500);
                                }}
                            >
                                {copy ? (
                                    <span className='text-xs font-semibold text-emerald-600 px-1'>✓ Copied</span>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <input type="file" hidden id='setProfilePicture' onChange={(e) => {
                            setProfilePicture(e.target.files[0]);
                            updatePicture();
                        }}/>
                        <input type="file" hidden id='setBackgroundImage' onChange={(e) => {
                            setBackgroundImg(e.target.files[0]);
                            updateBackgroundImg();
                        }}/>
                    </div>

                    {/* Connections Grid Drawer */}
                    {openConnection && (
                        <div className='p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 transition-all'>
                            <div className='flex items-center justify-between pb-3 mb-3 border-b border-slate-200'>
                                <h3 className='text-base font-bold text-slate-900 flex items-center gap-2'>
                                    <span>Connections</span>
                                    <span className='text-xs font-normal text-slate-500'>
                                        ({authState.myConnections?.filter((c) => c.status_accepted === true).length})
                                    </span>
                                </h3>
                                <button 
                                    onClick={() => setOpenConnection(false)}
                                    className='text-slate-400 hover:text-slate-600 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-slate-200/60 transition cursor-pointer'
                                >
                                    Close
                                </button>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                                {authState.myConnections?.filter((connection) => connection.status_accepted === true).map((user) => (
                                    <div 
                                        key={user._id} 
                                        className='p-3 bg-white hover:bg-blue-50/50 rounded-xl cursor-pointer border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-sm transition flex items-center gap-3'
                                        onClick={() => { 
                                            router.push(`/viewProfilePage/${user.userId.username}`);
                                            setOpenConnection(false);
                                        }}
                                    >
                                        <img 
                                            src={`${BASE_URL}/${user.userId.profilePicture}`} 
                                            alt={user.userId.name} 
                                            className='h-10 w-10 rounded-full object-cover ring-2 ring-slate-100'
                                        />
                                        <div className='overflow-hidden'>
                                            <p className='font-semibold text-slate-800 text-sm truncate'>{user.userId.name}</p>
                                            <p className='text-xs text-slate-500 truncate'>@{user.userId.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Profile Information Cards */}
                    <div className='flex flex-col gap-5'>
                        {/* Bio / About */}
                        <div className='bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-3'>
                            <div className='flex justify-between items-center pb-2 border-b border-slate-100'>
                                <div className='flex items-center gap-2'>
                                    <span className='p-1.5 bg-blue-50 text-blue-600 rounded-lg'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    </span>
                                    <h2 className='font-bold text-slate-900 text-base sm:text-lg'>About</h2>
                                </div>
                                <button 
                                    onClick={() => router.push("/editProfile")}
                                    className='text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer'
                                    title="Edit Bio"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </button>
                            </div>
                            {userProfile?.bio ? (
                                <p className='text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line'>
                                    {userProfile.bio}
                                </p>
                            ) : (
                                <p className='text-slate-400 text-sm italic'>No bio provided yet.</p>
                            )}
                        </div>

                        {/* Current Role Card */}
                        <div className='bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-3'>
                            <div className='flex justify-between items-center pb-2 border-b border-slate-100'>
                                <div className='flex items-center gap-2'>
                                    <span className='p-1.5 bg-blue-50 text-blue-600 rounded-lg'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </span>
                                    <h2 className='font-bold text-slate-900 text-base sm:text-lg'>Current Role</h2>
                                </div>
                                <button 
                                    onClick={() => router.push("/editProfile")}
                                    className='text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer'
                                    title="Edit Current Role"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </button>
                            </div>
                            {userProfile?.currentPost ? (
                                <p className='text-slate-800 font-medium text-sm sm:text-base'>
                                    {userProfile.currentPost}
                                </p>
                            ) : (
                                <p className='text-slate-400 text-sm italic'>No current post updated yet.</p>
                            )}
                        </div>

                        {/* Skills Card */}
                        <div className='bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4'>
                            <div className='flex justify-between items-center pb-2 border-b border-slate-100'>
                                <div className='flex items-center gap-2'>
                                    <span className='p-1.5 bg-blue-50 text-blue-600 rounded-lg'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                        </svg>
                                    </span>
                                    <h2 className='font-bold text-slate-900 text-base sm:text-lg'>Skills</h2>
                                    <span className='px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold'>
                                        {authState?.user?.skills?.length || 0}
                                    </span>
                                </div>
                                {!showAddSkill && (
                                    <button 
                                        onClick={() => setShowAddSkill(true)}
                                        className='px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer'
                                    >
                                        <span>+</span>
                                        <span>Add Skill</span>
                                    </button>
                                )}
                            </div>

                            {/* Add Skill Input Row */}
                            {showAddSkill && (
                                <div className='flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200'>
                                    <input 
                                        type="text" 
                                        className='flex-1 px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                                        placeholder='Type a skill (e.g. React, Python)...'
                                        value={skill}
                                        onChange={(e) => {
                                            const words = e.target.value.trim().split(/\s+/).slice(0, 5);
                                            setSkill(words.join(" "));
                                        }}
                                    />
                                    <button 
                                        className='px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer'
                                        onClick={() => {
                                            if (skill.trim()) {
                                                dispatch(addSkill({ 
                                                    token: localStorage.getItem("token"),
                                                    skill: skill.trim()
                                                }));
                                                setSkill("");
                                                setShowAddSkill(false);
                                            }
                                        }}
                                    >
                                        Add
                                    </button>
                                    <button 
                                        className='px-2.5 py-1.5 text-slate-500 hover:text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer'
                                        onClick={() => {
                                            setSkill("");
                                            setShowAddSkill(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {/* Skills List */}
                            <div className='flex flex-wrap gap-2.5'>
                                {authState?.user?.skills?.length === 0 && (
                                    <p className='text-slate-400 text-sm italic'>No skills added yet.</p>
                                )}
                                {authState?.user?.skills?.map((s, idx) => (
                                    <div 
                                        key={idx} 
                                        className='group flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300 rounded-xl text-sm font-medium transition shadow-2xs'
                                    >
                                        <span className='size-1.5 rounded-full bg-blue-500'></span>
                                        <span>{s}</span>
                                        <button 
                                            onClick={() => {
                                                dispatch(removeSkill({ 
                                                    token: localStorage.getItem("token"),
                                                    skill: s
                                                }));
                                            }}
                                            className='text-slate-400 hover:text-red-600 transition ml-0.5 cursor-pointer'
                                            title="Remove skill"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education & Experience 2-Column Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            {/* Education Card */}
                            <div className='bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4'>
                                <div className='flex justify-between items-center pb-2 border-b border-slate-100'>
                                    <div className='flex items-center gap-2'>
                                        <span className='p-1.5 bg-blue-50 text-blue-600 rounded-lg'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                                            </svg>
                                        </span>
                                        <h2 className='font-bold text-slate-900 text-base sm:text-lg'>Education</h2>
                                    </div>
                                    <button 
                                        onClick={() => router.push("/editProfile")}
                                        className='text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer'
                                        title="Manage Education"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                    </button>
                                </div>

                                {userProfile?.education?.length === 0 ? (
                                    <p className='text-slate-400 text-sm italic py-2'>No education details provided.</p>
                                ) : (
                                    <div className='flex flex-col gap-3'>
                                        {userProfile?.education?.map((edu) => (
                                            <div key={edu._id} className='p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-xl flex flex-col gap-1'>
                                                <p className='font-bold text-slate-800 text-sm sm:text-base'>{edu.school}</p>
                                                <p className='text-slate-600 text-sm font-medium'>
                                                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Work Experience Card */}
                            <div className='bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4'>
                                <div className='flex justify-between items-center pb-2 border-b border-slate-100'>
                                    <div className='flex items-center gap-2'>
                                        <span className='p-1.5 bg-blue-50 text-blue-600 rounded-lg'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                            </svg>
                                        </span>
                                        <h2 className='font-bold text-slate-900 text-base sm:text-lg'>Work Experience</h2>
                                    </div>
                                    <button 
                                        onClick={() => router.push("/editProfile")}
                                        className='text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer'
                                        title="Manage Experience"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                    </button>
                                </div>

                                {userProfile?.pastWork?.length === 0 ? (
                                    <p className='text-slate-400 text-sm italic py-2'>No work history provided.</p>
                                ) : (
                                    <div className='flex flex-col gap-3'>
                                        {userProfile?.pastWork?.map((work) => (
                                            <div key={work._id} className='p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-xl flex flex-col gap-1'>
                                                <div className='flex justify-between items-start'>
                                                    <p className='font-bold text-slate-800 text-sm sm:text-base'>{work.company}</p>
                                                    {work.years && (
                                                        <span className='px-2 py-0.5 bg-slate-200/70 text-slate-600 rounded text-xs font-semibold'>
                                                            {work.years}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className='text-slate-600 text-sm'>{work.position}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Posts Section */}
                    <div className='flex flex-col gap-4 pt-2'>
                        <div className='flex items-center justify-between pb-2 border-b border-slate-200/80'>
                            <div className='flex items-center gap-2'>
                                <span className='p-1.5 bg-blue-50 text-blue-600 rounded-lg'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                </span>
                                <h2 className='text-lg font-bold text-slate-900'>Recent Activity & Posts</h2>
                                <span className='px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold'>
                                    {userPost.length}
                                </span>
                            </div>
                        </div>

                        {userPost.map((post) => (
                            <div key={post._id} className='bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-3.5'>
                                {/* Post Author Header */}
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <img 
                                            src={`${BASE_URL}/${userProfile?.userId?.profilePicture}`} 
                                            alt={userProfile?.userId?.name} 
                                            className='h-10 w-10 rounded-full object-cover ring-2 ring-slate-100'
                                        />
                                        <div>
                                            <p className='font-bold text-slate-800 text-sm'>{userProfile?.userId?.name}</p>
                                            <p className='text-xs text-slate-400'>{formatDate(post.createdAt)}</p>
                                        </div>
                                    </div>
                                    {post?.userId?._id === userProfile?.userId?._id && (
                                        <button 
                                            className='p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer'
                                            title="Delete post"
                                            onClick={async (event) => {
                                                event.stopPropagation();
                                                dispatch(deletePost({ postId: post._id }));
                                                dispatch(getAllPosts());
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Post Body */}
                                <p className='whitespace-pre-wrap break-words text-slate-800 text-sm leading-relaxed'>
                                    {post.body}
                                </p>

                                {/* Post Media */}
                                {post.media && (
                                    <div className='flex items-center justify-center rounded-xl overflow-hidden bg-slate-50 border border-slate-100 max-h-96'>
                                        <img src={`${BASE_URL}/${post.media}`} alt="Post content" className='w-full object-cover max-h-96' />
                                    </div>
                                )}

                                {/* Interaction Bar */}
                                <div className='flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600'>
                                    <div className='flex items-center gap-4'>
                                        <button 
                                            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition cursor-pointer ${
                                                post.likes.includes(authState?.user?.userId?._id)
                                                    ? 'text-red-600 bg-red-50 font-semibold'
                                                    : 'hover:bg-slate-100 text-slate-600'
                                            }`}
                                            onClick={async () => {
                                                await dispatch(likePost({ postId: post._id }));
                                                await dispatch(getAllPosts());
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill={post.likes.includes(authState?.user?.userId?._id) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                            </svg>
                                            <span>{post.likes.length}</span>
                                        </button>

                                        <button 
                                            className='flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer'
                                            onClick={() => {
                                                setShowEmoji(false);
                                                dispatch(getComments({ postId: post._id }));
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                            </svg>
                                            <span>Comments</span>
                                        </button>
                                    </div>

                                    <button 
                                        className='flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer'
                                        onClick={async () => {
                                            const profileUrl = `https://connect-each.onrender.com/viewProfilePage/${post.userId.username}`;   
                                            if (navigator.share) {
                                                await navigator.share({
                                                    title: "Check this profile",
                                                    text: post.body,
                                                    url: profileUrl,
                                                });
                                            } else {
                                                navigator.clipboard.writeText(profileUrl);
                                                alert("Link copied to clipboard!");
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                        </svg>
                                        <span>Share</span>
                                    </button>
                                </div>

                                {/* Comments Drawer */}
                                {postState?.postId === post._id && (
                                    <div className='flex flex-col gap-3 pt-3 border-t border-slate-100 bg-slate-50/50 p-4 rounded-xl'>
                                        <div className='flex items-center gap-2 relative'>
                                            <button 
                                                className='text-slate-400 hover:text-amber-500 transition cursor-pointer p-1'
                                                onClick={() => setShowEmoji(!showEmoji)}
                                                title="Pick Emoji"
                                            >
                                                😊
                                            </button>
                                            <input
                                                type="text"
                                                placeholder="Write a comment..."
                                                className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                            <button 
                                                className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition cursor-pointer"
                                                onClick={() => {
                                                    if (comment.trim()) {
                                                        dispatch(postComment({
                                                            token: localStorage.getItem("token"),
                                                            postId: post._id,
                                                            body: comment
                                                        }));
                                                        setComment("");
                                                        setShowEmoji(false);
                                                    }
                                                }}
                                            >
                                                Post
                                            </button>
                                        </div>

                                        {showEmoji && (
                                            <div className='z-50'>
                                                <EmojiPicker onEmojiClick={(emojiData) => setComment(comment + emojiData.emoji)} />
                                            </div>
                                        )}

                                        {/* Comments Feed */}
                                        <div className='flex flex-col gap-2 mt-1'>
                                            {postState?.comments?.length === 0 ? (
                                                <p className='text-xs text-slate-400 text-center py-2'>No comments yet. Be the first to comment!</p>
                                            ) : (
                                                postState?.comments?.map((c) => (
                                                    <div key={c._id} className='flex items-start justify-between p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs'>
                                                        <div className='flex items-start gap-2.5'>
                                                            <img 
                                                                src={`${BASE_URL}/${c.userId.profilePicture}`} 
                                                                alt={c.userId.name} 
                                                                className='h-7 w-7 rounded-full object-cover ring-1 ring-slate-100'
                                                            />
                                                            <div>
                                                                <p className='text-xs font-bold text-slate-800'>{c.userId.name}</p>
                                                                <p className='text-xs text-slate-700 mt-0.5'>{c.body}</p>
                                                            </div>
                                                        </div>
                                                        {authState?.user?.userId?._id === c.userId._id && (
                                                            <button 
                                                                className="text-xs text-slate-400 hover:text-red-600 transition cursor-pointer p-1"
                                                                onClick={() => {
                                                                    dispatch(deleteComment({
                                                                        commentId: c._id,
                                                                        postId: post._id
                                                                    }));
                                                                }}
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {userPost?.length === 0 && (
                            <div className='flex flex-col justify-center items-center py-10 bg-slate-50/60 rounded-2xl border border-slate-200/80 gap-3'>
                                <img src="/images/no_post.png" alt="No posts" className='h-28 opacity-70' />
                                <p className='text-slate-500 text-sm font-medium'>No posts created yet.</p>
                                {userProfile?.userId?._id === authState?.user?.userId?._id && (
                                    <button 
                                        className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer'
                                        onClick={() => router.push("/dashboard")}
                                    >
                                        Create a Post
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}
