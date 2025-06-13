// src/components/chat/ChatArea.js
'use client'
import { useState, useRef, useEffect } from 'react'
import { Menu, MessageSquare } from 'lucide-react'
import MessageBubble from './MessageBubble'
import InputArea from './InputArea'
import { sendChatMessage } from '@/lib/api'

export default function ChatArea({ 
  chat, 
  onAddMessage, 
  isSidebarOpen, 
  onToggleSidebar 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages])

  // 메시지 전송 처리
  const handleSendMessage = async (userMessage) => {
    onAddMessage?.(userMessage)
    setIsLoading(true)

    try {
      // 실제 API 호출
      const result = await sendChatMessage(userMessage.text, chat.id)
      
      const aiMessage = {
        id: `ai-${Date.now()}`,
        text: result.response, // 성공이든 실패든 응답 메시지 표시
        isUser: false,
        timestamp: new Date(),
        isError: !result.success // 에러인지 표시
      }

      onAddMessage?.(aiMessage)
      
      if (!result.success) {
        console.error('API 호출 실패:', result.error)
      }

    } catch (error) {
      // 예상치 못한 오류
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: '오류가 발생했습니다. 새로고침 후 다시 시도해주세요.',
        isUser: false,
        timestamp: new Date(),
        isError: true
      }
      onAddMessage?.(errorMessage)
      console.error('메시지 전송 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* 상단 헤더 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px', 
        paddingRight: '64px', // 유저 프로필 공간 확보
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}>
        {/* 햄버거 버튼 - 사이드바가 닫혔을 때만 표시, 절대 위치로 X 버튼 자리에 */}
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            style={{
              position: 'absolute',
              left: '16px', // 사이드바 padding과 동일
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '10'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <Menu style={{ width: '20px', height: '20px', color: '#374151' }} />
          </button>
        )}

        {/* 제목 - 사이드바 상태에 따라 여백 조정 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          flex: '1',
          paddingLeft: isSidebarOpen ? '0' : '56px' // 햄버거 버튼 공간 확보
        }}>
          <h1 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#1f2937', 
            margin: '0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {chat?.title || '새로운 채팅'}
          </h1>
        </div>
      </div>

      {/* 채팅 메시지 영역 */}
      <div style={{ 
        flex: '1', 
        overflowY: 'auto',
        backgroundColor: '#ffffff'
      }}>
        {chat?.messages.length === 0 ? (
          // 빈 상태
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            textAlign: 'center', 
            padding: '32px' 
          }}>
            <MessageSquare style={{ width: '64px', height: '64px', color: '#9ca3af', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#4b5563', margin: '0 0 8px 0' }}>
              무엇을 도와드릴까요?
            </h3>
            <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0', lineHeight: '1.5' }}>
              궁금한 것이 있으시면 언제든 물어보세요.
            </p>
          </div>
        ) : (
          // 메시지 리스트
          <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px 16px' }}>
            {chat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* 로딩 인디케이터 */}
            {isLoading && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s ease-in-out infinite both'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s ease-in-out 0.16s infinite both'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s ease-in-out 0.32s infinite both'
                    }}></div>
                  </div>
                  <span style={{ fontSize: '14px' }}>응답을 생성하고 있습니다...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </>
  )
}