import React, { useState } from 'react';
import {
    Home,
    Plus,
    ArrowRight,
    Bell,
    User,
    LogOut,
    Globe,
    History
} from 'lucide-react';

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [attachedFile, setAttachedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAttachedFile(file);
        }
    };

    const searchSuggestions = [
        'How to use Docker to containerize a simple Node.js application step by step?',
        'How to build a REST API using Express.js and connect it to a MongoDB database?',
        'How to deploy a Node.js application using Docker and a cloud service for free?',
        'How to set up basic authentication and authorization in a backend using JWT?',
        'How to create and manage multiple Docker containers using Docker Compose?',
    ];

    return (
        <div className="flex h-screen bg-[#12141D] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0E0F15] flex flex-col justify-between border-r border-[#1E2028]">
                <div>
                    {/* Header */}
                    <div className="p-8 pb-4">
                        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#25B9CB] shadow-[0_0_10px_#25B9CB]"></div>
                            Digital Obsidian
                        </h1>
                        <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mt-2 font-bold opacity-60">Architectural Intelligence</p>
                    </div>

                    {/* New Chat Button */}
                    <div className="px-5 mb-8">
                        <button className="w-full bg-[#25B9CB] hover:bg-[#25B9CB]/90 text-black font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(37,185,203,0.2)] hover:shadow-[0_0_30px_rgba(37,185,203,0.4)]">
                            <Plus size={16} strokeWidth={3} />
                            <span className="text-[13px] tracking-tight">New Chat</span>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1 px-4">
                        <a href="#" className="flex items-center gap-3 px-4 py-2.5 bg-[#25B9CB]/10 text-[#25B9CB] rounded-xl border border-[#25B9CB]/20 shadow-[0_0_15px_rgba(37,185,203,0.05)] transition-all group">
                            <Home size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[13px] font-bold tracking-tight">Home</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-[#181A25] rounded-xl transition-all duration-200 group">
                            <History size={16} className="group-hover:rotate-[-10deg] transition-transform" />
                            <span className="text-[13px] font-semibold tracking-tight">History</span>
                        </a>
                    </nav>

                    {/* Recent */}
                    <div className="mt-10 px-8">
                        <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em] mb-5 flex items-center gap-2">
                             RECENT <span className="w-8 h-[1px] bg-gray-600/30"></span>
                        </h2>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-[12px] text-gray-500 hover:text-[#25B9CB] transition-all duration-300 truncate block font-semibold hover:translate-x-1">UI Trends 2026</a></li>
                            <li><a href="#" className="text-[12px] text-gray-500 hover:text-[#25B9CB] transition-all duration-300 truncate block font-semibold hover:translate-x-1">Quantum Computing Intro</a></li>
                            <li><a href="#" className="text-[12px] text-gray-500 hover:text-[#25B9CB] transition-all duration-300 truncate block font-semibold hover:translate-x-1">Recipe: Vegan Lasagna</a></li>
                        </ul>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="p-5">
                    <div className="flex items-center gap-3.5 px-4 py-4 bg-[#181A25]/50 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#25B9CB] to-[#12141D] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,185,203,0.15)] p-[1px]">
                            <div className="w-full h-full bg-[#0E0F15] rounded-xl flex items-center justify-center">
                                <User size={16} className="text-[#25B9CB]" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-white/90 truncate tracking-tight">Alex Rivera</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1 h-1 rounded-full bg-[#25B9CB]"></div>
                                <p className="text-[8px] text-[#25B9CB] font-black truncate uppercase tracking-widest opacity-80">PRO PLAN</p>
                            </div>
                        </div>
                        <button className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300" title="Logout">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[#12141D]">
                {/* Background Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#25B9CB]/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#25B9CB]/5 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Header */}
                <header className="flex justify-between items-center px-10 py-6 relative z-10">
                    <div className="text-[10px] font-black tracking-[0.4em] text-gray-500 hover:text-[#25B9CB] transition-all cursor-default uppercase flex items-center gap-3">
                        <Globe size={14} className="text-[#25B9CB]/40" />
                        OBSIDIAN AI <span className="text-[#25B9CB] drop-shadow-[0_0_8px_rgba(37,185,203,0.5)]">V4.2</span>
                    </div>
                    <div className="flex items-center space-x-6 text-gray-500">
                        <button className="hover:text-white transition-all relative group">
                            <Bell size={18} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-[#25B9CB] rounded-full border-2 border-[#12141D] shadow-[0_0_8px_#25B9CB]"></span>
                        </button>
                        <div className="h-4 w-[1px] bg-white/5"></div>
                        <button className="hover:text-white transition-all transform hover:scale-110"><User size={20} /></button>
                    </div>
                </header>

                {/* Hero & Search Selection */}
                <div className="flex-1 flex flex-col items-center justify-center px-8 max-w-5xl mx-auto w-full relative z-10 py-12">
                    {/* Centered Hero Text - Light and Premium */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25B9CB]/5 border border-[#25B9CB]/10 text-[10px] text-[#25B9CB] font-bold tracking-widest uppercase mb-6 animate-fade-in">
                            <Plus size={10} strokeWidth={4} /> Neural Interface Ready
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extralight mb-6 tracking-tight text-white leading-tight">
                            How can I <span className="text-[#25B9CB] font-medium italic drop-shadow-[0_0_20px_rgba(37,185,203,0.3)]">augment</span> your <br/> intelligence today?
                        </h1>
                        <p className="text-[16px] text-gray-500 max-w-lg mx-auto font-medium leading-relaxed opacity-70">
                            The ultimate digital workspace for deep technical research, architectural design, and creative code engineering.
                        </p>
                    </div>

                    {/* Search Bar Container - Modern Glassmorphism */}
                    <div className="w-full max-w-2xl px-6 mb-12 group/container">
                        <div className="w-full relative">
                            {/* Backdrop Blur & Multi-layered Shadow */}
                            <div className="absolute inset-0 bg-[#25B9CB]/5 blur-2xl opacity-0 group-focus-within/container:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="relative w-full rounded-[1.8rem] border border-white/5 group-focus-within/container:border-[#25B9CB]/40 transition-all duration-500 bg-[#181A25]/80 backdrop-blur-xl p-1.5 px-3.5 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.02)] group-focus-within/container:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_20px_rgba(37,185,203,0.1)]">
                                {/* Top row: Plus, Input, submit */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-3 px-3 border-r border-white/5 w-fit py-1">
                                        <label className="cursor-pointer text-gray-400 hover:text-[#25B9CB] transition-all transform hover:scale-110 active:scale-90 block shrink-0" title="Attach file">
                                            <Plus size={18} strokeWidth={2.5} />
                                            <input type="file" className="hidden" onChange={handleFileChange} />
                                        </label>
                                        {attachedFile && (
                                            <div className="flex items-center gap-2 overflow-hidden bg-[#25B9CB]/10 px-2 py-0.5 rounded-lg border border-[#25B9CB]/20 animate-in fade-in slide-in-from-left-2 transition-all">
                                                <span className="text-[10px] text-[#25B9CB] font-bold truncate max-w-[80px]" title={attachedFile.name}>
                                                    {attachedFile.name}
                                                </span>
                                                <button
                                                    onClick={() => setAttachedFile(null)}
                                                    className="text-[#25B9CB] hover:text-red-400 transition-colors shrink-0"
                                                >
                                                    <Plus size={12} className="rotate-45 cursor-pointer" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <textarea
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Ask Obsidian anything..."
                                        rows={1}
                                        className="flex-1 px-2 py-3 bg-transparent border-none text-[15px] text-white placeholder-gray-500 focus:ring-0 focus:outline-none font-medium resize-none [field-sizing:content] min-w-[300px] text-wrap max-h-[180px] selection:bg-[#25B9CB]/30"
                                    />
                                    <button className="bg-[#25B9CB] hover:bg-[#25B9CB]/90 text-black w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-[1.05] active:scale-95 shadow-[0_5px_15px_rgba(37,185,203,0.3)] group/btn relative overflow-hidden shrink-0">
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                        <ArrowRight size={18} strokeWidth={3} className="relative z-10" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Premium Suggestion Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl px-4">
                        {searchSuggestions.slice(0, 3).map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => setSearchQuery(suggestion)}
                                className="group/card text-left p-5 bg-[#181A25]/40 hover:bg-[#25B9CB]/5 border border-white/5 hover:border-[#25B9CB]/30 rounded-2xl transition-all duration-300 backdrop-blur-sm relative overflow-hidden active:scale-[0.98]"
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                    <ArrowRight size={14} className="text-[#25B9CB]" />
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-[#25B9CB]/10 flex items-center justify-center mb-4 group-hover/card:bg-[#25B9CB]/20 transition-colors">
                                    <Plus size={14} className="text-[#25B9CB]" />
                                </div>
                                <p className="text-[13px] text-gray-400 group-hover/card:text-white leading-relaxed font-semibold transition-colors line-clamp-2">
                                    {suggestion}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-10 left-0 right-0 flex justify-center text-[10px] font-black tracking-[0.3em] text-gray-500 pointer-events-none z-10">
                    <div className="flex items-center gap-8 bg-[#0E0F15]/60 backdrop-blur-xl px-10 py-3 rounded-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#25B9CB] animate-pulse shadow-[0_0_12px_#25B9CB]"></div>
                            <span className="opacity-80">SYSTEM STATUS: OPTIMAL</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/10"></div>
                        <div className="opacity-40 text-[8px] tracking-widest font-black uppercase">ENIGMA CORE V4.2.1-S</div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
