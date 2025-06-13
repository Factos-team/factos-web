// src/app/page.js - 간단한 랜딩 페이지
import Link from 'next/link'
import { MessageCircle, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        {/* 로고 */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ChatBot AI
          </h1>
          <p className="text-lg text-gray-600">
            AI와 함께하는 스마트한 채팅
          </p>
        </div>

        {/* 시작 버튼 */}
        <Link href="/chat">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors inline-flex items-center group shadow-lg">
            채팅 시작하기
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>

        <p className="text-sm text-gray-500 mt-6">
          무료로 시작하세요. 계정 등록이 필요하지 않습니다.
        </p>
      </div>
    </div>
  )
}