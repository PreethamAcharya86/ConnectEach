import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { authEmptyMessage } from '@/config/redux/reducer/authReducer';
import UserLayout from '@/layout/userLayout'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function LoginComponent() {
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const [userLoginMethod, setUserLoginMethod] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");

    const handleRegister = () => {
        dispatch(registerUser({ username, name, email, password }));
    };

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
    };

    useEffect(() => {
        if (authState.loggedIn) {
            router.push("/dashboard");
        }
    }, [authState.loggedIn]);

    useEffect(() => {
        setTimeout(() => {
            dispatch(authEmptyMessage())
        }, 5000);
    },[authState.message])
    useEffect(() => {
        if (localStorage.getItem("token")) {
            router.push("/dashboard");
        }
    });
    return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
                <div className="w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden grid md:grid-cols-2">

                    {/* LEFT SECTION */}
                    <div className="hidden md:flex flex-col justify-center gap-2 items-start p-10 bg-gradient-to-br from-blue-400 to-blue-500 text-white">
                        <h1 className="text-4xl font-bold mb-4">ConnectEach</h1>
                        <p className="text-lg mb-8 opacity-90">
                            Find people with the same interests and grow your network.
                        </p>
                        <div className="w-full rounded-xl overflow-hidden shadow-lg">
                            <img
                                src="images/discover.png"
                                alt="Login image"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="flex flex-col justify-center items-center p-8 md:p-12 gap-4">
                        <h2 className="text-3xl font-semibold">
                            {userLoginMethod ? "Login" : "Create Account"}
                        </h2>

                        {
                            authState.message && 
                            <div className='flex w-full'>
                                {
                                authState?.message?.ErrMsg &&
                                    <p className='text-red-500 font-semibold w-full text-center'>
                                        {authState.message.ErrMsg}
                                    </p>
                            }
                            {
                                authState?.message?.message &&
                                <p className='font-semibold w-full text-green-500 text-center'>
                                    {authState.message.message}
                                </p>
                            }
                            </div>
                        }

                        <div className="w-full max-w-sm flex flex-col gap-3 mt-4">
                            {
                            !userLoginMethod && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        className="input px-3 py-2 rounded-lg border border-gray-300 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 ring-1"
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="input px-3 py-2 rounded-lg border border-gray-300 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 ring-1"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </>
                            )}

                            <input
                                type="email"
                                placeholder="Email"
                                className="input px-3 py-2 rounded-lg border border-gray-300 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 ring-1"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                className="input px-3 py-2 rounded-lg border border-gray-300 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 outline-none focus:outline-none focus:ring-0 ring-1"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                className="mt-3 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
                                onClick={userLoginMethod ? handleLogin : handleRegister}
                            >
                                {userLoginMethod ? "Login" : "Sign Up"}
                            </button>
                        </div>

                        <p
                            className="text-sm text-blue-600 cursor-pointer hover:underline mt-4"
                            onClick={() => setUserLoginMethod(!userLoginMethod)}
                        >
                            {userLoginMethod
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Login"}
                        </p>
                    </div>
                </div>
            </div>
    );
}
