// src/lib/api.js - 백엔드 API 연동
const API_BASE_URL = 'http://184.72.180.240/api'

/**
 * 채팅 메시지 전송
 * @param {string} message - 사용자 메시지
 * @param {number} chatId - 채팅 세션 ID (숫자)
 * @returns {Promise<{success: boolean, response: string, error?: string}>}
 */
export async function sendChatMessage(message, chatId = null) {
  try {
    // chatId를 숫자로 사용 (기본값은 1)
    // const chatRoomId = chatId || 1
    const chatRoomId = 1
    
    console.log('📤 채팅 API 호출:', {
      url: `${API_BASE_URL}/chat/${chatRoomId}/send`,
      userInput: message,
      chatRoomId: chatRoomId
    })
    
    const response = await fetch(`${API_BASE_URL}/chat/${chatRoomId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput: message
      })
    })

    console.log('📊 응답 상태:', response.status, response.statusText)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('📥 응답 데이터:', data)
    
    // 실제 응답 구조에 맞게 처리
    if (data.isSuccess) {
      return {
        success: true,
        response: data.data?.claudeResponse || '응답을 받을 수 없습니다.',
        chatId: chatRoomId,
        caseNumbers: data.data?.caseNumber || [], // 문자열 배열
        contextSummary: data.data?.contextSummary || null,
        message: data.message || null // API 메시지 추가
      }
    } else {
      return {
        success: false,
        response: data.message || '서버에서 오류가 발생했습니다.',
        error: data.message
      }
    }

  } catch (error) {
    console.error('❌ 채팅 API 호출 실패:', error)
    
    return {
      success: false,
      response: 'API 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
      error: error.message
    }
  }
}

/**
 * 스트리밍 채팅 응답 (현재 백엔드에서 지원하지 않으므로 일반 응답으로 처리)
 * @param {string} message - 사용자 메시지
 * @param {function} onChunk - 텍스트 청크 받을 때마다 호출될 콜백
 * @param {number} chatId - 채팅 세션 ID
 * @returns {Promise<{success: boolean, fullResponse: string, error?: string}>}
 */
export async function sendChatMessageStream(message, onChunk, chatId = null) {
  // 현재 백엔드가 스트리밍을 지원하지 않으므로 일반 API 호출로 처리
  try {
    const result = await sendChatMessage(message, chatId)
    
    if (result.success && onChunk) {
      // 응답을 조금씩 나누어서 스트리밍 효과 시뮬레이션
      const response = result.response
      const chunkSize = 10 // 10글자씩
      
      for (let i = 0; i < response.length; i += chunkSize) {
        const chunk = response.slice(i, i + chunkSize)
        onChunk(chunk)
        // 약간의 딜레이 추가
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }

    return {
      success: result.success,
      fullResponse: result.response,
      error: result.error,
      chatId: result.chatId,
      caseNumbers: result.caseNumbers,
      contextSummary: result.contextSummary
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
 * 용어 변환 (법률 용어 → 일상 용어)
 * @param {string} legalTerm - 법률 용어
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function translateLegalTerm(legalTerm) {
  try {
    console.log('📤 용어 변환 API 호출:', {
      url: `${API_BASE_URL}/terms/translate`,
      content: legalTerm
    })
    
    const response = await fetch(`${API_BASE_URL}/terms/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: legalTerm
      })
    })

    console.log('📊 응답 상태:', response.status, response.statusText)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('📥 응답 데이터:', data)
    
    if (data.isSuccess) {
      return {
        success: true,
        data: data.data
      }
    } else {
      return {
        success: false,
        error: data.message || '용어 변환에 실패했습니다.'
      }
    }

  } catch (error) {
    console.error('❌ 용어 변환 API 호출 실패:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 사건 번호 검색
 * @param {number|string} caseNumber - 사건 번호
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function searchPrecedent(caseNumber) {
  try {
    console.log('📤 사건 검색 API 호출:', {
      url: `${API_BASE_URL}/precedents/${caseNumber}`,
      caseNumber: caseNumber
    })
    
    const response = await fetch(`${API_BASE_URL}/precedents/${caseNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    console.log('📊 응답 상태:', response.status, response.statusText)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('📥 응답 데이터:', data)
    
    if (data.isSuccess) {
      return {
        success: true,
        data: data.data
      }
    } else {
      return {
        success: false,
        error: data.message || '사건 검색에 실패했습니다.'
      }
    }

  } catch (error) {
    console.error('❌ 사건 검색 API 호출 실패:', error)
    return {
      success: false,
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
    const response = await fetch(`${API_BASE_URL}/health`)
    
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