# Business Run - 호텔 예약 관리 시스템

MERN 스택(MongoDB, Express, React, Node.js)으로 구축된 호텔 예약 관리 시스템입니다.

## 📋 프로젝트 구조

```
business-run/
├── business-back/     # Express.js 백엔드 API
├── business-front/    # React 프론트엔드
├── docker-compose.yml # Docker Compose 설정
└── README.md
```

## 🚀 빠른 시작 (Docker 사용)

### 사전 요구사항
- Docker 및 Docker Compose 설치
- Node.js (프론트엔드 빌드용)

### 실행 방법

1. **프론트엔드 빌드**
   ```bash
   cd business-front
   npm install
   npm run build
   cd ..
   ```

2. **Docker Compose로 전체 실행**
   ```bash
   docker-compose up -d
   ```

3. **초기 데이터 삽입 (선택사항)**
   ```bash
   docker cp business-back/init-data.js mongodb:/tmp/init-data.js
   docker exec mongodb mongosh business-back --file /tmp/init-data.js
   ```

4. **접속**
   - 프론트엔드: http://localhost
   - 백엔드 API: http://localhost:8080/api
   - MongoDB: localhost:27018

### 테스트 계정

초기 데이터를 삽입했다면 다음 계정으로 로그인할 수 있습니다:

- **이메일**: `wow@hotel.com` / 비밀번호: `business1234`
- **이메일**: `korea@hotel.com` / 비밀번호: `business1234`
- **이메일**: `seoul@hotel.com` / 비밀번호: `business1234`

## 🛠️ 개발 환경 설정

### 백엔드 로컬 실행

```bash
cd business-back
npm install

# .env 파일 생성 (선택사항, docker-compose.yml의 환경 변수 사용)
# PORT=8080
# MONGODB_URI=mongodb://localhost:27018/business-back
# JWT_SECRET=your-secret-key-here
# JWT_EXPIRE=7d

npm start
```

### 프론트엔드 로컬 실행

```bash
cd business-front
npm install
npm run dev
```

## 📦 Docker 명령어

### 전체 서비스 관리
```bash
# 실행
docker-compose up -d

# 중지
docker-compose stop

# 재시작
docker-compose restart

# 로그 확인
docker-compose logs -f

# 컨테이너 삭제 (데이터 유지)
docker-compose down

# 컨테이너 + 볼륨 삭제 (데이터 삭제)
docker-compose down -v
```

### 개별 서비스 관리
```bash
# 특정 서비스만 재시작
docker-compose restart backend
docker-compose restart frontend

# 특정 서비스 로그 확인
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 이미지 재빌드
```bash
# 전체 재빌드
docker-compose build --no-cache

# 특정 서비스만 재빌드
docker-compose build --no-cache backend
docker-compose build --no-cache frontend
```

## 🗄️ MongoDB 관리

### MongoDB 접속
```bash
docker exec -it mongodb mongosh business-back
```

### 초기 데이터 삽입
```bash
docker cp business-back/init-data.js mongodb:/tmp/init-data.js
docker exec mongodb mongosh business-back --file /tmp/init-data.js
```

### 데이터베이스 백업/복원
```bash
# 백업
docker exec mongodb mongodump --out /data/backup --db business-back
docker cp mongodb:/data/backup ./backup

# 복원
docker cp ./backup mongodb:/data/backup
docker exec mongodb mongorestore /data/backup
```

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
- Node.js / Express.js
- MongoDB (Mongoose)
- JWT 인증
- bcryptjs

### Frontend
- React
- Vite
- Axios
- React Router
- SCSS

### Infrastructure
- Docker & Docker Compose
- Nginx
- MongoDB 6.0

## 📄 라이선스

MIT

## 📚 추가 문서

- [Docker 배포 가이드](DOCKER_SETUP.md)
- [변경사항 정리](CHANGELOG.md)

