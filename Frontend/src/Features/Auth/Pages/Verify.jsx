import { Zap, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';

const Verify = () => {
    return (
        <div className="min-h-screen bg-[#030305] text-white flex justify-center items-center p-4 md:p-8 relative overflow-hidden font-sans">
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/10 mix-blend-screen blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/5 mix-blend-screen blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>

            <div className="max-w-md w-full relative z-10 flex flex-col items-center">
                <div className="flex items-center space-x-3 mb-10 animate-[fadeIn_1s_ease-out]">
                    <div className="bg-gradient-to-tr from-white via-gray-100 to-gray-300 w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-sm border border-white/10">
                        <Zap className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-wide">Axion AI</span>
                </div>

                <div className="relative w-full bg-[#0b0c10]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] hover:border-white/20 transition-all duration-500 text-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="mb-0 relative inline-block">
                        <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 mx-auto relative group overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <Mail className="w-10 h-10 text-white animate-[bounce_3s_infinite]" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-4 border-[#0b0c10] animate-[pulse_2s_infinite]">
                            <CheckCircle className="w-3 h-3 text-black" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">Verify Your Email</h2>
                    <p className="text-gray-400 mb-8 text-lg font-light leading-relaxed">
                        We've sent a verification link to your inbox. <span className="text-white font-medium">Please verify your email to continue</span> and unlock the full potential of Axion AI.
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-sm text-gray-500">
                            Didn't receive the email? Check your spam folder or try resending.
                        </div>

                        <Link
                            to="/login"
                            className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-4 px-6 rounded-xl transition-all duration-500 transform hover:-translate-y-1 shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_30px_-10px_rgba(255,255,255,0.3)]"
                        >
                            Return to Sign In <ArrowRight className="w-4 h-4" />
                        </Link>

                    </div>
                </div>

                <p className="mt-10 text-gray-600 text-xs tracking-widest uppercase font-bold">
                    Secure AI Ecosystem &copy; 2026
                </p>
            </div>
        </div>
    );
};

export default Verify;

