// src/components/chat/UserProfile.js
'use client'
import { useState, useRef, useEffect } from 'react'
import { User, Settings, MoreVertical } from 'lucide-react'
import { Z_INDEX } from '@/lib/zIndex'

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const menuItems = [
    {
      icon: Settings,
      label: '설정',
      onClick: () => {
        console.log('설정 클릭')
        setIsOpen(false)
      }
    },
    {
      icon: MoreVertical,
      label: '더보기',
      onClick: () => {
        console.log('더보기 클릭')
        setIsOpen(false)
      }
    }
  ]

  return (
    <div style={{ 
      position: 'relative'
    }} ref={dropdownRef}>
      {/* 유저 아이콘 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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
          transition: 'background-color 0.2s',
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
      >
        <User style={{ width: '20px', height: '20px' }} />
      </button>

      {/* 유저 드롭다운 메뉴 */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          right: '0',
          top: '48px',
          width: '224px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e5e7eb',
          padding: '8px 0',
          zIndex: '50',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User style={{ width: '16px', height: '16px' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>사용자</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>user@example.com</div>
              </div>
            </div>
          </div>
          
          <div style={{ padding: '4px 0' }}>
            {menuItems.map((item, index) => (
              <button 
                key={index}
                onClick={item.onClick}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  fontSize: '14px',
                  color: '#374151',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <item.icon style={{ width: '16px', height: '16px', marginRight: '12px' }} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}