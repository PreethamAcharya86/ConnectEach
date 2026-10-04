import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';
import { getAboutUser } from '@/config/redux/action/authAction';
import { teamReset } from '@/config/redux/reducer/teamReducer';

export default function NavBarComponent(){
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const [active, setActive] = useState(""); 
    const [menu, setMenu] = useState(false)
    
    const dispatch = useDispatch();
    useEffect(() => {
        if(authState.isTokenThere) {
            dispatch(getAboutUser({ token : localStorage.getItem("token") }))
        }
    }, [authState.isTokenThere])
    useEffect(() => {
        setActive(router.pathname);
    },[])
    return (
        <div className='sticky  top-0 z-100 bg-white  shadow-md w-full'>
            <nav className={`${styles.container} justify-between md:flex hidden gap-2 text-xl py-2`}>
                <div className='py-1 px-2 !m-0.5 text-xl font-bold text-blue-500 hover:text-blue-600 rounded cursor-pointer' onClick={() => {router.push("/")}}>
                    ConnectEach
                </div>
                <div className='flex justify-evenly w-full'>
                    <div className={active == "/dashboard" ? 'flex  cursor-pointer items-center  scale-110 rounded-3xl bg-blue-100 px-2': 'flex items-center cursor-pointer transform text-gray-600 transition duration-300 hover:scale-110 rounded-3xl hover:bg-blue-100 px-2'} onClick={() => {
                        router.push("/dashboard")
                       }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg> 
                        <p className="text-sm" name = "Dashboard">Dashboard</p>
                    </div>
                    <div className={active == "/discover" ? 'flex cursor-pointer items-center scale-110 rounded-3xl bg-blue-100 px-2': 'flex items-center rounded-3xl hover:bg-blue-100 px-2 transform cursor-pointer text-gray-600 transition duration-300 hover:scale-110'} onClick={() => {
                        router.push("/discover")}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                            <p className='text-sm'>Discover</p>
                    </div>
                    <div className={active == "/myConnections"? 'flex items-center cursor-pointer scale-110 rounded-3xl bg-blue-100 px-2': 'flex items-center transform cursor-pointer text-gray-600 transition duration-300 hover:scale-110 rounded-3xl hover:bg-blue-100 px-2'} onClick={() => {router.push("/myConnections")}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                            <p className='text-sm'>Connection</p>
                    </div>
                    <div className={active == "/teams"? 'flex items-center cursor-pointer scale-110 rounded-3xl bg-blue-100 px-2': 'flex items-center transform cursor-pointer text-gray-600 transition duration-300 hover:scale-110 rounded-3xl hover:bg-blue-100 px-2'} onClick={() => {router.push("/teams")}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                            <p className='text-sm'>Team queries</p>
                    </div>
                </div>
                { 
                    authState.profileFetched && authState.profileFetched? 
                    <div className=' rounded-lg p-0.5 flex'>
                        <div className='flex p-1.5 border-2 hover:bg-red-100 transition delay-50 hover:border-red-500 justify-center rounded-lg items-center cursor-pointer' onClick={() => {
                            localStorage.removeItem("token")
                            dispatch(teamReset());
                            router.push("/login");
                            dispatch(reset());
                        }}>
                            
                            <p className='text-center text-sm'>Logout</p>
                        </div>
                    </div> :
                    <div className='p-1 rounded-lg p-0.5 flex'>
                        <div className='flex p-2  border-2 hover:bg-green-50 transition delay-50 hover:border-green-500 justify-center rounded-lg items-center cursor-pointer' 
                        onClick={() => {router.push("/login")}}>
                            <p className='text-center text-sm'>Login</p>
                        </div>
                    </div>
                    
                }
            </nav>
            <div className='flex justify-between md:hidden bg-blue-50 p-0.5'>
                <div className='flex justify-center items-center px-2 cursor-pointer hover:text-blue-600 text-blue-500' onClick={() => {
                    router.push("/")
                }}>
                    <p className='text-center font-semibold'>Connect<span className='text-gray-600'>Each</span></p>
                </div>
                <div className='p-2 hover:bg-blue-100 rounded-lg' onClick={() => {
                    setMenu(true);
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </div>
            </div>
            {
                // Small screen Devices
                menu &&
                    <div className="fixed inset-0 z-50 md:hidden bg-black/30 "
                        onClick={() => setMenu(false)}>
                        <div className="h-screen w-3/4 bg-white p-4 flex flex-col overflow-y-auto"
                            onClick={
                                (e) => e.stopPropagation()
                            }
                        >
                            <div className='flex h-full flex-col gap-2 px-2 justify-between'>
                                <div className='py-1 px-2 !m-0.5 text-xl font-bold text-blue-500 hover:text-blue-600 rounded cursor-pointer' onClick={() => {router.push("/")}}>
                                    ConnectEach
                                </div>
                                <div className={active == "/dashboard" ? 'flex  cursor-pointer items-center   rounded-3xl bg-blue-200 p-1 px-2 ring-1 ring-blue-500': 'flex items-center ring-1 ring-blue-400 p-1 cursor-pointer transform text-gray-600 transition duration-300 hover:scale-104 rounded-3xl hover:bg-blue-100 px-2'} onClick={() => {
                                    router.push("/dashboard")
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg> 
                                    <p className="" name = "Dashboard">Dashboard</p>
                                </div>
                                <div className={active == "/discover" ? 'flex cursor-pointer items-center rounded-3xl bg-blue-200 p-1 px-2 ring-1 ring-blue-500': 'flex items-center ring-1 ring-blue-400 p-1 rounded-3xl hover:bg-blue-100 px-2 transform cursor-pointer text-gray-600 transition duration-300 hover:scale-104'} onClick={() => {
                                    router.push("/discover")}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                    <p className=''>Discover</p>
                                </div>
                                <div className={active == "/myConnections"? 'flex items-center cursor-pointer rounded-3xl bg-blue-200 p-1 px-2 ring-1 ring-blue-500': 'flex items-center transform cursor-pointer text-gray-600 transition duration-300 hover:scale-104 ring-1 ring-blue-400 rounded-3xl p-1 hover:bg-blue-100 px-2'} onClick={() => {router.push("/myConnections")}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    <p className=''>Connection</p>
                                </div>
                                <div className={active == "/teams"? 'flex items-center cursor-pointer rounded-3xl bg-blue-100 px-2 p-1 ring-1 ring-blue-500': 'flex items-center transform cursor-pointer text-gray-600 transition duration-300 hover:scale-104 rounded-3xl hover:bg-blue-100 ring-1 ring-blue-400 p-1 px-2'} onClick={() => {router.push("/teams")}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                    </svg>
                                    <p className=''>Team queries</p>
                                </div>
                                <div className={active == "/profile"? 'flex items-center ring-1 cursor-pointer rounded-3xl bg-blue-100 px-2 p-1 ring-blue-500': 'flex items-center transform cursor-pointer text-gray-600 transition duration-300 hover:scale-104 rounded-3xl hover:bg-blue-100 ring-1 ring-blue-400 p-1 px-2'} onClick={() => {router.push("/profile")}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    <p className=''>View Profile</p>
                                </div>
                                { 
                                    authState.profileFetched && authState.profileFetched? 
                                    <div className='w-full rounded-lg p-0.5 flex'>
                                        <div className='flex p-1.5 px-4 border-2 border-blue-400 hover:bg-red-100 transition delay-50 hover:border-red-500 justify-center rounded-lg items-center cursor-pointer' onClick={() => {
                                            localStorage.removeItem("token")
                                            dispatch(teamReset());
                                            router.push("/login");
                                            dispatch(reset());
                                        }}>
                                            <p className='text-center'>Logout</p>
                                        </div>
                                    </div> :
                                    <div className='rounded-lg mt-auto w-full py-2 flex'>
                                        <div className='flex p-2 w-full border-2 border-blue-400 hover:bg-green-50 transition delay-50 px-4 hover:border-green-500 justify-center rounded-lg items-center cursor-pointer' 
                                        onClick={() => {router.push("/login")}}>
                                            <p className='text-center'>Login</p>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}
