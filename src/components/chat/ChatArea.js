// src/components/chat/ChatArea.js
'use client'
import { useState, useRef, useEffect } from 'react'
import { Menu, MessageSquare, Plus, Home } from 'lucide-react'
import MessageBubble from './MessageBubble'
import InputArea from './InputArea'
import { sendChatMessage } from '@/lib/api'
import Link from 'next/link'

export default function ChatArea({ 
  chat, 
  chatSessions,
  onAddMessage, 
  onSetError, // 추가: 채팅별 에러 설정 함수
  onNewChat, // 추가: 새 채팅 생성 함수
  isSidebarOpen, 
  onToggleSidebar 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages, chat?.errorMessage]) // chat.errorMessage 감지

  // 고유한 메시지 ID 생성 함수
  const generateMessageId = (type) => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    return `${type}-${timestamp}-${random}`
  }

  // 메시지 전송 처리
  const handleSendMessage = async (userMessage) => {
    // 채팅이 없으면 처리하지 않음
    if (!chat) {
      onSetError?.(null, '먼저 새 채팅을 생성해주세요.')
      return
    }

    // 기존 메시지 ID 유지 (덮어쓰지 않음)
    const userMessageWithId = {
      ...userMessage,
      // 기존 ID가 있으면 유지, 없으면 새로 생성
      id: userMessage.id || generateMessageId('user'),
      timestamp: new Date()
    }

    // 사용자 메시지 즉시 추가
    onAddMessage?.(userMessageWithId)
    
    // 로딩 시작
    setIsLoading(true)

    try {
      // API 호출
      const result = await sendChatMessage(userMessageWithId.text, chat.id)
      
      if (result.success) {
        // AI 응답 메시지 추가
        const aiMessage = {
          id: generateMessageId('ai'),
          text: result.response,
          isUser: false,
          timestamp: new Date(),
          isError: false
        }
        
        onAddMessage?.(aiMessage)
        
      } else {
        // 실패시 에러 메시지 설정
        onSetError?.(chat.id, result.response || '서버에서 오류가 발생했습니다.')
      }

    } catch (error) {
      // 연결 오류시 에러 메시지 설정
      onSetError?.(chat.id, 'API 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* 상단 헤더 */}
      <div style={{ 
        height: '48px',
        padding: '6px 16px 6px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderBottom: chat ? '1px solid #e5e7eb' : 'none',
        boxShadow: chat ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none',
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

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          flex: '1',
          paddingLeft: isSidebarOpen ? '0' : '56px'
        }}>
          {chat && (
            <h1 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937', 
              margin: '0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {chat.title}
            </h1>
          )}
        </div>

        {/* 홈 버튼 - 우측 상단 */}
        <Link href="/">
          <button
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb'
              e.target.style.transform = 'scale(1.05)'
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6'
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}
          >
            <Home style={{ width: '20px', height: '20px' }} />
          </button>
        </Link>
      </div>

      {/* 채팅 메시지 영역 */}
      <div style={{ 
        flex: '1', 
        overflowY: 'auto',
        backgroundColor: '#ffffff'
      }}>
        {(!chat || chat.messages.length === 0) && !chat?.errorMessage ? (
          // 빈 상태 - 채팅이 없거나 메시지가 없을 때
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            textAlign: 'center', 
            padding: '32px' 
          }}>
            {/* 아이콘 변경: 채팅 없음 vs 새 채팅 시작 */}
            {chatSessions?.length === 0 ? (
              // 채팅이 아예 없을 때 - Plus 아이콘 (클릭 가능)
              <button
                onClick={onNewChat}
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb'
                  e.target.style.transform = 'scale(1.05)'
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6'
                  e.target.style.transform = 'scale(1)'
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Plus style={{ width: '32px', height: '32px', color: '#6b7280' }} />
              </button>
            ) : (
              // 새 채팅이 있지만 메시지가 없을 때 - MessageSquare 아이콘
              <MessageSquare style={{ width: '64px', height: '64px', color: '#9ca3af', marginBottom: '16px' }} />
            )}
            
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#4b5563', margin: '0 0 8px 0' }}>
              {chatSessions?.length === 0 ? '새 채팅을 시작해보세요' : '채팅을 시작해보세요'}
            </h3>
            <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0', lineHeight: '1.5' }}>
              {chatSessions?.length === 0 
                ? '좌측 상단의 "새 채팅" 버튼을 눌러 대화를 시작하세요.' 
                : '궁금한 것이 있으시면 언제든 물어보세요.'}
            </p>
          </div>
        ) : (
          // 메시지 리스트
          <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px 16px' }}>
            {/* 메시지들을 순서대로 렌더링 */}
            {chat?.messages?.map((message, index) => (
              <MessageBubble 
                key={message.id || `message-${index}`} 
                message={message} 
              />
            ))}

            {/* 에러 메시지 표시 (채팅별로 저장된 에러 메시지) */}
            {chat?.errorMessage && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  color: '#ef4444',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '16px',
                  fontSize: '15px',
                  padding: '12px',
                  backgroundColor: '#fef2f2',
                  borderRadius: '8px',
                  border: '1px solid #fecaca'
                }}>
                  {chat.errorMessage}
                </div>
              </div>
            )}

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

      {/* 입력 영역 - 채팅이 있을 때만 표시 */}
      {chat && <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />}

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