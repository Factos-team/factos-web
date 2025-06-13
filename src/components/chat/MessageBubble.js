// src/components/chat/MessageBubble.js
'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false)

  // 메시지 복사
  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('복사 실패:', err)
    }
  }

  if (message.isUser) {
    // 사용자 메시지
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
        <div style={{
          maxWidth: '320px',
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '16px',
          borderBottomRightRadius: '4px',
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
        }}>
          <p style={{ 
            fontSize: '14px', 
            lineHeight: '1.5', 
            whiteSpace: 'pre-wrap',
            margin: '0'
          }}>
            {message.text}
          </p>
        </div>
      </div>
    )
  }

  // AI 응답 (블로그 스타일)
  return (
  <div className="group" style={{ position: 'relative', marginBottom: '32px' }}>
    <div style={{
      color: message.isError ? '#ef4444' : '#1f2937',                    // ← 에러면 빨간색
      lineHeight: '1.7',
      whiteSpace: 'pre-wrap',
      marginBottom: '16px',
      fontSize: '15px',
      padding: message.isError ? '12px' : '0',                          // ← 에러면 패딩 추가
      backgroundColor: message.isError ? '#fef2f2' : 'transparent',     // ← 에러면 연한 빨간 배경
      borderRadius: message.isError ? '8px' : '0',                      // ← 에러면 둥근 모서리
      border: message.isError ? '1px solid #fecaca' : 'none'           // ← 에러면 테두리
    }}>
      {message.text}
    </div>
      
      {/* 공유 버튼 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        opacity: '0',
        transition: 'opacity 0.2s'
      }}
      className="group-hover:opacity-100"
      onMouseEnter={(e) => e.target.style.opacity = '1'}
      onMouseLeave={(e) => e.target.style.opacity = '0'}
      >
        <button
          onClick={copyMessage}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e5e7eb'
            e.target.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f3f4f6'
            e.target.style.color = '#6b7280'
          }}
        >
          {copied ? (
            <>
              <Check style={{ width: '12px', height: '12px' }} />
              <span>복사됨</span>
            </>
          ) : (
            <>
              <Copy style={{ width: '12px', height: '12px' }} />
              <span>복사</span>
            </>
          )}
        </button>
      </div>

      {/* CSS for hover effect */}
      <style jsx>{`
        .group:hover .group-hover\\:opacity-100 {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  )
}