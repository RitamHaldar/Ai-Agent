import { useRef, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import MarkdownRenderer from './markdown/MarkdownRenderer';

const ChatWindow = ({ chatTitle, messages, tempUserMessage, onToggleSidebar, streamingMessage }) => {
    const chats = messages?.messages || [];
    const loading = useSelector((state) => state.chat.loading);
    const scrollRef = useRef(null);
    const isAtBottom = useRef(true);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            isAtBottom.current = Math.abs(scrollHeight - clientHeight - scrollTop) < 150;
        }
    };

    const scrollToBottom = (behavior = 'smooth') => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior
            });
        }
    };

    useEffect(() => {
        scrollToBottom('smooth');
        isAtBottom.current = true;
    }, [chats.length, tempUserMessage, loading]);
    useEffect(() => {
        if (streamingMessage && isAtBottom.current) {
            scrollToBottom('auto');
        }
    }, [streamingMessage]);

    return (
        <div className="flex flex-col h-full w-full bg-transparent relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <header className="flex items-center justify-between px-6 py-2.5 lg:py-3 bg-[#0b0c10]/40 backdrop-blur-xl border-b border-white/5 relative z-20 shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={onToggleSidebar} className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400">
                        <Menu size={20} />
                    </button>
                    <div>
                        {chatTitle ? (
                            <h2 className="text-sm lg:text-base font-bold text-white tracking-tight animate-[fadeIn_0.5s_ease-out]">
                                {chatTitle}
                            </h2>
                        ) : (
                            <div className="title-skeleton mb-1"></div>
                        )}
                    </div>
                </div>
            </header>
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8 scrollbar-hide relative z-10"
            >
                {chats.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.5s_ease-out]`}
                    >
                        <div className={`flex items-start ${msg.role === 'user' ? 'max-w-[70%] lg:max-w-[60%] flex-row-reverse' : 'max-w-[85%] lg:max-w-[72%] flex-row'}`}>
                            <div className="space-y-2 w-fit max-w-full overflow-hidden">
                                <div className={`
                                        px-5 py-3 lg:px-8 lg:py-5 rounded-2xl lg:rounded-3xl relative w-fit max-w-full overflow-hidden
                                        ${msg.role === 'user'
                                        ? 'bg-white/10 border border-white/20 text-white shadow-[0_10px_30px_rgba(255,255,255,0.05)] rounded-tr-none'
                                        : 'bg-white/[0.03] border border-white/10 text-gray-100 backdrop-blur-md rounded-tl-none hover:bg-white/[0.05] transition-colors'}
                                    `}>
                                    <div className="text-[13px] lg:text-[15px] leading-relaxed font-medium markdown-content w-fit max-w-full overflow-hidden">
                                        <MarkdownRenderer content={msg.message} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {tempUserMessage && (
                    <div className="flex w-full justify-end animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex items-start max-w-[70%] lg:max-w-[60%] flex-row-reverse">
                            <div className="px-5 py-3 lg:px-8 lg:py-5 rounded-2xl lg:rounded-3xl bg-white/10 border border-white/20 text-white shadow-[0_10px_30px_rgba(255,255,255,0.05)] rounded-tr-none w-fit max-w-full break-words overflow-hidden">
                                <p className="text-[13px] lg:text-[15px] font-medium">{tempUserMessage}</p>
                            </div>
                        </div>
                    </div>
                )}
                {streamingMessage && (
                    <div className="flex w-full justify-start animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex items-start max-w-[85%] lg:max-w-[72%] flex-row">
                            <div className="space-y-4 pt-1">
                                <div className="px-5 py-3 lg:px-8 lg:py-5 rounded-2xl lg:rounded-3xl bg-white/[0.03] border border-white/10 text-gray-100 backdrop-blur-md rounded-tl-none hover:bg-white/[0.05] transition-colors w-fit max-w-full overflow-hidden">
                                    <div className="text-[13px] lg:text-[15px] leading-relaxed font-medium markdown-content w-fit max-w-full overflow-hidden">
                                        <MarkdownRenderer content={streamingMessage} />
                                        <span className="typing-cursor"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}



                {(loading && !streamingMessage) && (
                    <div className="flex w-full justify-start animate-[fadeIn_0.5s_ease-out]">
                        <div className="flex items-start max-w-[85%] lg:max-w-[72%] flex-row">
                            <div className="space-y-4 pt-1 overflow-hidden">
                                <div className="flex items-center gap-2 px-1">
                                    <span className="text-[11px] font-bold text-white uppercase tracking-wider opacity-90">Thinking</span>
                                    <div className="flex gap-1.5 items-center">
                                        <div className="w-1 h-1 rounded-full bg-white thinking-dot"></div>
                                        <div className="w-1 h-1 rounded-full bg-white thinking-dot"></div>
                                        <div className="w-1 h-1 rounded-full bg-white thinking-dot"></div>
                                    </div>
                                </div>
                                <div className="p-5 lg:p-8 rounded-2xl lg:rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-tl-none w-fit max-w-full min-w-[200px] lg:min-w-[400px] space-y-4 relative overflow-hidden shimmer-effect">
                                    <div className="space-y-4 w-full">
                                        <div className="h-2.5 bg-white/10 rounded-full w-[85%]"></div>
                                        <div className="h-2.5 bg-white/10 rounded-full w-[95%]"></div>
                                        <div className="h-2.5 bg-white/10 rounded-full w-[60%]"></div>
                                    </div>
                                    <div className="pt-2 space-y-4 w-full">
                                        <div className="h-2.5 bg-white/5 rounded-full w-[45%]"></div>
                                        <div className="h-2.5 bg-white/5 rounded-full w-[80%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div>
            <div className="h-32 lg:h-4 lg:block shrink-0"></div>
        </div>
    );
};

export default ChatWindow;
