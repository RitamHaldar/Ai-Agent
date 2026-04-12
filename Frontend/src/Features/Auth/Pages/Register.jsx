import { useState, useEffect } from 'react';
import { Zap, Mail, Lock, User, Eye, EyeOff, Sparkles, Shield, Cpu } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../Hooks/useAuth';
import { useSelector } from 'react-redux';
const Register = () => {
    const [username, setusername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setvisible] = useState(false);
    const error = useSelector(state => state.auth.err);
    const { handleregister } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await handleregister({ username, email, password });
        if (res) {
            setusername('');
            setEmail('');
            setPassword('');
            navigate('/verify');
        }
    };
    const user = useSelector(state => state.auth.user);
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);
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
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white tracking-tight">Create Account</h2>
                        <p className="text-gray-400 mb-8 text-sm font-medium">Start building your AI workforce today.</p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-xs font-semibold animate-pulse">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 transition-transform group-focus-within:scale-110 duration-300">
                                        <User className="w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                    </span>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={username}
                                        onChange={(e) => setusername(e.target.value)}
                                        placeholder="username"
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-white/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-white/50 transition-all duration-300 shadow-inner"
                                        required
                                    />
                                </div>
                            </div>
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
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Password</label>
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
                                className="w-full relative group overflow-hidden bg-gradient-to-br from-white via-gray-100 to-gray-300 hover:from-white hover:to-gray-200 text-black font-bold py-3.5 px-4 rounded-xl transition-all duration-500 transform hover:-translate-y-[2px] active:scale-[0.98] shadow-[0_10px_20px_-10px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_30px_-10px_rgba(255,255,255,0.2)] mt-4"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                                <span className="relative flex items-center justify-center gap-2">
                                    Create Account <Sparkles className="w-4 h-4 text-black" />
                                </span>
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                                <span className="bg-[#0b0c10] px-4 text-gray-500 font-bold">Or continue with</span>
                            </div>
                        </div>

                        <a
                            href="/api/auth/google"
                            className="w-full flex items-center justify-center gap-3 bg-white/[0.03] border border-white/10 hover:border-white/30 hover:bg-white/[0.08] text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-[2px] active:scale-[0.98] group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                />
                            </svg>
                            <span className="text-sm tracking-wide">Continue with Google</span>
                        </a>
                        <div className="mt-8 pt-8 border-t border-white/10 text-center">
                            <p className="text-gray-400 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-white hover:text-gray-300 font-semibold transition-colors duration-300">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Register;