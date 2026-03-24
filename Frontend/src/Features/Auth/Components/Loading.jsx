import React from 'react'

const Loading = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030305] backdrop-blur-sm">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative flex flex-col items-center gap-6">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-2 border-2 border-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 border-t-2 border-r-2 border-white rounded-full animate-spin shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
                    <div className="absolute inset-[35%] bg-white/20 rounded-full blur-md animate-pulse"></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-white text-sm font-semibold tracking-[0.2em] uppercase opacity-90 animate-pulse">
                        Authenticating
                    </span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-white/40 rounded-full animate-[bounce_1.4s_infinite_0ms]"></div>
                        <div className="w-1 h-1 bg-white/40 rounded-full animate-[bounce_1.4s_infinite_200ms]"></div>
                        <div className="w-1 h-1 bg-white/40 rounded-full animate-[bounce_1.4s_infinite_400ms]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loading;
