// src/app/chat/page.js - 메인 페이지 (localStorage로 채팅 유지)
'use client'
import { useState, useRef, useEffect } from 'react'
import { Sidebar, ChatArea } from '@/components/chat'

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
      localStorage.setItem('factos-current-chat-id', chatId.toString())
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
          
          // 현재 채팅 ID 복원
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
      
      // 저장된 데이터가 없으면 기본 채팅 생성
      const defaultChat = {
        id: 1,
        title: "새로운 채팅",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        titleSetByUser: false
      }
      
      setChatSessions([defaultChat])
      setCurrentChatId(1)
      
      // localStorage에 저장
      localStorage.setItem('factos-chat-sessions', JSON.stringify([defaultChat]))
      localStorage.setItem('factos-current-chat-id', '1')
      
    } catch (error) {
      console.error('채팅 데이터 불러오기 실패:', error)
      
      // 오류 시 기본 채팅 생성
      const defaultChat = {
        id: 1,
        title: "새로운 채팅",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        titleSetByUser: false
      }
      setChatSessions([defaultChat])
      setCurrentChatId(1)
    }
    
    setIsLoaded(true)
  }, [])

  // 현재 채팅 가져오기
  const currentChat = chatSessions.find(chat => chat.id === currentChatId) || chatSessions[0]

  // 새 채팅 생성
  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "새로운 채팅",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      titleSetByUser: false
    }
    const newSessions = [newChat, ...chatSessions]
    saveChatSessions(newSessions)
    saveCurrentChatId(newChat.id)
  }

  // 채팅 선택
  const selectChat = (chatId) => {
    saveCurrentChatId(chatId)
  }

  // 채팅 삭제
  const deleteChat = (chatId) => {
    if (chatSessions.length === 1) return
    
    const newSessions = chatSessions.filter(chat => chat.id !== chatId)
    saveChatSessions(newSessions)
    
    if (currentChatId === chatId) {
      saveCurrentChatId(newSessions[0]?.id)
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

  // 메시지 추가 (제목 자동 설정 로직 개선)
  const addMessage = (message) => {
    const newSessions = chatSessions.map(chat => {
      if (chat.id !== currentChatId) return chat
      
      // 제목 결정 로직
      let newTitle = chat.title
      
      // 1. 사용자가 직접 제목을 설정한 경우: 제목 변경 안 함
      // 2. 첫 번째 사용자 메시지이고, 아직 자동 제목이 설정되지 않은 경우에만 제목 변경
      if (!chat.titleSetByUser && chat.messages.length === 0 && message.isUser) {
        newTitle = message.text.slice(0, 30) + (message.text.length > 30 ? '...' : '')
      }
      
      return {
        ...chat, 
        title: newTitle,
        messages: [...chat.messages, message],
        updatedAt: new Date()
      }
    })
    
    saveChatSessions(newSessions)
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
          onAddMessage={addMessage}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
    </div>
  )
}