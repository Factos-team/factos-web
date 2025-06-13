// src/components/chat/InputArea.js
'use client'
import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

export default function InputArea({ onSendMessage, isLoading = false }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  // 텍스트에어리어 높이 자동 조절
  useEffect(() => {
    if (textareaRef.current) {
      // 높이를 초기값으로 리셋
      textareaRef.current.style.height = '24px'
      
      // 내용에 맞춰 높이 조절 (최대 120px로 제한)
      const scrollHeight = textareaRef.current.scrollHeight
      const newHeight = Math.min(scrollHeight, 120)
      textareaRef.current.style.height = newHeight + 'px'
      
      // 120px 초과시 스크롤 활성화
      if (scrollHeight > 120) {
        textareaRef.current.style.overflowY = 'auto'
      } else {
        textareaRef.current.style.overflowY = 'hidden'
      }
      
      // 컨테이너 높이도 조절 (최소 52px)
      const container = textareaRef.current.parentElement
      if (container) {
        const containerHeight = Math.max(newHeight + 24, 52) // 패딩 고려
        container.style.minHeight = containerHeight + 'px'
      }
    }
  }, [input])

  // 메시지 전송
  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const message = {
      id: `user-${Date.now()}`,
      text: input.trim(),
      isUser: true,
      timestamp: new Date()
    }

    onSendMessage?.(message)
    setInput('')
  }


  // 키보드 이벤트
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ 
      borderTop: '1px solidrgb(255, 255, 255)', 
      backgroundColor: '#f9fafb', 
      padding: '16px'
    }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        {/* 채팅 입력 컨테이너 */}
        <div style={{ 
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '24px',
          border: '1px solid #d1d5db',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s',
          minHeight: '52px',
          maxWidth: '100%'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#3b82f6'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="무엇을 도와드릴까요?"
            style={{
              width: '100%',
              resize: 'none',
              border: 'none',
              borderRadius: '24px',
              padding: '14px 55px 14px 20px', // 오른쪽에 버튼 공간 확보
              fontSize: '16px',
              lineHeight: '1.5',
              outline: 'none',
              backgroundColor: 'white',
              minHeight: '24px',
              maxHeight: '120px', // 최대 높이 제한
              overflowY: 'hidden', // 기본은 hidden, 필요시 auto로 변경
              fontFamily: 'inherit',
              boxSizing: 'border-box' // 테두리 포함해서 크기 계산
            }}
            disabled={isLoading}
            maxLength={1000} // 텍스트 길이 제한
            rows={1}
          />
          
          {/* 전송 버튼 - 텍스트박스 위에 absolute positioning */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{
              position: 'absolute',
              right: '25px',
              bottom: '15px',
              width: '36px',
              height: '36px',
              backgroundColor: input.trim() && !isLoading ? '#3b82f6' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '18px',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '10',
              boxShadow: input.trim() && !isLoading ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
              flexShrink: '0' // 버튼이 줄어들지 않게
            }}
            onMouseEnter={(e) => {
              if (input.trim() && !isLoading) {
                e.target.style.backgroundColor = '#2563eb'
                e.target.style.transform = 'scale(1.05)'
              }
            }}
            onMouseLeave={(e) => {
              if (input.trim() && !isLoading) {
                e.target.style.backgroundColor = '#3b82f6'
                e.target.style.transform = 'scale(1)'
              }
            }}
          >
            <Send style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
        
        {/* 하단 정보 텍스트 */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '8px', 
          fontSize: '12px', 
          color: '#6b7280' 
        }}>
          <span>Enter로 전송 • Shift+Enter로 줄바꿈</span>
          <span style={{ color: input.length > 800 ? '#ef4444' : '#6b7280' }}>
            {input.length}/1000
          </span>
        </div>
      </div>
    </div>
  )
}