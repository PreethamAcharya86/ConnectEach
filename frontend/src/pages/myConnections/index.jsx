import { acceptConnection, getAboutUser, getAllUsers, getMyConnections } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from'./style.module.css'
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function MyConnections() {
    const dispatch = useDispatch();
    const router = useRouter();
    const authState = useSelector((state) => state.auth);

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
                                    <div key={connection._id} className={`${styles.container} flex w-full p-2 hover:shadow-xl transition delay-200 shadow-lg cursor-pointer gap-2 rounded-md`} onClick={() => {
                                        router.push(`/viewProfilePage/${connection.userId.username}`)
                                    }}>
                                        <img src={`${BASE_URL}/${connection.userId.profilePicture}`} alt="user image" className='h-15 w-15 rounded-full' />
                                        <div className='flex flex-col'>
                                            <h1 className='font-bold'> @{connection.userId.username} </h1>
                                            <p>{connection.userId.name}</p>
                                        </div>
                                        {
                                            connection.status_accepted === null &&
                                            <div className='flex !ml-auto gap-2 py-3'>
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
                                            </div>
                                        }
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
