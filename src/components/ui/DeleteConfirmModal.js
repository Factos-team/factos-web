// src/components/ui/DeleteConfirmModal.js
'use client'
import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "채팅 삭제",
  message = "이 채팅을 삭제하시겠습니까?",
  confirmText = "삭제",
  cancelText = "취소",
  position = null // 특정 위치에 표시하려면 { top: number, left: number }
}) {
  const modalRef = useRef(null)
  const confirmButtonRef = useRef(null)

  // 모달이 열렸을 때 포커스 및 키보드 이벤트 처리
  useEffect(() => {
    if (!isOpen) return

    // 확인 버튼에 포커스
    if (confirmButtonRef.current) {
      confirmButtonRef.current.focus()
    }

    // ESC 키로 닫기
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    // 바깥 영역 클릭으로 닫기
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    // 포커스 트랩 - 모달 내부에서만 Tab 이동 가능
    const handleFocusTrap = (e) => {
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    // body 스크롤 방지
    document.body.style.overflow = 'hidden'

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleFocusTrap)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleFocusTrap)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // 위치 결정: position이 있으면 절대 위치, 없으면 중앙
  const isPositioned = position && position.top && position.left
  const containerStyle = isPositioned 
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // 더 연한 오버레이
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease-out',
        pointerEvents: 'auto'
      }
    : {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease-out'
      }

  const modalStyle = isPositioned
    ? {
        position: 'absolute',
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#1f2937', // 다크 테마
        borderRadius: '12px',
        padding: '20px',
        width: '280px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        border: '1px solid #374151',
        zIndex: 10000,
        animation: 'modalSlideIn 0.2s ease-out',
        outline: 'none'
      }
    : {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e5e7eb',
        animation: 'modalSlideIn 0.2s ease-out',
        zIndex: 10000,
        outline: 'none'
      }

  return (
    <div style={containerStyle}>
      <div ref={modalRef} style={modalStyle}>
        {/* 모달 헤더 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: isPositioned ? '36px' : '40px',
              height: isPositioned ? '36px' : '40px',
              backgroundColor: '#fef2f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle style={{ 
                width: isPositioned ? '18px' : '20px', 
                height: isPositioned ? '18px' : '20px', 
                color: '#ef4444' 
              }} />
            </div>
            <h3 style={{ 
              fontSize: isPositioned ? '16px' : '18px', 
              fontWeight: '600', 
              color: isPositioned ? '#f9fafb' : '#1f2937', 
              margin: 0 
            }}>
              {title}
            </h3>
          </div>
          
          <button
            onClick={onClose}
            style={{
              width: isPositioned ? '28px' : '32px',
              height: isPositioned ? '28px' : '32px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: isPositioned ? '6px' : '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = isPositioned ? '#374151' : '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X style={{ 
              width: isPositioned ? '14px' : '16px', 
              height: isPositioned ? '14px' : '16px', 
              color: isPositioned ? '#9ca3af' : '#6b7280' 
            }} />
          </button>
        </div>

        {/* 모달 내용 */}
        <div style={{ marginBottom: isPositioned ? '20px' : '24px' }}>
          <p style={{ 
            fontSize: '14px', 
            color: isPositioned ? '#d1d5db' : '#6b7280', 
            lineHeight: '1.5',
            margin: '0 0 8px 0'
          }}>
            {message}
          </p>
          <p style={{ 
            fontSize: '12px', 
            color: isPositioned ? '#9ca3af' : '#9ca3af', 
            margin: 0
          }}>
            삭제된 채팅은 복구할 수 없습니다.
          </p>
        </div>

        {/* 버튼 영역 */}
        <div style={{ 
          display: 'flex', 
          gap: isPositioned ? '8px' : '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: isPositioned ? '8px 16px' : '10px 20px',
              backgroundColor: isPositioned ? '#374151' : '#f9fafb',
              border: isPositioned ? '1px solid #4b5563' : '1px solid #d1d5db',
              borderRadius: isPositioned ? '6px' : '8px',
              fontSize: isPositioned ? '13px' : '14px',
              fontWeight: '500',
              color: isPositioned ? '#d1d5db' : '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (isPositioned) {
                e.target.style.backgroundColor = '#4b5563'
                e.target.style.borderColor = '#6b7280'
              } else {
                e.target.style.backgroundColor = '#f3f4f6'
                e.target.style.borderColor = '#9ca3af'
              }
            }}
            onMouseLeave={(e) => {
              if (isPositioned) {
                e.target.style.backgroundColor = '#374151'
                e.target.style.borderColor = '#4b5563'
              } else {
                e.target.style.backgroundColor = '#f9fafb'
                e.target.style.borderColor = '#d1d5db'
              }
            }}
          >
            {cancelText}
          </button>
          
          {/* 확인 버튼 - Claude 스타일 포커싱 */}
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="delete-confirm-button"
            style={{
              padding: isPositioned ? '8px 16px' : '10px 20px',
              backgroundColor: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: isPositioned ? '6px' : '8px',
              fontSize: isPositioned ? '13px' : '14px',
              fontWeight: '500',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc2626'
              e.target.style.borderColor = '#dc2626'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ef4444'
              e.target.style.borderColor = '#ef4444'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onConfirm()
              }
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      {/* CSS 애니메이션 및 포커스 스타일 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: ${isPositioned 
              ? 'translate(-50%, -50%) translateY(-20px) scale(0.95)' 
              : 'translateY(-20px) scale(0.95)'
            }; 
          }
          to { 
            opacity: 1; 
            transform: ${isPositioned 
              ? 'translate(-50%, -50%) translateY(0) scale(1)' 
              : 'translateY(0) scale(1)'
            }; 
          }
        }

        /* Claude 스타일 포커스 링 */
        .delete-confirm-button:focus {
          box-shadow: 0 0 0 2px ${isPositioned ? '#1f2937' : '#ffffff'}, 0 0 0 4px #3b82f6 !important;
        }
      `}</style>
    </div>
  )
}