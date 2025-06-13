// src/lib/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * 채팅 메시지 전송
 * @param {string} message - 사용자 메시지
 * @param {string} chatId - 채팅 세션 ID (선택사항)
 * @returns {Promise<{success: boolean, response: string, error?: string}>}
 */
export async function sendChatMessage(message, chatId = null) {
  try {
    // 전송 / 받기 API 
    // 현재는 실패 테스트만 가능
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        chatId: chatId,
        timestamp: new Date().toISOString()
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      response: data.response || data.message || '응답을 받을 수 없습니다.',
      chatId: data.chatId || chatId
    }

  } catch (error) {
    console.error('API 호출 실패:', error)
    
    return {
      success: false,
      response: 'API 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
      error: error.message
    }
  }
}

/**
 * 스트리밍 채팅 응답 (실시간 텍스트 생성)
 * @param {string} message - 사용자 메시지
 * @param {function} onChunk - 텍스트 청크 받을 때마다 호출될 콜백
 * @param {string} chatId - 채팅 세션 ID
 * @returns {Promise<{success: boolean, fullResponse: string, error?: string}>}
 */
export async function sendChatMessageStream(message, onChunk, chatId = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        chatId: chatId,
        timestamp: new Date().toISOString()
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      fullResponse += chunk
      
      // 실시간으로 텍스트 청크 전달
      if (onChunk) {
        onChunk(chunk)
      }
    }

    return {
      success: true,
      fullResponse: fullResponse,
      chatId: chatId
    }

  } catch (error) {
    console.error('Streaming API 호출 실패:', error)
    
    return {
      success: false,
      fullResponse: '',
      error: error.message
    }
  }
}

/**
 * 서버 상태 확인
 * @returns {Promise<{success: boolean, status: string}>}
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      status: data.status || 'ok'
    }

  } catch (error) {
    console.error('서버 상태 확인 실패:', error)
    return {
      success: false,
      status: 'error'
    }
  }
}