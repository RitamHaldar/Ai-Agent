import { useState, useRef, useEffect } from 'react';
import { Home, Plus, ArrowRight, User, LogOut, Sparkles, Menu, X, Trash2 } from 'lucide-react';
import ChatWindow from '../Components/Chatwindow';
import useChat from '../Hooks/useChat';
import { useDispatch, useSelector } from 'react-redux';
import { initializeSocket } from '../Services/chat.socket';
import { setcurrentChatId } from '../chat.slice';
import { useAuth } from '../../Auth/Hooks/useAuth';
import { useNavigate } from 'react-router';

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentChatTitle, setCurrentChatTitle] = useState(null);
    const [newChat, setNewChat] = useState(false);
    const [generatingNewChat, setGeneratingNewChat] = useState(false);
    const fileref = useRef(null)
    const [filepresent, setFilepresent] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { handlesendMessage, handleGetChats, handleGetMessages, handleDeleteChat } = useChat();
    const messages = useSelector((state) => state.chat.messages);
    const currentChatId = useSelector((state) => state.chat.currentChatId);
    const user = useSelector((state) => state.auth.user);
    const { handlelogout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        handleGetChats();
        initializeSocket();
    }, []);
    const searchSuggestions = [
        'How to use Docker to containerize a simple Node.js application step by step?',
        'How to build a REST API using Express.js and connect it to a MongoDB database?',
        'How to deploy a Node.js application using Docker and a cloud service for free?',
        'How to set up basic authentication and authorization in a backend using JWT?',
        'How to create and manage multiple Docker containers using Docker Compose?',
    ];
    const [tempUserMessage, setTempUserMessage] = useState(null);
    const dispatch = useDispatch();
    function openChat(chat) {
        dispatch(setcurrentChatId(chat.Id));
        handleGetMessages(chat.Id);
    }
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    async function sendmessage() {
        const message = searchQuery;
        setSearchQuery("");
        if (!currentChatId) {
            setTempUserMessage(message);
        }
        setNewChat(true);
        try {
            const chat = await handlesendMessage({ message, chatId: currentChatId || '', file: fileref.current.files[0] });
            if (fileref?.current?.files) {
                fileref.current.files = null;
            }
            setFilepresent(null);
            dispatch(setcurrentChatId(chat.data.chatId));
            if (chat.data.title) {
                setCurrentChatTitle(chat.data.title);
                setGeneratingNewChat(false);
            }
        } finally {
            setTempUserMessage(null);
        }
    }
    return (
        <div className="flex h-screen bg-[#030305] text-white font-sans overflow-hidden relative">
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/5 mix-blend-screen blur-[120px] animate-[pulse_8s_ease-in-out_infinite] z-0 pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/[0.03] mix-blend-screen blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse] z-0 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-50 z-0 pointer-events-none"></div>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={toggleSidebar}
                ></div>
            )}
            <aside className={`
                fixed lg:relative inset-y-0 left-0 w-64 lg:w-72 bg-[#0b0c10]/80 lg:bg-[#0b0c10]/60 backdrop-blur-2xl flex flex-col justify-between border-r border-white/5 z-50 shadow-[5px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className="p-8 pb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                Axion AI
                            </h1>
                            <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mt-2 font-bold opacity-60">Architectural Insights</p>
                        </div>
                        <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="px-5 mb-8">
                        <button
                            onClick={() => { dispatch(setcurrentChatId(null)); setSearchQuery(''); setCurrentChatTitle(null); setNewChat(false) }}
                            className="w-full relative group overflow-hidden bg-gradient-to-br from-white via-gray-100 to-gray-300 hover:from-white hover:to-gray-200 text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-500 transform hover:-translate-y-[2px] shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)]"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out block"></div>
                            <Plus size={16} strokeWidth={3} className="relative z-10" />
                            <span className="text-[13px] tracking-tight relative z-10">New Chat</span>
                        </button>
                    </div>
                    <nav className="space-y-2 px-4">
                        <button onClick={() => { dispatch(setcurrentChatId(null)); setCurrentChatTitle(null); setNewChat(false) }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${!currentChatId ? 'bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'}`}>
                            <Home size={16} className={`${!currentChatId ? '' : 'group-hover:scale-110'} transition-transform`} />
                            <span className="text-[13px] font-bold tracking-wide">Home</span>
                        </button>
                    </nav>
                    <div className="mt-10 px-8">
                        <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em] mb-5 flex items-center gap-2">
                            RECENT <span className="flex-1 h-[1px] bg-white/5"></span>
                        </h2>
                        <ul className="space-y-4 relative">
                            <div className="absolute left-[-12px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                            {Object.values(messages).length === 0 && !newChat && <div className="text-gray-400 text-[13px] font-semibold tracking-wide">No recent chats</div>}
                            {Object.values(messages).map((chat, idx) => (
                                <li key={idx} className="relative group cursor-pointer flex items-center justify-between" onClick={() => {
                                    openChat(chat);
                                    dispatch(setcurrentChatId(chat.Id));
                                    setCurrentChatTitle(chat.title);
                                }}>
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`
                                            w-[5px] h-[5px] rounded-full transition-all duration-300 shrink-0
                                            ${currentChatId == chat.Id ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]' : 'bg-white/10 group-hover:bg-white/30'}
                                        `}></div>
                                        <span className={`
                                            text-[12px] transition-all duration-300 truncate block font-medium group-hover:translate-x-1 pr-3
                                            ${currentChatId == chat.Id ? 'text-white translate-x-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-gray-500 hover:text-white'}
                                        `}>
                                            {chat.title}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteChat(chat.Id);
                                            dispatch(setcurrentChatId(null));
                                            setSearchQuery('');
                                            setCurrentChatTitle(null);
                                            setNewChat(false)
                                        }}
                                        className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1.5 text-gray-400 hover:text-white lg:text-gray-500 transition-all duration-300"
                                        title="Delete Chat"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </li>

                            ))}
                            {(newChat && generatingNewChat) && <div className="title-skeleton mb-1"></div>}
                        </ul>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex items-center gap-3.5 px-4 py-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/10 backdrop-blur-md shadow-xl transition-colors duration-300 group/profile cursor-pointer">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white via-gray-200 to-gray-400 flex items-center justify-center shrink-0 p-[1px] shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-shadow">
                            <div className="w-full h-full bg-[#0b0c10] rounded-xl flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-white/90 truncate tracking-tight group-hover/profile:text-white transition-colors">{user.user || user.username}</p>
                        </div>
                        <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 shrink-0" title="Logout" onClick={() => {
                            handlelogout();
                            navigate("/login");
                        }}>
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>
            <main className="flex-1 flex flex-col relative z-20 w-full overflow-y-auto lg:overflow-hidden scrollbar-hide">
                {(!currentChatId && !newChat) ? (
                    <>
                        <header className="flex justify-between items-center px-6 lg:px-10 py-5 lg:py-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleSidebar}
                                    className="lg:hidden p-2 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all duration-300 active:scale-90"
                                >
                                    <Menu size={20} className="text-gray-300" />
                                </button>
                                <div className="flex items-center gap-3 bg-white/[0.02] px-4 lg:px-5 py-2 lg:py-2.5 rounded-2xl border border-white/5 backdrop-blur-md shadow-lg">
                                    <Sparkles size={14} className="text-white shadow-[0_0_10px_rgba(255,255,255,0.3)] rounded-full" />
                                    <span className="text-[9px] lg:text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase">
                                        Axion AI
                                    </span>
                                </div>
                            </div>
                        </header>
                        <div className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 md:px-8 max-w-5xl mx-auto w-full relative z-10 pt-32 pb-32 md:py-20 min-h-0">
                            <div className="text-center mb-8 lg:mb-16 w-full animate-[fadeIn_0.8s_ease-out] order-1">
                                <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-light mb-4 lg:mb-8 tracking-tight text-white leading-[1.3] px-2 max-w-4xl mx-auto">
                                    How may I <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 font-semibold italic"> assist </span> you <br className="hidden sm:block" /> today?
                                </h1>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 w-full max-w-5xl px-4 z-10 relative py-2 order-2 md:order-3 mb-8 md:mb-0">
                                {searchSuggestions.slice(0, 3).map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => { setSearchQuery(suggestion) }}
                                        className="group/card text-left p-3 sm:p-5 lg:p-6 bg-white/[0.02] border border-white/5 hover:border-white/40 rounded-3xl transition-all duration-500 backdrop-blur-xl relative overflow-hidden active:scale-[0.98] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.1)] hover:-translate-y-1"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover/card:opacity-100 transition-opacity transform group-hover/card:translate-x-0 -translate-x-2 duration-300">
                                            <ArrowRight size={16} className="text-white" />
                                        </div>
                                        <p className="text-[11px] sm:text-[12px] lg:text-[13px] text-gray-400 group-hover/card:text-white leading-relaxed font-semibold transition-colors line-clamp-2">
                                            {suggestion}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <ChatWindow chatTitle={currentChatTitle} messages={messages[currentChatId]} tempUserMessage={tempUserMessage} onToggleSidebar={toggleSidebar} />
                )}
                <div className="fixed bottom-0 left-0 w-full p-4 lg:relative lg:p-0 bg-gradient-to-t from-[#030305] via-[#030305]/95 to-transparent lg:bg-none z-40 lg:z-20 lg:mb-4 lg:max-w-2xl lg:mx-auto group/container order-3 md:order-2">
                    <div className="absolute inset-[-20px] bg-gradient-to-r from-gray-400/20 via-gray-500/10 to-gray-400/20 blur-[40px] lg:blur-[50px] opacity-0 group-focus-within/container:opacity-100 transition-opacity duration-700 pointer-events-none rounded-full hidden lg:block"></div>
                    <div className="relative w-full max-w-2xl mx-auto rounded-3xl border border-white/10 group-focus-within/container:border-white/50 transition-all duration-500 bg-transparent backdrop-blur-2xl p-2 px-3 lg:px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-focus-within/container:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(255,255,255,0.1)] hover:border-white/20">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="flex items-center gap-2 lg:gap-3 px-2 lg:px-3 border-r border-white/10 w-fit py-2">
                                <label className="cursor-pointer text-gray-400 hover:text-white transition-all transform hover:scale-110 active:scale-90 block shrink-0" title="Attach file">
                                    <Plus size={18} lg:size={20} strokeWidth={2.5} />
                                    <input type="file" className="hidden" ref={fileref} onChange={() => { setFilepresent(fileref.current?.files[0]?.name) }} />
                                </label>
                                {(fileref.current?.files[0] && filepresent) && (
                                    <div className="flex items-center gap-1.5 lg:gap-2 overflow-hidden bg-white/[0.05] px-2.5 lg:px-3 py-1 rounded-xl border border-white/10 backdrop-blur-md">
                                        <span className="text-[10px] lg:text-[11px] text-white font-semibold truncate max-w-[60px] lg:max-w-[100px]" title={fileref.current.files[0].name}>
                                            {fileref.current.files[0].name}
                                        </span>
                                        <button
                                            onClick={() => {
                                                fileref.current.value = null
                                                setFilepresent(null)
                                            }}
                                            className="text-gray-400 hover:text-red-400 transition-colors shrink-0 outline-none"
                                        >
                                            <Plus size={12} lg:size={14} className="rotate-45 cursor-pointer" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <textarea
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Ask Axion AI anything..."
                                rows={1}
                                className="flex-1 px-1 lg:px-2 py-3 bg-transparent border-none text-[14px] lg:text-[15px] text-white placeholder-gray-500 focus:ring-0 focus:outline-none font-medium resize-none [field-sizing:content] min-w-0 text-wrap max-h-[120px] lg:max-h-[180px] selection:bg-white/30"
                            />
                            <button
                                onClick={() => {
                                    sendmessage();
                                    setGeneratingNewChat(true)

                                }}
                                className="bg-gradient-to-br from-white via-gray-100 to-gray-300 hover:from-white hover:to-gray-200 text-black w-9 h-9 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-[1.05] active:scale-95 shadow-[0_5px_15px_rgba(255,255,255,0.1)] group/btn relative overflow-hidden shrink-0"
                            >
                                <div className="absolute inset-0 bg-white/40 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 block"></div>
                                <ArrowRight size={18} strokeWidth={3} className="relative z-10 text-black" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default Dashboard;
