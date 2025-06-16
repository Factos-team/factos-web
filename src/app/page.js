// src/app/page.js - 그라데이션 버전
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, ArrowRight, Scale, BookOpen, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #e5e7eb 100%)'
    }}>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 16px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Hero 섹션 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          
          {/* 로고 + 제목 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(17, 24, 39, 0.3)',
              position: 'relative'
            }}>
              <Scale style={{ width: '36px', height: '36px', color: '#f59e0b' }} />
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '24px',
                height: '24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles style={{ width: '12px', height: '12px', color: 'white' }} />
              </div>
            </div>
            
            <h1 style={{ 
              fontSize: '56px', 
              fontWeight: '700', 
              background: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0',
              lineHeight: '1.1'
            }}>
              Factos
            </h1>
          </div>
          
          {/* 부제목 */}
          <p style={{ 
            fontSize: '24px', 
            color: '#6b7280', 
            margin: '0 0 16px 0',
            fontWeight: '400'
          }}>
            법률 AI 어시스턴트
          </p>
          
          {/* 설명 */}
          <p style={{ 
            fontSize: '18px', 
            color: '#6b7280', 
            margin: '0 auto',
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            복잡한 법률 용어부터 전문적인 상담까지, 
            <br />Factos와 함께 법률을 쉽고 정확하게 이해하세요.
          </p>
        </div>

        {/* 기능 카드 섹션 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px',
          width: '100%',
          maxWidth: '900px'
        }}>
          
          {/* AI 채팅 카드 */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <MessageCircle style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
            </div>
            
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#111827', 
              margin: '0 0 12px 0' 
            }}>
              AI 법률 상담
            </h3>
            
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280', 
              margin: '0 0 32px 0',
              lineHeight: '1.6'
            }}>
              복잡한 법률 문제를 AI와 실시간으로 상담하세요. 
              판례 기반의 정확한 답변을 즉시 받아볼 수 있습니다.
            </p>
            
            <Link href="/chat" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                e.target.style.transform = 'scale(1.02)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                e.target.style.transform = 'scale(1)'
              }}
              >
                채팅 시작하기
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </button>
            </Link>
          </div>

          {/* 용어 변환 카드 */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <BookOpen style={{ width: '32px', height: '32px', color: '#111827' }} />
            </div>
            
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#111827', 
              margin: '0 0 12px 0' 
            }}>
              법률 용어 변환
            </h3>
            
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280', 
              margin: '0 0 32px 0',
              lineHeight: '1.6'
            }}>
              어려운 법률 용어를 쉬운 일상 언어로 번역해드립니다. 
              복잡한 계약서나 법문서를 이해하기 쉽게 만들어보세요.
            </p>
            
            <Link href="/translate" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #1f2937 0%, #4b5563 100%)'
                e.target.style.transform = 'scale(1.02)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #111827 0%, #374151 100%)'
                e.target.style.transform = 'scale(1)'
              }}
              >
                용어 변환하기
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </button>
            </Link>
          </div>
        </div>

        {/* 하단 정보 */}
        <div style={{
          marginTop: '80px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <Scale style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: '0',
              fontWeight: '500'
            }}>
              Factos v0.1 Beta
            </p>
          </div>
          
          <p style={{ 
            fontSize: '12px', 
            color: '#9ca3af', 
            margin: '0'
          }}>
            무료로 시작하세요 • 계정 등록이 필요하지 않습니다
          </p>
        </div>
      </div>
    </div>
  )
}