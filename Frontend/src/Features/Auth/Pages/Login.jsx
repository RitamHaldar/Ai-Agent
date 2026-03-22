import React, { useState } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, Sparkles, Shield, Cpu } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../Hooks/useAuth';
import { useSelector } from 'react-redux';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setvisible] = useState(false);
    const { handlelogin, handlegetme } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await handlelogin({ email, password });
        setEmail('');
        setPassword('');
        navigate('/');

    };
    try {
        handlegetme();
    }
    catch (error) {
        console.log(error);
    }
    const user = useSelector(state => state.auth.user);
    if (user) {
        navigate('/');
    }
    return (
        <div className="min-h-screen bg-[#030305] text-white flex justify-center items-center p-4 md:p-8 relative overflow-hidden font-sans">
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/10 mix-blend-screen blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/5 mix-blend-screen blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10 items-center">
                <div className="flex flex-col justify-center space-y-10 pr-0 lg:pr-10 relative z-10 order-2 lg:order-1 hidden md:flex">
                    <div className="inline-flex items-center space-x-3 mb-2 animate-[fadeIn_1s_ease-out]">
                        <div className="bg-gradient-to-tr from-white via-gray-100 to-gray-300 w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-sm border border-white/10">
                            <Zap className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-wide">Axion AI</span>
                    </div>
                    <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 leading-[1.15]">
                        Unleash the <br /> Power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">Agents</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed font-light">
                        Join the ecosystem of the future. Build, deploy, and scale intelligent AI agents with unparalleled precision and security.
                    </p>

                </div>
                <div className="flex flex-col justify-center relative z-10 w-full max-w-md mx-auto lg:max-w-lg order-1 lg:order-2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="relative bg-[#0b0c10]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] hover:border-white/20 transition-colors duration-500">
                        <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
                            <div className="bg-gradient-to-tr from-white via-gray-100 to-gray-300 w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                <Zap className="w-5 h-5 text-black" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-wide">Axion AI</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white tracking-tight">Welcome Back</h2>
                        <p className="text-gray-400 mb-8 text-sm font-medium">Log in to your account to continue.</p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 transition-transform group-focus-within:scale-110 duration-300">
                                        <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@gmail.com"
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-white/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-white/50 transition-all duration-300 shadow-inner"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center pl-1 pr-1">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                                    <a href="#" className="text-[11px] text-gray-500 hover:text-[#25B9CB] transition-colors font-medium">Forgot password?</a>
                                </div>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 transition-transform group-focus-within:scale-110 duration-300">
                                        <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                    </span>
                                    <input
                                        type={visible ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-white/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-white/50 transition-all duration-300 shadow-inner"
                                        required
                                    />
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        <button
                                            type="button"
                                            onClick={() => setvisible(!visible)}
                                            className="text-gray-500 hover:text-white focus:outline-none transition-colors"
                                        >
                                            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full relative group overflow-hidden bg-gradient-to-br from-white via-gray-100 to-gray-300 hover:from-white hover:to-gray-200 text-black font-bold py-3.5 px-4 rounded-xl transition-all duration-500 transform hover:-translate-y-[2px] shadow-[0_10px_20px_-10px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_30px_-10px_rgba(255,255,255,0.2)] mt-2"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out block"></div>
                                <span className="relative flex items-center justify-center gap-2">
                                    Sign In <Sparkles className="w-4 h-4 text-black" />
                                </span>
                            </button>
                        </form>
                        <div className="mt-8 pt-8 border-t border-white/10 text-center">
                            <p className="text-gray-400 text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-white hover:text-gray-300 font-semibold transition-colors duration-300">
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
