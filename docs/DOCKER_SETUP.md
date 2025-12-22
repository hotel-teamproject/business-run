# Docker 배포 가이드

## 📋 사전 준비

1. Docker 및 Docker Compose 설치 확인
   ```bash
   docker --version
   docker-compose --version
   ```

2. 프론트엔드 빌드
   ```bash
   cd business-front
   npm install
   npm run build
   ```

## 🚀 실행 방법

### 1. 전체 서비스 한 번에 실행 (권장)

```bash
# 프로젝트 루트에서
docker-compose up -d
```

### 2. 단계별 실행

```bash
# 1. MongoDB 실행
docker-compose up -d mongodb

# 2. 백엔드 실행
docker-compose up -d backend

# 3. 프론트엔드 실행
docker-compose up -d frontend
```

## 📊 서비스 확인

### 실행 중인 컨테이너 확인
```bash
docker-compose ps
```

### 로그 확인
```bash
# 전체 로그
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 접속 URL
- **프론트엔드**: http://localhost
- **백엔드 API**: http://localhost:8080/api
- **MongoDB**: localhost:27018

## 🛠️ 유용한 명령어

### 컨테이너 재시작
```bash
# 전체 재시작
docker-compose restart

# 특정 서비스만 재시작
docker-compose restart backend
```

### 컨테이너 중지
```bash
docker-compose stop
```

### 컨테이너 삭제 (데이터 유지)
```bash
docker-compose down
```

### 컨테이너 + 볼륨 삭제 (데이터 삭제)
```bash
docker-compose down -v
```

### 이미지 다시 빌드
```bash
# 전체 재빌드
docker-compose build --no-cache

# 특정 서비스만 재빌드
docker-compose build --no-cache backend
docker-compose build --no-cache frontend
```

### MongoDB 접속
```bash
docker exec -it mongodb mongosh
```

### MongoDB 데이터 초기화
```bash
# MongoDB 컨테이너에 init-data.js 복사
docker cp business-back/init-data.js mongodb:/tmp/init-data.js

# 실행
docker exec -it mongodb mongosh business-back --file /tmp/init-data.js
```

## 🔧 개발 모드

### 백엔드 개발 모드 (nodemon)
`business-back/package.json`의 `start` 스크립트가 nodemon을 사용하도록 설정되어 있으면, 
Docker 볼륨 마운트로 소스 코드 변경 시 자동 재시작 가능합니다.

```yaml
# docker-compose.yml에서 volumes 주석 해제
volumes:
  - ./business-back:/app
  - /app/node_modules
```

### 프론트엔드 개발 모드
개발 시에는 `Dockerfile.dev`를 사용하거나, 로컬에서 `npm run dev` 실행 후 
Nginx만 Docker로 실행할 수 있습니다.

## 📝 환경 변수 수정

백엔드 환경 변수는 `docker-compose.yml`의 `backend` 서비스 `environment` 섹션에서 수정하세요.

```yaml
environment:
  - PORT=8080
  - MONGODB_URI=mongodb://mongodb:27017/business-back
  - JWT_SECRET=your-secret-key-here-change-in-production
```

## 🐛 문제 해결

### 포트가 이미 사용 중일 때
```bash
# 포트 확인
lsof -i :80
lsof -i :8080
lsof -i :27018

# docker-compose.yml에서 포트 변경
```

### MongoDB 연결 오류
- MongoDB 컨테이너가 실행 중인지 확인: `docker-compose ps`
- MongoDB 로그 확인: `docker-compose logs mongodb`

### 프론트엔드 빌드 오류
- `dist` 폴더가 있는지 확인
- 빌드 명령 실행: `cd business-front && npm run build`

