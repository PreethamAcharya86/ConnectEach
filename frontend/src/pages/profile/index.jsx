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
                <div className={`${styles.container} flex flex-col p-2 gap-4`}>
                    <div className='w-full flex'>
                        <label htmlFor="setBackgroundImage" className='w-full'>
                            <img src={`${BASE_URL}/${userProfile?.userId?.backgroundImage}`}  alt="Backdrop image" className='w-full h-35 object-cover rounded-lg hover:brightness-40'/>
                        </label>
                        <div className='absolute md:top-35 top-20 !ml-2 z-10 group'>
                            <label htmlFor="setProfilePicture">
                                <div className='rounded-full overflow-hidden h-25 w-25'>
                                    <img src={`${BASE_URL}/${userProfile?.userId?.profilePicture}`} alt="user image" className='h-25 w-25 scale-119 hover:brightness-40 rounded-full'/>
                                </div>
                                <div className={`${styles.editPicture} hidden group-hover:flex opacity-0 group-hover:opacity-100 absolute !ml-20 top-18 p-1 rounded-lg z-50 hover:shadow-xl transition delay-200`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className='flex !mt-4 justify-between items-start'>
                            <div className='flex flex-col gap-1'>
                                <p className='font-bold'>{userProfile?.userId?.name}</p>
                                <p>{userProfile?.userId?.email}</p>
                            </div>  
                            <div className='flex p-2 bg-white shadow-lg hover:scale-[1.02] hover-shadow-xl rounded-lg transition duration-100' onClick={() => {
                                const url = `${window.location.origin}/viewProfilePage/${userProfile.userId.username}`;
                                navigator.clipboard.writeText(url);
                                setCopy("Copied");
                                setTimeout(() => {
                                    setCopy("");
                                }, 1000)
                            }}>
                                { copy ? 
                                    <p className='text-sm'>{copy}</p> :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="blue" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                    </svg>
                                }
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
                    <div className='connection-button flex text-sm justify-between'>
                        {
                            authState.user?.userId?._id === userProfile?.userId?._id &&
                            <div className='bg-white p-2 ring-2 ring-blue-400 ring-inset cursor-pointer hover:bg-blue-400 transition delay-100 rounded-lg' onClick={() => {
                                setOpenConnection(!openConnection);
                            }}>
                                Connections { authState.myConnections.filter((connection) => connection.status_accepted === true ).length }
                            </div>
                        }
                        <div className='py-1 px-2 flex gap-1 justify-center bg-white items-center rounded-lg shadow-lg ring-2 ring-blue-400 ring-inset cursor-pointer hover:bg-blue-400 transition delay-100' onClick={async () => {
                            const response = await clientServer.get(`/download-resume?id=${userProfile.userId._id}`)
                            window.open(`${BASE_URL}/${response.data.convert_data}`, "_blank")
                        }}> <p>Download Resume</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </div>
                    </div>
                    {
                        openConnection &&
                        <div>
                            <p className='text-lg font-bold'>Connection</p>
                            <div className='grid md:grid-cols-3 grid-cols-2 gap-2'>
                                {
                                    authState.myConnections?.filter((connection) => connection.status_accepted === true).map((user) => {
                                        return (
                                            <div className='p-2 bg-white w-full cursor-pointer border border-transparent hover:border-black md:hover:scale-105 transition-all delay-50 !mt-2 rounded-xl w-1/2 shadow-lg flex gap-2' key={user._id} onClick={() => { 
                                                router.push(`/viewProfilePage/${user.userId.username}`);
                                                setOpenConnection(false)}}>
                                                <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="User profile" className='h-10 w-10 rounded-full'/>
                                                <p>{user.userId.name}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                    <div className='flex'>
                            <button className='p-1.5 ring-1 ring-inset cursor-pointer bg-blue-400 transition delay-100 rounded-lg text-sm hover:bg-blue-300' onClick={() => {
                                router.push("/editProfile")
                            }}>Update Profile</button>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col'>
                            <p className='font-medium text-lg'>Bio</p>
                            <div className='Bio flex justify-between p-2 bg-white rounded-lg w-full'>
                                {
                                    userProfile?.bio ? 
                                   <p>{userProfile.bio}</p> :
                                    <p className='text-gray-400'>Not updated yet</p>
                                }
                                <div className='flex p-2 rounded-lg' onClick={() => {
                                    router.push("/editProfile")
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <p className='font-medium text-lg'>Current post</p>
                            <div className='flex justify-between p-2 bg-white rounded-lg w-full'>
                                {
                                    userProfile?.currentPost ? 
                                    <p>{userProfile.currentPost}</p> :
                                    <p className='text-gray-400'>Not updated yet</p> 
                                }
                                <div className='flex p-2 rounded-lg' onClick={() => {
                                    router.push("/editProfile")
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col bg-white rounded-lg gap-2 p-2 w-full'>
                            <h1 className='text-lg font-semibold'>Skills</h1>
                            <div className='flex flex-col gap-2 '>
                                {
                                    authState?.user?.skills?.length === 0 &&
                                    <p className='text-gray-400'>No skills added</p>
                                }
                                {
                                    authState?.user?.skills?.map((skill, idx) => {
                                        return (
                                            <div className='flex gap-3' key={idx}>
                                                <div className='flex px-4 py-2 ring-2 ring-blue-400 rounded-full w-full gap-3 hover:scale-102 transition delay-50'>
                                                    <div className='flex shrink-0 justify-center items-center'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                        </svg>
                                                    </div>
                                                    <p className='text-gray-600'>{skill}</p>
                                                </div>
                                                <div className='flex justify-center items-center opacity-80'>
                                                    <div className='flex' onClick={() => {
                                                        dispatch(removeSkill({ 
                                                            token : localStorage.getItem("token"),
                                                            skill : skill
                                                        }))
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:text-red-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            {
                                showAddSkill ?
                                <div className='flex flex-col p-1 rounded-full gap-2 w-full'>
                                    <input type="text" className='w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 placeholder-gray-400 shadow-[0_4px_12px_rgba(96,165,250,0.3)] focus:outline-none ring-1 focus:ring-2 focus:ring-blue-300 transition' placeholder='Type skill' onChange={(e) => {
                                        const words = e.target.value.trim().split(/\s+/).slice(0, 5);
                                        setSkill(words.join(" "));
                                    }}/>
                                    <div className='flex' onClick={() => {
                                        dispatch(addSkill({ 
                                            token : localStorage.getItem("token"),
                                            skill : skill
                                        }))
                                        setSkill("");
                                        setShowAddSkill(false);
                                    }}>
                                        <button className='flex py-1 px-4 ring-2 ring-blue-400 bg-blue-100 hover:bg-blue-400 rounded-lg'>Add</button>
                                    </div>
                                </div> :
                                <div className='flex'>
                                    <div className='flex justify-center items-center p-1 rounded-full ring-2 ring-blue-200 hover:bg-blue-100' onClick={() => {
                                        setShowAddSkill(true)
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="blue" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div> 
                                </div>
                            }
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-2'>
                            <div className='Education w-full rounded-lg ring-2 bg-white ring-blue-400 p-2'>
                                <p className='font-medium text-lg text-center'>Education</p>
                                {
                                    userProfile?.education?.length == 0 &&
                                    <p className='p-1 w-full text-center bg-white rounded-lg text-gray-400'>No data provided</p>
                                }
                                <div className={`flex gap-2 overflow-x-auto items-stretch ${styles.scrollbar}`}>
                                {
                                    userProfile?.education?.map((edu) => {
                                        return (
                                            <div className='flex flex-col gap-2 p-2 bg-blue-50 rounded-lg flex-shrink-0 w-3/4' key={edu._id}>
                                                <div className='p-2 inset-ring inset-ring-blue-400/30 rounded-lg'>
                                                    <p className='font-medium'>College</p>
                                                    {edu.school}
                                                </div>
                                                <div className='p-2 inset-ring inset-ring-blue-400/30 rounded-lg'>
                                                    <p className='font-medium'>Degree</p>
                                                    {edu.degree}
                                                </div> 
                                                <div className='p-2 inset-ring inset-ring-blue-400/30 rounded-lg'>
                                                    <p className='font-medium'>Specialization</p>
                                                    {edu.fieldOfStudy}
                                                </div>
                                            </div> 
                                        )
                                    })
                                }
                                </div>
                            </div>
                            <div className='work w-full rounded-lg ring-2 ring-blue-400 bg-white p-2'>
                                <p className='font-medium text-lg text-center'>Work History</p>
                                {
                                    userProfile?.pastWork?.length == 0 &&
                                    <p className='p-1 w-full text-center bg-white rounded-lg text-gray-400'>No History</p>
                                }
                                <div className={`flex gap-2 overflow-x-auto items-stretch ${styles.scrollbar}`}>
                                {
                                    userProfile?.pastWork?.map((work) => {
                                        return (
                                            <div className='flex flex-col gap-2 p-2 bg-blue-50 rounded-lg flex-shrink-0 w-3/4' key={work._id}>
                                                <div className='p-2 inset-ring inset-ring-blue-400/30 rounded-lg'>
                                                    <p className='font-medium'>Company</p>
                                                    {work.company}
                                                </div>
                                                <div className='p-2 inset-ring inset-ring-blue-400/30 rounded-lg'>
                                                    <p className='font-medium'>Position</p>
                                                    {work.position}
                                                </div> 
                                                <div className='p-2 inset-ring inset-ring-blue-400/30 rounded-lg'>
                                                    <p className='font-medium'>years</p>
                                                    {work.years}
                                                </div>
                                            </div> 
                                        )
                                    })
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='pt-1'>
                        <p className='text-xl font-semibold'>Recent posts</p>
                        {
                            userPost.map((post) => {
                                return (
                                    <div className='flex flex-col !mb-4 gap-2' key={post._id}>
                                            <div className={`${styles.postDiv} flex shadow-lg gap-4 flex-col rounded-lg w-full p-4`}>
                                                <div className='self-end !ml-auto'>
                                                    <p className='text-sm text-gray-500'>
                                                        {formatDate(post.createdAt)}
                                                    </p>
                                                </div>
                                                <div className='flex'>
                                                    <p>{ post.body }</p>
                                                    {
                                                        post?.userId?._id == userProfile?.userId?._id &&
                                                            <div className='!ml-auto p-2 h-10 rounded-xl shadow-lg hover:shadow-xl hover:bg-red-100 transition-all duration-300 cursor-pointer' onClick={ async (event) => {
                                                                    event.stopPropagation()
                                                                    dispatch(deletePost({
                                                                        postId: post._id }))
                                                                    dispatch(getAllPosts());
                                                                }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                </svg>
                                                            </div>
                                                    }
                                                </div>
                                                {
                                                    post.media &&
                                                    <div className='flex items-center justify-center'>
                                                        <img src={`${BASE_URL}/${post.media}`} alt="Profile" className='h-50 object-cover rounded-lg' />
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
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill= 
                                                            {                                                
                                                                post.likes.includes(authState?.user?.userId?._id)   ?
                                                                "red":"none"
                                                            } 
                                                            viewBox="0 0 24 24" strokeWidth={1.5} stroke= 
                                                            {                                                
                                                                post.likes.includes(authState?.user?.userId?._id) ?
                                                                    "red":"currentColor"
                                                            } className="size-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                        </svg>
                                                        <p className='text-sm'>{post.likes.length}</p>
                                                    </div>
                                                    <div className='comment hover:bg-yellow-100 transition flex p-1 rounded-lg cursor-pointer shadow-md' onClick={() => {
                                                        setShowEmoji(false)
                                                        dispatch(getComments({
                                                            postId : post._id
                                                        }))
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                                        </svg>
                                                    </div>
                                                    <div className='share flex p-1 hover:bg-blue-100 transition  rounded-lg cursor-pointer shadow-md' onClick={async() => {
                                                        const profileUrl = `${BASE_URL}/viewProfilePage/${post.userId.username}`;   
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
                                                { postState?.postId === post._id &&   
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
                                                        <div className='flex flex-col !mt-2 gap-2'>
                                                            {
                                                                postState?.comments?.length == 0 ?(
                                                                    <div className='flex justify-center'>
                                                                        <img src="/images/no_comments.png" alt="No Comments" className='h-50'/>
                                                                    </div>
                                                                ):(
                                                            <div className='grid md:grid-cols-3 grid-cols-1 px-4 md:px-2 gap-2 bg-gray-100 p-2 rounded-lg'>
                                                            {
                                                                postState?.comments?.map((comment) => {
                                                                    return (
                                                                        <div key={comment._id} className='flex flex-col gap-0.5 p-2 rounded-lg ring-2 ring-blue-400 shadow-lg bg-white rounded'>
                                                                            <div className='flex gap-2'>   
                                                                                <div className='flex-shrink-0'>              <img src={`${BASE_URL}/${comment.userId.profilePicture}`} alt="Profile" className='h-6 w-6 rounded-full object-cover'/>        </div> 
                                                                            <div>
                                                                                <p className='text-sm'>{comment.userId.name}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <p>{comment.body}</p>
                                                                        </div>
                                                                        {
                                                                            authState?.user?.userId?._id === comment.userId._id && 
                                                                            <button className="!mt-auto !ml-auto px-2 py-0.5 bg-blue-400 text-white rounded-md hover:bg-blue-700 transition" onClick={() => {
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
                                    </div>
                                )
                            })
                        }
                        {
                            userPost?.length === 0 && 
                            <div className='flex flex-col justify-center items-center'>
                                <img src="../images/no_post.png" alt="No posts" className='h-50' />
                                {
                                    userProfile?.userId?._id === authState?.user?.userId?._id &&
                                    <button className='p-2 ring-2 ring-blue-400 bg-blue-100 hover:bg-blue-400 cursor-pointer transition delay-50 rounded-lg' onClick={() => {
                                        router.push("/dashboard")
                                    }}>Create post</button>
                                }
                            </div>
                        }
                    </div>
                </div>
            </DashBoardLayout>
        </UserLayout>
  )
}
