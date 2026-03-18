import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../Hooks/useAuth';
import { useSelector } from 'react-redux';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { handlelogin } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await handlelogin({ email, password })
        setEmail('');
        setPassword('');
        navigate('/');
    };
    const user = useSelector(state => state.auth.user)
    if (user) {
        navigate('/')
    }
    return (
        <div className="min-h-screen bg-[#0E0F15] text-white flex justify-center items-center p-4">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Side */}
                <div className="flex flex-col justify-center space-y-8 pr-0 md:pr-10">
                    <div className="bg-[#25B9CB] w-12 h-12 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,185,203,0.5)]">
                        {/* Lightning Icon */}
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Unleash the Power of <br />
                        <span className="text-[#25B9CB]">SentinelAI</span>
                    </h1>

                    <p className="text-gray-400 text-lg max-w-md">
                        Join thousands of developers building the next generation of intelligent agents. Scale your workflows with ease.
                    </p>

                    <div className="relative w-64 h-64 mt-10 hidden md:flex items-center justify-center">
                        <div className="absolute inset-0 border border-[#25B9CB] rounded-full animate-pulse opacity-10"></div>
                        <div className="absolute inset-4 border border-[#25B9CB] rounded-full animate-pulse opacity-20"></div>
                        <div className="absolute inset-8 border border-[#25B9CB] rounded-full animate-[pulse_3s_ease-in-out_infinite] opacity-40"></div>
                        <svg className="w-16 h-16 text-[#25B9CB] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex flex-col justify-center">
                    <div className="bg-[#12141D] border border-gray-800 rounded-xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                        <p className="text-gray-400 mb-8 text-sm">Log in to your account to continue.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full bg-[#181A25] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#25B9CB] transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                                    <a href="#" className="text-xs text-[#25B9CB] hover:underline">Forgot password?</a>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#181A25] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#25B9CB] transition-colors"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 bg-[#25B9CB] hover:bg-[#1E9EA0] text-white font-semibold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(37,185,203,0.4)] transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                            <p className="text-gray-400 text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-[#25B9CB] hover:underline font-semibold">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
