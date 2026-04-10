import { useRef, useEffect, useState } from 'react';
import { Menu, FileText, Image as ImageIcon, Share2, Download, Printer } from 'lucide-react';
import { useSelector } from 'react-redux';
import MarkdownRenderer from './markdown/MarkdownRenderer';

const ChatWindow = ({ chatTitle, messages, tempUserMessage, onToggleSidebar, streamingMessage }) => {
    const [showShareMenu, setShowShareMenu] = useState(false);
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

    const generateChatHTML = () => {
        const chatContent = chats.map(msg => `
            <div class="message ${msg.role}">
                <div class="role">${msg.role === 'user' ? 'You' : 'AI'}</div>
                <div class="content">${(msg.message || msg.content || '').replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            </div>
        `).join('');

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chatTitle || 'Chat Export'} - AI Chat</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0b0c10;
            --surface: #1f2833;
            --accent: #66fcf1;
            --text-primary: #ffffff;
            --text-secondary: #c5c6c7;
            --ai-bubble: rgba(255, 255, 255, 0.03);
            --user-bubble: rgba(255, 255, 255, 0.1);
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background-color: var(--bg);
            color: var(--text-primary);
            line-height: 1.6;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        header {
            text-align: center;
            margin-bottom: 60px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 20px;
        }
        h1 { font-size: 2rem; margin: 0; color: var(--accent); }
        .timestamp { color: var(--text-secondary); font-size: 0.9rem; margin-top: 10px; }
        .chat-container { display: flex; flex-direction: column; gap: 24px; }
        .message {
            max-width: 85%;
            padding: 16px 24px;
            border-radius: 20px;
            position: relative;
        }
        .user {
            align-self: flex-end;
            background: var(--user-bubble);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-bottom-right-radius: 4px;
        }
        .ai {
            align-self: flex-start;
            background: var(--ai-bubble);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-bottom-left-radius: 4px;
        }
        .role {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 8px;
            color: var(--accent);
            letter-spacing: 0.05em;
        }
        .content { font-size: 1rem; white-space: pre-wrap; word-wrap: break-word; }
        footer {
            margin-top: 80px;
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.8rem;
            opacity: 0.5;
        }
        @media print {
            body { background: #fff; color: #000; }
            .user { background: #f0f0f0; border: 1px solid #ccc; color: #000; }
            .ai { background: #fff; border: 1px solid #eee; color: #000; }
            .role { color: #333; }
            header { border-bottom: 1px solid #eee; }
            h1 { color: #000; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${chatTitle || 'Chat Export'}</h1>
            <div class="timestamp">Exported on ${new Date().toLocaleDateString()}</div>
        </header>
        <div class="chat-container">
            ${chatContent}
        </div>
        <footer>
            Exported from AI Agent
        </footer>
    </div>
</body>
</html>`;
    };

    const exportToHTML = () => {
        const html = generateChatHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${chatTitle?.replace(/\s+/g, '_') || 'chat'}_export.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setShowShareMenu(false);
    };

    const exportToPDF = () => {
        const html = generateChatHTML();
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        iframe.contentWindow.focus();
        setTimeout(() => {
            iframe.contentWindow.print();
            document.body.removeChild(iframe);
        }, 500);
        setShowShareMenu(false);
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[var(--accent)]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <header className="flex items-center justify-between px-6 py-2.5 lg:py-3 bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--border-subtle)] relative z-20 shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={onToggleSidebar} className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400">
                        <Menu size={20} />
                    </button>
                    <div>
                        {chatTitle ? (
                            <h2 className="text-sm lg:text-base font-bold text-[var(--text-primary)] tracking-tight animate-[fadeIn_0.5s_ease-out]">
                                {chatTitle}
                            </h2>
                        ) : (
                            <div className="title-skeleton mb-1"></div>
                        )}
                    </div>
                </div>
                {chats.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className={`flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full cursor-pointer transition-all border ${showShareMenu ? 'bg-[var(--accent)]/15 border-[var(--accent)]/20 text-[var(--accent)]' : 'bg-[var(--accent)]/5 border-[var(--border-subtle)] text-[var(--text-secondary)]'}`}
                            title="Share Chat"
                        >
                            <Share2 size={16} />
                            <span className="text-xs font-semibold hidden sm:inline">Share</span>
                        </button>
                        
                        {showShareMenu && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setShowShareMenu(false)}></div>
                                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-sidebar)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl py-2 z-40 animate-[fadeIn_0.2s_ease-out] backdrop-blur-2xl">
                                    <button
                                        onClick={exportToHTML}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent)]/5 hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        <Download size={16} className="text-blue-400" />
                                        <span>Export as HTML</span>
                                    </button>
                                    <button
                                        onClick={exportToPDF}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent)]/5 hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        <Printer size={16} className="text-purple-400" />
                                        <span>Export as PDF</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
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
                            <div className="space-y-2 w-fit max-w-full overflow-hidden flex flex-col items-end">
                                {msg.role === 'user' && msg.hasFile && (
                                    <div className="flex items-center gap-2 mb-1 px-2 py-1 bg-white/[0.05] border border-white/10 rounded-lg backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
                                        {msg.hasFile === 'pdf' ? (
                                            <>
                                                <FileText size={16} className="text-blue-400" />
                                                <span className="text-[11px] font-bold text-blue-400/80 uppercase tracking-wider">PDF</span>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon size={16} className="text-purple-400" />
                                                <span className="text-[11px] font-bold text-purple-400/80 uppercase tracking-wider">Image</span>
                                            </>
                                        )}
                                    </div>
                                )}
                                <div className={`
                                        px-5 py-3 lg:px-8 lg:py-5 rounded-2xl lg:rounded-3xl relative w-fit max-w-full overflow-hidden
                                        ${msg.role === 'user'
                                        ? 'bg-[var(--accent)]/10 border border-[var(--border-strong)] text-[var(--text-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-tr-none'
                                        : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] backdrop-blur-md rounded-tl-none hover:bg-[var(--accent)]/[0.05] transition-colors'}
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
                            <div className="px-5 py-3 lg:px-8 lg:py-5 rounded-2xl lg:rounded-3xl bg-[var(--accent)]/10 border border-[var(--border-strong)] text-[var(--text-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-tr-none w-fit max-w-full break-words overflow-hidden">
                                <p className="text-[13px] lg:text-[15px] font-medium">{tempUserMessage}</p>
                            </div>
                        </div>
                    </div>
                )}
                {streamingMessage && (
                    <div className="flex w-full justify-start animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex items-start max-w-[85%] lg:max-w-[72%] flex-row">
                            <div className="space-y-4 pt-1">
                                <div className="px-5 py-3 lg:px-8 lg:py-5 rounded-2xl lg:rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] backdrop-blur-md rounded-tl-none hover:bg-[var(--accent)]/[0.05] transition-colors w-fit max-w-full overflow-hidden">
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
                                    <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider opacity-90">Thinking</span>
                                    <div className="flex gap-1.5 items-center">
                                        <div className="w-1 h-1 rounded-full bg-[var(--accent)] thinking-dot"></div>
                                        <div className="w-1 h-1 rounded-full bg-[var(--accent)] thinking-dot"></div>
                                        <div className="w-1 h-1 rounded-full bg-[var(--accent)] thinking-dot"></div>
                                    </div>
                                </div>
                                <div className="p-5 lg:p-8 rounded-2xl lg:rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] backdrop-blur-md rounded-tl-none w-fit max-w-full min-w-[200px] lg:min-w-[400px] space-y-4 relative overflow-hidden shimmer-effect">
                                    <div className="space-y-4 w-full">
                                        <div className="h-2.5 bg-[var(--accent)]/10 rounded-full w-[85%]"></div>
                                        <div className="h-2.5 bg-[var(--accent)]/10 rounded-full w-[95%]"></div>
                                        <div className="h-2.5 bg-[var(--accent)]/10 rounded-full w-[60%]"></div>
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
