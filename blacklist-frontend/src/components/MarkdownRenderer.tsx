import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '16px',
              marginTop: '24px',
              borderBottom: '2px solid rgba(147, 197, 253, 0.3)',
              paddingBottom: '8px',
            }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '12px',
              marginTop: '20px',
            }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#93c5fd',
              marginBottom: '8px',
              marginTop: '16px',
            }}>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#93c5fd',
              marginBottom: '6px',
              marginTop: '12px',
            }}>
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#bfdbfe',
              marginBottom: '4px',
              marginTop: '8px',
            }}>
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#bfdbfe',
              marginBottom: '4px',
              marginTop: '8px',
            }}>
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p style={{
              color: '#bfdbfe',
              lineHeight: '1.6',
              marginBottom: '12px',
            }}>
              {children}
            </p>
          ),
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid rgba(147, 197, 253, 0.3)',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
              }}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            }}>
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody>
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr style={{
              borderBottom: '1px solid rgba(147, 197, 253, 0.2)',
            }}>
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th style={{
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '600',
              color: 'white',
              fontSize: '14px',
              border: '1px solid rgba(147, 197, 253, 0.3)',
            }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td style={{
              padding: '10px 16px',
              color: '#bfdbfe',
              fontSize: '14px',
              border: '1px solid rgba(147, 197, 253, 0.2)',
            }}>
              {children}
            </td>
          ),
          ul: ({ children }) => (
            <ul style={{
              color: '#bfdbfe',
              paddingLeft: '20px',
              marginBottom: '12px',
              listStyleType: 'disc',
            }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{
              color: '#bfdbfe',
              paddingLeft: '20px',
              marginBottom: '12px',
              listStyleType: 'decimal',
            }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{
              marginBottom: '4px',
              lineHeight: '1.5',
            }}>
              {children}
            </li>
          ),
          code: ({ inline, children }) => (
            inline ? (
              <code style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                color: '#4ade80',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '13px',
                fontFamily: "'Courier New', monospace",
              }}>
                {children}
              </code>
            ) : (
              <code style={{
                display: 'block',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                color: '#4ade80',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontFamily: "'Courier New', monospace",
                border: '1px solid rgba(147, 197, 253, 0.2)',
                marginBottom: '12px',
                overflowX: 'auto',
                whiteSpace: 'pre',
              }}>
                {children}
              </code>
            )
          ),
          pre: ({ children }) => (
            <pre style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(147, 197, 253, 0.2)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '12px',
              overflowX: 'auto',
              fontSize: '13px',
              fontFamily: "'Courier New', monospace",
            }}>
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: '4px solid #3b82f6',
              paddingLeft: '16px',
              marginLeft: '0',
              marginBottom: '12px',
              color: '#93c5fd',
              fontStyle: 'italic',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              padding: '12px 16px',
              borderRadius: '0 8px 8px 0',
            }}>
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              style={{
                color: '#3b82f6',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(59, 130, 246, 0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#60a5fa';
                e.currentTarget.style.textDecorationColor = '#60a5fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#3b82f6';
                e.currentTarget.style.textDecorationColor = 'rgba(59, 130, 246, 0.5)';
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong style={{
              color: 'white',
              fontWeight: '600',
            }}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em style={{
              color: '#93c5fd',
              fontStyle: 'italic',
            }}>
              {children}
            </em>
          ),
          hr: () => (
            <hr style={{
              border: 'none',
              height: '1px',
              backgroundColor: 'rgba(147, 197, 253, 0.3)',
              margin: '24px 0',
            }} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}