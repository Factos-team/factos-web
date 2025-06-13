// src/components/chat/ChatItem.js
'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageSquare, MoreHorizontal, Edit3, Trash2 } from 'lucide-react'

export default function ChatItem({ 
  chat, 
  isActive, 
  onSelect, 
  onDelete, 
  onRename,
  canDelete = false 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(chat.title)
  const menuRef = useRef(null)
  const inputRef = useRef(null)

  // 날짜 포맷팅
  const formatDate = (date) => {
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return '오늘'
    if (days === 1) return '어제'
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString()
  }

  // 외부 클릭시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 편집 모드 시작
  const startEditing = () => {
    setIsEditing(true)
    setIsMenuOpen(false)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  // 이름 저장
  const saveName = () => {
    const newName = editName.trim()
    if (newName && newName !== chat.title) {
      onRename?.(chat.id, newName)
    }
    setIsEditing(false)
    setEditName(chat.title) // 원래 이름으로 리셋 (저장 실패 대비)
  }

  // 편집 취소
  const cancelEdit = () => {
    setIsEditing(false)
    setEditName(chat.title)
  }

  // 삭제 확인
  const handleDelete = () => {
    const confirmed = window.confirm(`"${chat.title}" 채팅을 삭제하시겠습니까?\n\n삭제된 채팅은 복구할 수 없습니다.`)
    if (confirmed) {
      onDelete?.(chat.id)
    }
    setIsMenuOpen(false)
  }

  // 메뉴 버튼 클릭 (이벤트 버블링 방지)
  const handleMenuClick = (e) => {
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  // Enter/Escape 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveName()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  return (
    <>
      <div
        className="chat-item-container"
        onClick={() => !isEditing && onSelect?.(chat.id)}
        style={{
          padding: '12px',
          borderRadius: '12px',
          cursor: isEditing ? 'default' : 'pointer',
          transition: 'background-color 0.2s',
          backgroundColor: isActive ? '#374151' : 'transparent',
          border: '1px solid transparent',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <MessageSquare style={{ 
            width: '16px', 
            height: '16px', 
            marginTop: '2px',
            flexShrink: '0',
            color: '#9ca3af'
          }} />
          
          <div style={{ flex: '1', minWidth: '0' }}>
            {/* 채팅 제목 - 편집 모드에 따라 다른 UI */}
            {isEditing ? (
              <input
                ref={inputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyPress={handleKeyPress}
                onBlur={saveName}
                style={{
                  width: '100%',
                  fontSize: '14px',
                  fontWeight: '500',
                  margin: '0 0 4px 0',
                  padding: '2px 4px',
                  backgroundColor: '#374151',
                  border: '1px solid #60a5fa',
                  borderRadius: '4px',
                  color: 'white',
                  outline: 'none'
                }}
                maxLength={50}
              />
            ) : (
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                margin: '0 0 4px 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: isActive ? 'white' : '#d1d5db',
                width: '100%',
                paddingRight: '8px' // 메뉴 버튼 공간 확보
              }}>
                {chat.title}
              </p>
            )}
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              minWidth: '0'
            }}>
              <p style={{ 
                fontSize: '12px', 
                color: '#9ca3af',
                margin: '0',
                whiteSpace: 'nowrap'
              }}>
                {chat.messages.length}개 메시지
              </p>
              <span style={{ 
                fontSize: '11px', 
                color: '#6b7280',
                whiteSpace: 'nowrap',
                flexShrink: '0'
              }}>
                {formatDate(chat.updatedAt)}
              </span>
            </div>
          </div>
          
          {/* 점 세 개 메뉴 버튼 */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              onClick={handleMenuClick}
              className="menu-button"
              style={{
                opacity: isMenuOpen ? '1' : '0',
                padding: '4px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#9ca3af',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MoreHorizontal style={{ width: '16px', height: '16px' }} />
            </button>

            {/* 드롭다운 메뉴 */}
            {isMenuOpen && (
              <div style={{
                position: 'absolute',
                right: '0',
                top: '28px',
                width: '160px',
                backgroundColor: '#1f2937',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                border: '1px solid #374151',
                padding: '4px 0',
                zIndex: '100'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    startEditing()
                  }}
                  className="menu-item"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#d1d5db',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <Edit3 style={{ width: '14px', height: '14px', marginRight: '8px' }} />
                  이름 변경
                </button>

                {canDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete()
                    }}
                    className="menu-item-danger"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: '#ef4444',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      textAlign: 'left'
                    }}
                  >
                    <Trash2 style={{ width: '14px', height: '14px', marginRight: '8px' }} />
                    삭제
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS 스타일 - 호버 효과를 CSS로 처리 */}
      <style jsx>{`
        .chat-item-container:not([style*="background-color: rgb(55, 65, 81)"]):hover {
          background-color: #1f2937 !important;
        }

        .chat-item-container:hover .menu-button {
          opacity: 1 !important;
        }

        .menu-button:hover {
          background-color: #374151 !important;
          color: #d1d5db !important;
        }

        .menu-item:hover {
          background-color: #374151 !important;
        }

        .menu-item-danger:hover {
          background-color: #374151 !important;
        }
      `}</style>
    </>
  )
}