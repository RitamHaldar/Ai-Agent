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
                            className="bg-white/10 px-1.5 py-0.5 rounded-md text-[13px] font-mono text-pink-400 border border-white/5"
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                // Custom styling for other markdown elements to match the premium theme
                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="pl-1">{children}</li>,
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-white">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5 text-white/90">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4 text-white/80">{children}</h3>,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-white/20 pl-4 py-1 my-4 italic bg-white/5 rounded-r-lg">
                        {children}
                    </blockquote>
                ),
                table: ({ children }) => (
                    <div className="overflow-x-auto my-6 rounded-xl border border-white/10">
                        <table className="w-full text-sm text-left">
                            {children}
                        </table>
                    </div>
                ),
                thead: ({ children }) => <thead className="bg-white/5 text-gray-300 uppercase text-[10px] tracking-wider">{children}</thead>,
                th: ({ children }) => <th className="px-4 py-3 font-semibold">{children}</th>,
                td: ({ children }) => <td className="px-4 py-3 border-t border-white/5">{children}</td>,
                hr: () => <hr className="my-8 border-t border-white/10" />,
                a: ({ href, children }) => (
                    <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 underline-offset-4 transition-colors"
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
