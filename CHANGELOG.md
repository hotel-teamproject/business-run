# 변경사항 정리 (Changelog)

## 📅 2025-12-03

### 🔐 인증 관련 수정

#### 프론트엔드
- **`business-front/src/components/layout/BusinessLayout.jsx`**
  - 인증 가드 추가: 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  - 로딩 상태 체크 추가

- **`business-front/src/api/axiosClient.js`**
  - 토큰 키 이름 통일: `businessToken` → `business_token`
  - 401 에러 시 리다이렉트 경로 수정: `/` → `/business/login`

- **`business-front/src/api/realBusinessApi.js`**
  - 로그인 API 경로 확인 및 유지: `/business/auth/login`

#### 백엔드
- **`business-back/server.js`**
  - 사업자 인증 라우트 등록: `/api/business/auth` → `adminAuthRoutes` (이미 구현됨)

---

### 📊 대시보드 통계 API 수정

#### 백엔드
- **`business-back/dashboard/dashboardController.js`**
  - 프론트엔드가 기대하는 응답 형태로 변경:
    - 필드명 변경: `totalBookings` → `bookingCount`, `monthlyBookings` → `monthlyBookingCount`
    - 추가된 필드: `averageRating`, `reviewCount`, `occupancyRate`, `chartData`, `recentBookings`, `recentReviews`
    - 응답 구조 변경: `{ success: true, data: {...} }` → 직접 데이터 객체 반환
  - 리뷰 통계 계산 로직 추가 (평균 평점, 리뷰 개수)
  - 객실 점유율 계산 로직 추가 (최근 30일 기준)
  - 차트 데이터 생성 로직 추가 (최근 6개월)
  - 최근 예약/리뷰 목록 조회 추가 (각 5개)

#### 프론트엔드
- **`business-front/src/components/business/dashboard/BusinessStatsCards.jsx`**
  - 방어 코드 추가: 모든 필드에 `|| 0` 기본값 적용
  - `toFixed()` 호출 전 `undefined` 체크

- **`business-front/src/App.jsx`**
  - 개발용 테스트 코드 제거: 404 에러를 발생시키던 `/api/hotels`, `/api/rooms` 호출 제거

---

### 🏨 호텔 관리 페이지 수정

#### 백엔드
- **`business-back/hotels/hotelController.js`**
  - `getMyHotels` 수정: 각 호텔에 통계 정보 추가
    - `roomCount`: 활성화된 객실 개수
    - `reviewCount`: 리뷰 총 개수
    - `averageRating`: 평균 평점 (소수점 첫째 자리까지)

#### 프론트엔드
- **`business-front/src/pages/business/BusinessHotelListPage.jsx`**
  - 방어 코드 추가: `averageRating`, `reviewCount`, `roomCount`에 `|| 0` 기본값 적용

---

### 📅 예약 관리 페이지 수정

#### 백엔드
- **`business-back/bookings/bookingController.js`**
  - `getMyReservations` 수정: 프론트엔드가 기대하는 형태로 변환
    - `reservationNumber`: 예약번호 생성 (ID의 마지막 8자리)
    - `hotelName`: 호텔 이름 (populate)
    - `roomName`: 객실 이름 (populate)
    - `startDate`, `endDate`: 날짜 형식 변환

#### 프론트엔드
- **`business-front/src/pages/business/BusinessReservationListPage.jsx`**
  - 방어 코드 추가: 모든 필드에 기본값 적용

---

### ⭐ 리뷰 관리 기능 추가

#### 백엔드 (신규 생성)
- **`business-back/reviews/businessReviewController.js`** (신규)
  - `getReviews`: 사업자 소유 호텔의 리뷰 목록 조회
  - `getReviewById`: 리뷰 상세 조회
  - `replyToReview`: 리뷰 답변 작성

- **`business-back/reviews/businessReviewRoutes.js`** (신규)
  - 사업자 리뷰 API 라우트 등록

- **`business-back/reviews/Review.js`**
  - `reply` 필드 추가 (답변 내용, 작성자 ID, 작성일시)

- **`business-back/server.js`**
  - 사업자 리뷰 라우트 등록: `/api/business/reviews`

---

### 📈 통계 페이지 기능 추가

#### 백엔드 (신규 생성)
- **`business-back/stats/businessStatsController.js`** (신규)
  - `getStatistics`: 사업자 통계 조회
    - `revenue.total/monthly/daily`: 매출 통계
    - `bookings.total/monthly/daily`: 예약 건수 통계
    - `occupancy.rate/totalRooms/bookedRooms`: 객실 점유율 통계

- **`business-back/stats/businessStatsRoutes.js`** (신규)
  - 사업자 통계 API 라우트 등록

- **`business-back/server.js`**
  - 사업자 통계 라우트 등록: `/api/business/statistics`

---

### 🐳 Docker 배포 설정

#### 신규 파일
- **`docker-compose.yml`** (루트)
  - MongoDB, Backend, Frontend 서비스 정의
  - 네트워크 및 볼륨 설정

- **`business-back/Dockerfile`**
  - Node.js 20-alpine 기반 이미지
  - 프로덕션 의존성 설치
  - 포트 8080 노출

- **`business-back/.dockerignore`**
  - 빌드 시 제외할 파일 목록

- **`.dockerignore`** (루트)
  - 전체 프로젝트 빌드 시 제외할 파일 목록

- **`DOCKER_SETUP.md`**
  - Docker 배포 가이드 문서

#### 수정 파일
- **`business-front/nginx.conf`**
  - 백엔드 프록시 포트 수정: `3000` → `8080`
  - 프록시 헤더 설정 추가

---

### 🗄️ 데이터베이스 초기화

#### 신규 파일
- **`business-back/init-data.js`**
  - MongoDB 초기 데이터 삽입 스크립트
  - 사용자 3명 생성 (wow@hotel.com, korea@hotel.com, seoul@hotel.com)
  - 호텔 3개, 객실 9개, 예약 1개, 리뷰 1개 생성
  - 비밀번호: `business1234` (bcrypt 해시 포함)

---

## 📝 주요 변경 요약

### 백엔드
1. ✅ API 응답 형태를 프론트엔드 기대 형태로 통일
2. ✅ 누락된 통계 필드 추가 (평균 평점, 리뷰 개수, 점유율 등)
3. ✅ 리뷰 및 통계 API 컨트롤러/라우트 신규 생성
4. ✅ Docker 배포 환경 구성

### 프론트엔드
1. ✅ 인증 가드 추가 (로그인 체크)
2. ✅ 방어 코드 추가 (undefined 에러 방지)
3. ✅ 토큰 키 이름 통일
4. ✅ 불필요한 테스트 코드 제거

### 인프라
1. ✅ Docker Compose 설정 완료
2. ✅ MongoDB 영구 저장소 설정
3. ✅ Nginx 프록시 설정
4. ✅ 초기 데이터 스크립트 작성

---

## 🚀 실행 방법

### Docker로 전체 실행
```bash
# 1. 프론트엔드 빌드
cd business-front && npm run build && cd ..

# 2. Docker Compose 실행
docker-compose up -d

# 3. 초기 데이터 삽입 (선택)
docker cp business-back/init-data.js mongodb:/tmp/init-data.js
docker exec mongodb mongosh business-back --file /tmp/init-data.js
```

### 접속 URL
- 프론트엔드: http://localhost
- 백엔드 API: http://localhost:8080/api
- MongoDB: localhost:27018

### 테스트 계정
- 이메일: `wow@hotel.com` / 비밀번호: `business1234`
- 이메일: `korea@hotel.com` / 비밀번호: `business1234`
- 이메일: `seoul@hotel.com` / 비밀번호: `business1234`

