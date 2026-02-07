import { useRouter } from "next/router";
import styles from '@/styles/home.module.css'
import UserLayout from "@/layout/userLayout";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token")
    })

    return (
        <UserLayout>
        <div className={`${styles.main_container} w-full`}>
            <section className="min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-white">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Welcome to <span className="text-blue-500">ConnectEach</span>
                        </h1>

                        <p className="text-lg text-gray-600 max-w-xl">
                            ConnectEach is a professional networking platform designed to
                            help students, developers, and professionals build meaningful
                            connections, showcase their skills, and grow their careers 
                            all in one place.
                        </p>
                        <button
                            className="w-fit px-6 py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition"
                            onClick={() => router.push("/login")}
                        >
                            Join Us Now
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-full max-w-md h-80 border-2 border-dashed border-blue-300 rounded-2xl flex items-center justify-center bg-white">
                            <img src="/images/home.png" alt="Home picture" className="w-full h-full object-cover"/>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-20 bg-blue-50">
                <div className="container flex gap-4 flex-col mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Platform Features
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition delay-50 hover:bg-blue-200">
                            <h3 className="font-semibold text-lg mb-2">Professional Profiles</h3>
                            <p className="text-gray-600 text-sm">
                                Create a detailed profile showcasing your education,
                                experience, bio, and current role — just like a digital resume.
                            </p>
                        </div>

                        <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition delay-50 hover:bg-blue-200">
                            <h3 className="font-semibold text-lg mb-2">Connections & Networking</h3>
                            <p className="text-gray-600 text-sm">
                                Send and receive connection requests, build your professional
                                circle, and stay connected with like-minded individuals.
                            </p>
                        </div>

                    <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition delay-50 hover:bg-blue-200">
                        <h3 className="font-semibold text-lg mb-2">Posts & Engagement</h3>
                        <p className="text-gray-600 text-sm">
                            Share updates, thoughts, and achievements. Like, comment,
                            and engage with posts from your network.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition delay-50 hover:bg-blue-200">
                        <h3 className="font-semibold text-lg mb-2">Team Collaboration</h3>
                        <p className="text-gray-600 text-sm">
                        Create or join teams, collaborate on ideas, and communicate
                        effectively within your professional groups.
                        </p>
                     </div>

                    <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition delay-50 hover:bg-blue-200">
                        <h3 className="font-semibold text-lg mb-2">Resume Download</h3>
                        <p className="text-gray-600 text-sm">
                            Download professional resumes directly from user profiles,
                            making hiring and collaboration easier.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-md hover:scale-105 transition delay-50 hover:bg-blue-200">
                        <h3 className="font-semibold text-lg mb-2">Clean & Focused UI</h3>
                        <p className="text-gray-600 text-sm">
                            A minimal, distraction-free interface designed for productivity
                            and clarity.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <section className="py-20 bg-blue-500 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
                Start Building Your Professional Network Today
            </h2>
            <p className="mb-6 text-blue-100">
                Join ConnectEach and take the next step toward meaningful connections
                and career growth.
            </p>
            <button
                className="px-8 py-3 bg-white text-blue-600 ring-2 rounded-xl font-semibold hover:bg-blue-400 hover:ring-white hover:text-white transition"
                onClick={() => router.push("/login")}
            >
                Get Started
            </button>
        </section>
      </div>
    </UserLayout>
  );
}
