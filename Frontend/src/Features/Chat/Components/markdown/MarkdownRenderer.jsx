import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import CodeBlock from './CodeBlock';
import 'katex/dist/katex.min.css';

const MarkdownRenderer = ({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                strong: ({ children }) => <strong className="font-bold text-[var(--accent)]">{children}</strong>,
                em: ({ children }) => <em className="italic text-[var(--text-primary)] opacity-90">{children}</em>,
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    const value = String(children).replace(/\n$/, '');

                    if (!inline && match) {
                        return (
                            <CodeBlock
                                language={language}
                                value={value}
                            />
                        );
                    }

                    return (
                        <code
                            className="bg-[var(--bg-surface)] px-1.5 py-0.5 rounded-md text-[13px] font-mono text-[var(--accent)] border border-[var(--border-subtle)] font-semibold"
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                // Custom styling for other markdown elements to match the premium theme
                p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed font-medium">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="pl-2 leading-relaxed">{children}</li>,
                h1: ({ children }) => <h1 className="text-2xl font-extrabold mb-6 mt-8 text-[var(--accent)] tracking-tight">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mb-4 mt-6 text-[var(--text-primary)] tracking-tight opacity-95">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mb-3 mt-5 text-[var(--text-primary)] opacity-90">{children}</h3>,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[var(--accent)]/30 pl-6 py-2 my-6 italic bg-[var(--bg-surface)] rounded-r-2xl font-medium text-[var(--text-secondary)]">
                        {children}
                    </blockquote>
                ),
                table: ({ children }) => (
                    <div className="overflow-x-auto my-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-inner">
                        <table className="w-full text-sm text-left border-collapse">
                            {children}
                        </table>
                    </div>
                ),
                thead: ({ children }) => <thead className="bg-[var(--bg-card)] text-[var(--text-secondary)] uppercase text-[10px] font-black tracking-[0.2em] border-b border-[var(--border-strong)]">{children}</thead>,
                th: ({ children }) => <th className="px-6 py-4 font-bold">{children}</th>,
                td: ({ children }) => <td className="px-6 py-4 border-t border-[var(--border-subtle)] text-[var(--text-secondary)]">{children}</td>,
                hr: () => <hr className="my-10 border-t border-[var(--border-strong)] opacity-30" />,
                a: ({ href, children }) => (
                    <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[var(--accent)] hover:underline decoration-[var(--accent)]/30 underline-offset-4 transition-all hover:opacity-80"
                    >
                        {children}
                    </a>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
