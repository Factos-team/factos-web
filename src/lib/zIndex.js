// src/lib/zIndex.js
// 프로젝트 전체 z-index 관리 (실제 사용하는 요소들만)

export const Z_INDEX = {
  // 기본 레이어들
  BASE: 0,
  CONTENT: 1,
  
  // UI 요소들
  SIDEBAR: 10,
  
  // 인터랙티브 요소들 (실제 사용 중)
  DROPDOWN: 100,        // ChatItem 메뉴, UserProfile 드롭다운
  
  // 오버레이들 (실제 사용 중)
  MODAL_BACKDROP: 1000, // DeleteConfirmModal 배경
  MODAL: 1010          // DeleteConfirmModal 내용
  
  // 나중에 추가될 수 있는 요소들 (예약)
  // NOTIFICATION: 1100,
  // TOOLTIP: 1200
}

// 현재 사용 중인 요소들:
// - SIDEBAR: 사이드바
// - DROPDOWN: 점 세 개 메뉴, 유저 프로필 메뉴
// - MODAL_BACKDROP: 삭제 확인 모달 배경
// - MODAL: 삭제 확인 모달 내용