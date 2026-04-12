import { useRef, useEffect, useState } from 'react';
import { Menu, FileText, Image as ImageIcon, Share2, Download, Printer, Mail } from 'lucide-react';
import { useSelector } from 'react-redux';
import MarkdownRenderer from './markdown/MarkdownRenderer';

const ChatWindow = ({ chatTitle, messages, tempUserMessage, onToggleSidebar, streamingMessage }) => {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const chats = messages?.messages || [];
    const loading = useSelector((state) => state.chat.loading);
    const isAtBottom = useRef(true);
    const scrollRef = useRef(null);

    const parseEmailDraft = (content) => {
        if (!content || typeof content !== 'string') return null;
        if (!content.includes('**Subject:**')) return null;

        try {
            const emailMatch = content.match(/\*\*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\*\*/);
            const recipient = emailMatch ? emailMatch[1] : '';

            const subjectMatch = content.match(/\*\*Subject:\*\*\s*(.*)/);
            const subject = subjectMatch ? subjectMatch[1].trim() : '';

            let body = '';
            const subjectIndex = content.indexOf('**Subject:**');
            if (subjectIndex !== -1) {
                const lines = content.substring(subjectIndex).split('\n');
                if (lines.length > 1) {
                    body = lines.slice(1).join('\n').trim();
                    body = body.replace(/^---\s*/, '').trim();
                }
            }

            if (subject || recipient) {
                return { recipient, subject, body };
            }
        } catch (e) {
            return null;
        }
        return null;
    };

    const handleSendEmail = (emailData) => {
        const { recipient, subject, body } = emailData;

        // Utility to convert text to mathematical bold characters for "plain text formatting"
        const formatForGmail = (text) => {
            const boldChars = {
                'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
                'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
                '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
            };

            const toBold = (str) => str.split('').map(char => boldChars[char] || char).join('');

            return text
                // Convert Markdown headers (### Heading) to Unicode bold and remove hashes
                .replace(/^#{1,6}\s*(.*)$/gm, (_, p1) => toBold(p1))
                // Convert **bold** to Unicode bold and remove asterisks
                .replace(/\*\*(.*?)\*\*/g, (_, p1) => toBold(p1))
                // Clean up simple bullet points (convert - or * at start of line to •)
                .replace(/^[\s]*[-*]\s+/gm, '• ')
                // Clean up LaTeX markers \( \) and \[ \]
                .replace(/\\\(|\\\)|\\\[|\\\]/g, '')
                // Strip code block markers while preserving the content and indentation
                .replace(/```\w*\n?([\s\S]*?)```/g, (_, p1) => p1.trim())
                // Clean up trailing/leading whitespace from the final result
                .trim();
        };

        const formattedSubject = formatForGmail(subject);
        const formattedBody = formatForGmail(body);

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent(formattedBody)}`;
        window.open(gmailUrl, '_blank');
    };

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
                <div class="markdown-body" data-markdown="${encodeURIComponent(msg.message || msg.content || '')}">
                    Loading content...
                </div>
            </div>
        `).join('');

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chatTitle || 'Chat Export'} - Axion AI</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
    <style>
        :root {
            --bg: #0b0c10;
            --surface: #1f2833;
            --accent: #66fcf1;
            --text-primary: #ffffff;
            --text-secondary: #c5c6c7;
            --ai-bubble: rgba(255, 255, 255, 0.03);
            --user-bubble: rgba(102, 252, 241, 0.05);
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
            max-width: 900px;
            margin: 0 auto;
            padding: 60px 20px;
        }
        header {
            text-align: center;
            margin-bottom: 60px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 30px;
        }
        h1 { font-size: 2.5rem; margin: 0; color: var(--accent); font-weight: 700; letter-spacing: -0.02em; }
        .timestamp { color: var(--text-secondary); font-size: 0.9rem; margin-top: 15px; font-weight: 500; opacity: 0.7; }
        .chat-container { display: flex; flex-direction: column; gap: 32px; }
        .message {
            max-width: 90%;
            padding: 24px 32px;
            border-radius: 24px;
            position: relative;
            transition: all 0.3s ease;
        }
        .user {
            align-self: flex-end;
            background: var(--user-bubble);
            border: 1px solid rgba(102, 252, 241, 0.2);
            border-bottom-right-radius: 4px;
        }
        .ai {
            align-self: flex-start;
            background: var(--ai-bubble);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-bottom-left-radius: 4px;
        }
        .role {
            font-size: 0.7rem;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 15px;
            color: var(--accent);
            letter-spacing: 0.1em;
            opacity: 0.8;
        }
        .markdown-body {
            background-color: transparent !important;
            color: var(--text-primary) !important;
            font-size: 1rem !important;
            font-family: 'Inter', sans-serif !important;
        }
        .markdown-body pre {
            background-color: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 12px !important;
        }
        .markdown-body code {
            background-color: rgba(255, 255, 255, 0.1) !important;
            color: var(--accent) !important;
            padding: 0.2em 0.4em !important;
            border-radius: 6px !important;
        }
        .markdown-body table { border-collapse: collapse !important; width: 100% !important; margin: 1em 0 !important; }
        .markdown-body th, .markdown-body td { border: 1px solid rgba(255, 255, 255, 0.1) !important; padding: 12px !important; }
        .markdown-body th { background-color: rgba(255, 255, 255, 0.05) !important; }
        
        footer {
            margin-top: 100px;
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.8rem;
            opacity: 0.4;
            letter-spacing: 0.05em;
        }
        @media print {
            body { background: #fff; color: #000; }
            .user, .ai { background: #fff; border: 1px solid #ddd; color: #000; }
            .role { color: #666; }
            .markdown-body { color: #000 !important; }
            .markdown-body pre { background: #f6f8fa !important; border: 1px solid #ddd !important; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${chatTitle || 'Chat Export'}</h1>
            <div class="timestamp">Exported from Axion AI on ${new Date().toLocaleDateString()}</div>
        </header>
        <div class="chat-container">
            ${chatContent}
        </div>
        <footer>
            PROCESSED BY AXION AI • ${new Date().getFullYear()}
        </footer>

    </div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.markdown-body').forEach(el => {
                const markdown = decodeURIComponent(el.getAttribute('data-markdown'));
                el.innerHTML = marked.parse(markdown);
            });
        });
    </script>
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
                        <div className={`flex items-start ${msg.role === 'user' ? 'max-w-[85%] lg:max-w-[75%] flex-row-reverse' : 'max-w-[95%] lg:max-w-[90%] flex-row'}`}>
                            <div className={`space-y-2 w-fit max-w-full overflow-hidden flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
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
                                {msg.role === 'ai' && (
                                    (() => {
                                        const emailData = parseEmailDraft(msg.message);
                                        return emailData ? (
                                            <button
                                                onClick={() => handleSendEmail(emailData)}
                                                className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-lg hover:bg-[var(--accent)]/25 transition-all text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider group animate-[fadeIn_0.3s_ease-out] backdrop-blur-md shadow-lg"
                                            >
                                                <Mail size={14} className="group-hover:scale-110 transition-transform" />
                                                <span>Send via Gmail</span>
                                            </button>
                                        ) : null;
                                    })()
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
                        <div className="flex items-start max-w-[85%] lg:max-w-[75%] flex-row-reverse">
                            <div className="px-5 py-3 lg:px-8 lg:py-5 rounded-2xl lg:rounded-3xl bg-[var(--accent)]/10 border border-[var(--border-strong)] text-[var(--text-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-tr-none w-fit max-w-full break-words overflow-hidden">
                                <p className="text-[13px] lg:text-[15px] font-medium">{tempUserMessage}</p>
                            </div>
                        </div>
                    </div>
                )}
                {streamingMessage && (
                    <div className="flex w-full justify-start animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex items-start max-w-[95%] lg:max-w-[90%] flex-row">
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
                        <div className="flex items-start max-w-[95%] lg:max-w-[90%] flex-row">
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
