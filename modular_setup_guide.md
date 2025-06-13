# 🧩 모듈형 컴포넌트 설정 가이드

## 📁 완전한 파일 구조

```
my-chatbot/
├── .env.local                          # 환경변수
├── package.json                        # (이미 있음)
├── src/
│   ├── app/
│   │   ├── layout.js                   # 앱 레이아웃
│   │   ├── globals.css                 # 글로벌 스타일
│   │   └── chat/
│   │       └── page.js                 # 메인 페이지 (상태 관리)
│   │
│   ├── components/
│   │   └── chat/
│   │       ├── Sidebar.js              # 사이드바
│   │       ├── ChatItem.js             # 개별 채팅 아이템
│   │       ├── ChatArea.js             # 채팅 메시지 영역
│   │       ├── MessageBubble.js        # 개별 메시지
│   │       ├── InputArea.js            # 입력 영역
│   │       ├── UserProfile.js          # 유저 프로필
│   │       └── index.js                # 컴포넌트 export
│   │
│   └── lib/
│       └── api.js                      # API 함수들
```

## 🔧 단계별 설정

### 1단계: 폴더 구조 생성
```bash
mkdir -p src/components/chat
mkdir -p src/lib
```

### 2단계: 환경변수 설정
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### 3단계: 각 컴포넌트 파일 생성

#### A. 메인 페이지 (`src/app/chat/page.js`)
**main_chat_page** artifact 내용 사용

#### B. 컴포넌트들 (`src/components/chat/`)
- **Sidebar.js** ← sidebar_component artifact
- **ChatItem.js** ← chat_item_component artifact  
- **ChatArea.js** ← chat_area_component artifact
- **MessageBubble.js** ← message_bubble_component artifact
- **InputArea.js** ← input_area_component artifact
- **UserProfile.js** ← user_profile_component artifact
- **index.js** ← components_index artifact

#### C. 기타 파일들
- **src/app/layout.js** ← 이전에 제공한 layout 파일
- **src/app/globals.css** ← 이전에 제공한 간소화된 CSS
- **src/lib/api.js** ← 이전에 제공한 API 파일

### 4단계: 개발 서버 실행
```bash
npm run dev
```

## ✅ 모듈형 구조의 장점

### 🎯 컴포넌트별 독립성
```javascript
// InputArea만 수정하고 싶으면
// src/components/chat/InputArea.js 파일만 수정!

// Sidebar 스타일 바꾸고 싶으면  
// src/components/chat/Sidebar.js 파일만 수정!
```

### 🔄 재사용성
```javascript
// 다른 페이지에서도 컴포넌트 재사용 가능
import { MessageBubble, InputArea } from '@/components/chat'

// 새 페이지에서 채팅 기능만 빌려쓰기
<InputArea onSendMessage={handleSend} />
```

### 🧪 개별 테스트
```javascript
// 각 컴포넌트를 독립적으로 테스트 가능
// InputArea의 크기 조절 기능만 따로 테스트
// Sidebar의 호버 효과만 따로 테스트
```

## 🎛️ 각 컴포넌트 역할

### **page.js** (상태 관리자)
- 전역 상태 관리 (채팅 세션, 현재 채팅 등)
- 컴포넌트들 사이의 데이터 전달
- 비즈니스 로직 처리

### **Sidebar.js** (사이드바)
- 채팅 리스트 표시
- 새 채팅 생성 버튼
- 모바일 반응형 처리

### **ChatItem.js** (개별 채팅)
- 채팅 제목, 메시지 수, 날짜 표시
- 호버 효과, 삭제 버튼
- 선택 상태 관리

### **ChatArea.js** (채팅 영역)
- 메시지 리스트 표시
- 로딩 상태 처리
- API 호출 및 응답 처리

### **MessageBubble.js** (개별 메시지)
- 사용자/AI 메시지 구분 렌더링
- 복사 기능
- 호버 효과

### **InputArea.js** (입력 영역)
- 텍스트 입력 및 자동 크기 조절
- 전송 버튼 처리
- 키보드 이벤트 처리

### **UserProfile.js** (유저 프로필)
- 유저 아이콘 및 드롭다운
- 설정 메뉴
- 외부 클릭 감지

## 🔧 컴포넌트 수정 예시

### InputArea 수정하고 싶다면:
```bash
# 오직 이 파일만 수정
vi src/components/chat/InputArea.js

# 다른 파일들은 건드리지 않아도 됨!
```

### 새 컴포넌트 추가하고 싶다면:
```bash
# 1. 새 컴포넌트 생성
touch src/components/chat/NewComponent.js

# 2. index.js에 export 추가
echo "export { default as NewComponent } from './NewComponent'" >> src/components/chat/index.js

# 3. 메인 페이지에서 import
import { NewComponent } from '@/components/chat'
```

## 🐛 문제 해결

### Import 에러
```bash
# 경로 확인
ls -la src/components/chat/

# index.js 내용 확인
cat src/components/chat/index.js
```

### 컴포넌트 렌더링 안 됨
1. 해당 컴포넌트 파일 문법 확인
2. export/import 문법 확인
3. props 전달 확인

### 스타일 적용 안 됨
1. 인라인 스타일 확인
2. CSS 클래스명 확인
3. 브라우저 캐시 삭제

## 🎯 장점 요약

1. **🔧 수정 용이**: 특정 기능만 고치고 싶을 때 해당 파일만 수정
2. **🧪 테스트 편리**: 각 컴포넌트를 독립적으로 테스트
3. **♻️ 재사용성**: 다른 프로젝트에서도 컴포넌트 재사용
4. **👥 협업 편리**: 여러 명이 동시에 다른 컴포넌트 작업 가능
5. **📖 가독성**: 코드가 역할별로 분리되어 이해하기 쉬움

이제 **InputArea만 수정하고 싶으면 InputArea.js만**, **사이드바만 수정하고 싶으면 Sidebar.js만** 건드리면 돼! 🎉