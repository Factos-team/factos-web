// src/app/chat/page.js - 메인 페이지 (고유 채팅 ID 생성)
'use client'
import { useState, useRef, useEffect } from 'react'
import { Sidebar, ChatArea } from '@/components/chat'

// 짧고 고유한 채팅 ID 생성 함수 (숫자)
const generateChatId = () => {
  // 현재 타임스탬프 + 랜덤 숫자로 고유한 숫자 ID 생성
  const timestamp = Date.now() // 밀리초 타임스탬프
  const random = Math.floor(Math.random() * 1000) // 0-999 랜덤
  return parseInt(`${timestamp}${random}`) // 숫자로 반환
}

export default function ChatPage() {
  // 전역 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [chatSessions, setChatSessions] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // localStorage에 채팅 세션 저장
  const saveChatSessions = (sessions) => {
    setChatSessions(sessions)
    if (typeof window !== 'undefined') {
      localStorage.setItem('factos-chat-sessions', JSON.stringify(sessions))
    }
  }

  // localStorage에 현재 채팅 ID 저장
  const saveCurrentChatId = (chatId) => {
    setCurrentChatId(chatId)
    if (typeof window !== 'undefined') {
      localStorage.setItem('factos-current-chat-id', String(chatId))
    }
  }

  // 페이지 로드 시 localStorage에서 데이터 불러오기
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      // 채팅 세션 불러오기
      const savedChats = localStorage.getItem('factos-chat-sessions')
      const savedCurrentId = localStorage.getItem('factos-current-chat-id')
      
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats)
        if (parsedChats.length > 0) {
          // 날짜 객체 복원
          const restoredChats = parsedChats.map(chat => ({
            ...chat,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
            messages: chat.messages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }))
          
          setChatSessions(restoredChats)
          
          // 현재 채팅 ID 복원 (숫자로 변환)
          if (savedCurrentId) {
            const currentId = parseInt(savedCurrentId)
            if (restoredChats.find(chat => chat.id === currentId)) {
              setCurrentChatId(currentId)
            } else {
              setCurrentChatId(restoredChats[0].id)
            }
          } else {
            setCurrentChatId(restoredChats[0].id)
          }
          
          setIsLoaded(true)
          return
        }
      }
      
      // 저장된 데이터가 없으면 빈 상태로 시작
      setChatSessions([])
      setCurrentChatId(null)
      
    } catch (error) {
      console.error('채팅 데이터 불러오기 실패:', error)
      
      // 오류 시 빈 상태로 시작
      setChatSessions([])
      setCurrentChatId(null)
    }
    
    setIsLoaded(true)
  }, [])

  // 현재 채팅 가져오기 (빈 상태 지원)
  const currentChat = chatSessions.length > 0 
    ? chatSessions.find(chat => chat.id === currentChatId) || chatSessions[0]
    : null

  // 새 채팅 생성
  const createNewChat = () => {
    const newChat = {
      id: generateChatId(), // 고유한 숫자 ID 생성
      title: "새로운 채팅",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      titleSetByUser: false,
      errorMessage: null // 에러 메시지 초기값
    }
    const newSessions = [newChat, ...chatSessions]
    saveChatSessions(newSessions)
    saveCurrentChatId(newChat.id)
  }

  // 채팅 선택
  const selectChat = (chatId) => {
    saveCurrentChatId(chatId)
  }

  // 채팅 삭제 (자동 생성 제거)
  const deleteChat = (chatId) => {
    const newSessions = chatSessions.filter(chat => chat.id !== chatId)
    saveChatSessions(newSessions)
    
    // 삭제한 채팅이 현재 선택된 채팅이면 다른 채팅으로 이동
    if (currentChatId === chatId) {
      if (newSessions.length > 0) {
        saveCurrentChatId(newSessions[0]?.id)
      } else {
        // 모든 채팅이 삭제되면 빈 상태로 유지
        setCurrentChatId(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('factos-current-chat-id')
        }
      }
    }
  }

  // 채팅 이름 변경 (사용자가 직접 변경할 때만)
  const renameChat = (chatId, newTitle) => {
    const newSessions = chatSessions.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat, 
            title: newTitle, 
            updatedAt: new Date(),
            titleSetByUser: true
          }
        : chat
    )
    saveChatSessions(newSessions)
  }

  // 메시지 추가 (함수형 업데이트로 수정)
  const addMessage = (message) => {
    setChatSessions(prevSessions => {
      const newSessions = prevSessions.map(chat => {
        if (chat.id !== currentChatId) return chat
        
        return {
          ...chat,
          messages: [...chat.messages, message],
          updatedAt: new Date(),
          errorMessage: null // 새 메시지 추가 시 에러 메시지 제거
        }
      })
      
      // localStorage에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('factos-chat-sessions', JSON.stringify(newSessions))
      }
      
      return newSessions
    })
  }

  // 채팅별 에러 메시지 설정 (함수형 업데이트로 수정)
  const setErrorForChat = (chatId, errorMessage) => {
    setChatSessions(prevSessions => {
      const newSessions = prevSessions.map(chat => {
        if (chat.id !== chatId) return chat
        
        return {
          ...chat,
          errorMessage: errorMessage
        }
      })
      
      // localStorage에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('factos-chat-sessions', JSON.stringify(newSessions))
      }
      
      return newSessions
    })
  }

  // 로딩 중 표시
  if (!isLoaded) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          로딩 중...
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div
     style={{ height: '100vh', display: 'flex', backgroundColor: '#f9fafb' }}
    >
      {/* 사이드바 */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={setIsSidebarOpen}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onNewChat={createNewChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        onRenameChat={renameChat}
      />

      {/* 메인 채팅 영역 */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', position: 'relative', minWidth: '0' }}>
        {/* 채팅 영역 */}
        <ChatArea
          chat={currentChat}
          chatSessions={chatSessions}
          onAddMessage={addMessage}
          onSetError={setErrorForChat}
          onNewChat={createNewChat}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
    </div>
  )
}