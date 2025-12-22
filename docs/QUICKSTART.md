# 🚀 빠른 시작 가이드

이 문서는 프로젝트를 처음 받은 사람이 바로 실행하는 방법을 설명합니다.

## 1단계: 사전 준비

다음이 설치되어 있어야 합니다:
- ✅ Docker Desktop (또는 Docker + Docker Compose)
- ✅ Node.js (프론트엔드 빌드용, v18 이상 권장)

설치 확인:
```bash
docker --version
docker-compose --version
node --version
npm --version
```

## 2단계: 프로젝트 클론 및 이동

```bash
git clone <repository-url>
cd business-run
```

## 3단계: 프론트엔드 빌드

**⚠️ 중요**: Docker 이미지를 빌드하기 전에 프론트엔드를 먼저 빌드해야 합니다.

```bash
cd business-front
npm install
npm run build
cd ..
```

빌드가 완료되면 `business-front/dist` 폴더가 생성됩니다.

## 4단계: Docker Compose 실행

```bash
docker-compose up -d
```

이 명령어는 다음을 수행합니다:
- MongoDB 컨테이너 실행 (포트 27018)
- Backend 컨테이너 빌드 및 실행 (포트 8080)
- Frontend 컨테이너 빌드 및 실행 (포트 80)

## 5단계: 실행 확인

### 컨테이너 상태 확인
```bash
docker-compose ps
```

모든 컨테이너가 "Up" 상태여야 합니다:
```
NAME                STATUS
express-container   Up
mongodb             Up
react-nginx         Up
```

### 로그 확인
```bash
docker-compose logs -f
```

백엔드 로그에서 "MongoDB 연결 성공" 메시지를 확인하세요.

## 6단계: 초기 데이터 삽입 (선택사항)

테스트 계정과 샘플 데이터를 넣으려면:

```bash
docker cp business-back/init-data.js mongodb:/tmp/init-data.js
docker exec mongodb mongosh business-back --file /tmp/init-data.js
```

## 7단계: 접속

브라우저에서 다음 URL로 접속:
- **프론트엔드**: http://localhost
- **백엔드 API**: http://localhost:8080/api

### 테스트 계정으로 로그인
초기 데이터를 삽입했다면:
- 이메일: `wow@hotel.com`
- 비밀번호: `business1234`

## ❗ 문제 해결

### 포트가 이미 사용 중일 때

**포트 80이 사용 중**:
```bash
# docker-compose.yml에서 포트 변경
ports:
  - "8080:80"  # 8080으로 변경
```

**포트 8080이 사용 중**:
```bash
# docker-compose.yml에서 포트 변경
ports:
  - "3001:8080"  # 3001로 변경
```

**포트 27018이 사용 중**:
```bash
# docker-compose.yml에서 포트 변경
ports:
  - "27019:27017"  # 27019로 변경
```

### 프론트엔드 빌드 오류

```bash
cd business-front
rm -rf node_modules package-lock.json
npm install
npm run build
```

### MongoDB 연결 오류

```bash
# MongoDB 로그 확인
docker-compose logs mongodb

# MongoDB 재시작
docker-compose restart mongodb
```

### 컨테이너 이름 충돌

```bash
# 기존 컨테이너 제거
docker stop mongodb express-container react-nginx
docker rm mongodb express-container react-nginx

# 다시 실행
docker-compose up -d
```

## 🔄 코드 변경 후 재빌드

### 백엔드 코드 변경 시
```bash
docker-compose restart backend
# 또는
docker-compose up -d --build backend
```

### 프론트엔드 코드 변경 시
```bash
cd business-front
npm run build
cd ..
docker-compose up -d --build frontend
```

## 🛑 중지 및 정리

### 서비스 중지
```bash
docker-compose stop
```

### 서비스 중지 + 컨테이너 삭제
```bash
docker-compose down
```

### 서비스 중지 + 컨테이너 + 볼륨 삭제 (모든 데이터 삭제)
```bash
docker-compose down -v
```

## 📞 추가 도움말

자세한 내용은 다음 문서를 참고하세요:
- [README.md](README.md) - 전체 문서
- [DOCKER_SETUP.md](DOCKER_SETUP.md) - Docker 상세 가이드
- [CHANGELOG.md](CHANGELOG.md) - 변경사항 정리

