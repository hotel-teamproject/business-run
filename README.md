# Business Run - 호텔 예약 관리 시스템

MERN 스택(MongoDB, Express, React, Node.js)으로 구축된 호텔 예약 관리 시스템입니다.

## 📋 프로젝트 구조

```
business-run/
├── business-back/     # Express.js 백엔드 API
├── business-front/    # React 프론트엔드
└── README.md
```

## 🚀 시작하기

### 사전 요구사항

- Node.js (v18 이상)
- MongoDB (Docker 또는 로컬 설치)
- Docker & Docker Compose (선택사항)

### 백엔드 설정

```bash
cd business-back
npm install
cp .env.example .env  # 환경 변수 설정
npm start
```

### 프론트엔드 설정

```bash
cd business-front
npm install
npm run dev
```

### Docker를 사용한 실행

```bash
# MongoDB 실행
docker run -d --name mongodb -p 27018:27017 -v mongodb-data:/data/db mongo:6.0

# 백엔드 실행
docker build -t my-express-app business-back/
docker run -d --name express-container --network app-net -p 3000:3000 my-express-app

# 프론트엔드 빌드 및 실행
cd business-front
npm run build
docker build -t business-front:prod .
docker run -d --name react-nginx -p 80:80 business-front:prod
```

## 🔐 기본 계정

### 사업자 계정
- **이메일**: wow@hotel.com / 비밀번호: business1234
- **이메일**: korea@hotel.com / 비밀번호: business1234
- **이메일**: seoul@hotel.com / 비밀번호: business1234

## 📝 주요 기능

- 🏨 호텔 관리 (등록, 수정, 삭제)
- 🛏️ 객실 관리
- 📅 예약 관리
- 📊 대시보드 통계
- ⭐ 리뷰 관리
- 💰 정산 관리
- 📦 재고 관리

## 🛠️ 기술 스택

### Backend
- Express.js
- MongoDB (Mongoose)
- JWT 인증
- bcryptjs

### Frontend
- React
- Vite
- Axios
- React Router
- SCSS

## 📄 라이선스

MIT

