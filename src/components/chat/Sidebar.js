// src/components/chat/Sidebar.js
'use client'
import { Plus, X, Scale } from 'lucide-react'
import ChatItem from './ChatItem'

export default function Sidebar({
  isOpen,
  onToggle,
  chatSessions,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat
}) {
  return (
    <>
      {/* 사이드바 컨테이너 */}
      <div style={{
        width: isOpen ? '320px' : '0px', // 컨테이너는 크기 변화
        transition: 'width 0.3s ease',
        position: 'relative',
        zIndex: '50',
        height: '100vh',
        overflow: 'hidden' // 내용물이 넘치지 않게
      }}>
        {/* 사이드바 내용물 - 항상 320px 고정 */}
        <div style={{
          width: '320px', // 고정 너비로 텍스트 줄바꿈 방지
          height: '100vh',
          backgroundColor: '#111827',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #374151',
          position: 'relative' // X 버튼의 절대 위치 기준점
        }}>

          {/* 사이드바 헤더 */}
          <div style={{
            padding: '6px 16px 6px 16px',
            borderBottom: '1px solid #374151',
            position: 'relative',
            height: '48px',           // 헤더 높이 고정
            display: 'flex',          // flex 레이아웃
            alignItems: 'center'      // 세로 중앙 정렬
          }}>
            {/* X 버튼 - 좌측 고정 */}
            <button
              onClick={() => onToggle?.(false)}
              className="sidebar-close-button"
              style={{
                width: '36px',            // ← 고정 크기
                height: '36px',           // ← 고정 크기  
                display: 'flex',          // ← flex 추가
                alignItems: 'center',     // ← 아이콘 중앙 정렬
                justifyContent: 'center', // ← 아이콘 중앙 정렬
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                flexShrink: '0'
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            {/* Factos 제목 + 아이콘 - 우측 정렬 */}
            <div style={{
              flex: '1',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Scale style={{
                width: '20px',
                height: '20px',
                color: '#f59e0b'
              }} />
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0',
                lineHeight: '18px',
                color: 'white'
              }}>
                Factos
              </h2>
            </div>
          </div>

          {/* 새 채팅 버튼 */}
          <button
            onClick={onNewChat}
            className="new-chat-button"
            style={{
              width: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 12px',
              margin: '8px 8px 8px 8px',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Plus style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            새 채팅
          </button>
          
          {/* 채팅 리스트 */}
          <div 
            style={{
              flex: '1',
              overflowY: 'auto',
              padding: '8px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(163, 174, 190, 0.69) #111827'
            }}
            id="chat-list-container"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {chatSessions.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={currentChatId === chat.id}
                  onSelect={onSelectChat}
                  onDelete={onDeleteChat}
                  onRename={onRenameChat}
                  canDelete={chatSessions.length > 1}
                />
              ))}
            </div>
          </div>

          {/* 사이드바 하단 */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #374151',
            fontSize: '12px',
            color: '#6b7280',
            textAlign: 'center'
          }}>
             Factos v0.1
          </div>
        </div>
      </div>

      {/* CSS 스타일 - 호버 효과를 CSS로 처리 */}
      <style jsx>{`
        .sidebar-close-button:hover {
          background-color: #475569 !important;
        }

        .new-chat-button:hover {
          background-color: #475569 !important;
          border-color: #64748b !important;
        }
      `}</style>
    </>
  )
}