# 개인 기여도 및 역할 수행 보고서

## 📋 개인 담당 역할

### 담당 사이트

- **Business (사업자) 사이트** - Frontend & Backend 통합 개발

### 주요 역할

1. **Backend API 구현** (프론트엔드에서 호출하지만 백엔드에 없던 엔드포인트)
2. **Frontend-Backend API 연동** (기존 프론트엔드에 백엔드 API 연결)
3. **데이터 불일치 해결 및 필드 매핑** (프론트-백엔드 간 데이터 구조 통일)
4. **데이터베이스 스키마 개선** (누락된 필드 추가)
5. **기존 UI에 기능 추가 및 개선** (삭제 버튼, 이미지 입력, 스타일 개선)

---

## 1️⃣ 개인 담당 역할 명확성

### 1.1 Frontend-Backend API 통합

#### 작업 내용

- 프론트엔드에서 호출하지만 백엔드에 없던 엔드포인트 구현
- 백엔드에 존재하지만 프론트엔드에서 미사용 엔드포인트 통합
- API 응답 데이터 구조와 프론트엔드 기대 형식 간 매핑 처리

#### 담당 기능 목록

**Backend API 구현:**

1. `POST /api/business/auth/apply` - 사업자 회원가입
2. `DELETE /api/business/rooms/:roomId` - 객실 삭제 (소프트 삭제)
3. `GET /api/business/inventory/price-policies` - 가격 정책 조회
4. `PUT /api/business/reservations/:id/status` - 예약 상태 변경 (PATCH → PUT 수정)
5. `POST /api/business/reservations/:id/cancel` - 예약 취소
6. `GET /api/business/statistics/revenue-chart` - 매출 차트 데이터
7. `GET /api/business/settlements/:id` - 정산 상세 조회
8. `PUT /api/business/reviews/:id/reply` - 리뷰 답변 수정
9. `DELETE /api/business/reviews/:id/reply` - 리뷰 답변 삭제

**Frontend 연동 및 기능 추가:**

1. 사업자 회원가입 폼에 비밀번호 필드 추가 및 API 연동
2. 객실 관리 페이지에 삭제 버튼 및 기능 추가
3. 예약 상세 페이지에 취소 버튼 및 기능 추가
4. 정산 상세보기 페이지 신규 생성
5. 비밀번호 변경 페이지 신규 생성
6. 리뷰 답변 수정/삭제 UI 추가
7. 호텔/객실 이미지 입력 필드 추가

### 1.2 데이터 불일치 해결

#### 작업 내용

- 프론트엔드와 백엔드 간 데이터 필드명 불일치 해결
- MongoDB 스키마와 프론트엔드 기대 형식 간 매핑 처리
- API 응답 데이터 변환 로직 구현

#### 주요 해결 사항

1. **리뷰 데이터 필드 매핑**

   - `authorName` → `userName`
   - `comment` → `content`
   - `reply.createdAt` 날짜 형식 변환

2. **프로필 페이지 필드 매핑**

   - `businessName`: 호텔의 `name` 필드 사용
   - `ownerName`: User의 `name` 필드 사용
   - `businessPhone`: User의 `phone` 필드 사용
   - `businessAddress`: 호텔의 `address` 필드 사용
   - `isApproved`: User의 `isActive` 필드 매핑

3. **호텔/객실 필드 매핑**
   - 호텔: `nameEn`, `country`, `phone`, `email` 필드 추가
   - 객실: `roomSize` 필드 추가
   - `capacityMin`/`capacityMax` ↔ `capacity` 매핑
   - `nameEn` ↔ `type` 매핑

### 1.3 데이터베이스 스키마 개선

#### 작업 내용

- 호텔 스키마에 누락된 필드 추가
- 객실 스키마에 누락된 필드 추가
- 기존 데이터와의 호환성 유지

#### 스키마 변경 사항

**Hotel 스키마 (`business-back/hotels/Hotel.js`):**

```javascript
nameEn: { type: String },        // 호텔명(영문)
country: { type: String, default: '대한민국' },  // 국가
phone: { type: String },         // 연락처
email: { type: String }          // 이메일
```

**Room 스키마 (`business-back/rooms/Room.js`):**

```javascript
roomSize: {
  type: String;
} // 객실 크기
```

### 1.4 사용자 경험(UX) 개선

#### 작업 내용

1. **이미지 표시 및 입력 기능**

   - 호텔/객실 이미지 URL 입력 필드 추가
   - 이미지 미리보기 기능
   - 이미지 삭제 기능
   - 이미지 로드 실패 시 플레이스홀더 표시

2. **UI 정렬 및 스타일 개선**

   - 편의시설 체크박스 왼쪽 정렬
   - 리뷰 관리 버튼 높이 통일
   - 대시보드 차트 제목과 그래프 간격 조정

3. **CRUD 기능 완성**
   - 호텔/객실 수정 시 기존 데이터 표시
   - 소프트 삭제(`isActive` 플래그) 구현
   - 필터링 기능 개선 (예약 상태별 필터)

---

## 2️⃣ 개인 기능 구현 기여도

### 2.1 Backend 구현 파일

#### 수정/추가된 파일 목록

1. **`business-back/auth/authController.js`**

   - `applyBusiness`: 사업자 회원가입 로직
   - `getMyInfo`: 프로필 정보 조회 (필드 매핑 추가)
   - `login`: 로그인 응답에 호텔 정보 포함

2. **`business-back/auth/authRoutes.js`**

   - `POST /api/business/auth/apply` 라우트 추가

3. **`business-back/rooms/roomController.js`**

   - `deleteRoom`: 객실 소프트 삭제
   - `getRoomById`: 필드 매핑 추가 (`nameEn`, `roomSize`, `capacityMin/Max`)
   - `getRoomsByHotel`: 필드 매핑 추가
   - `createRoom`: 이미지 필터링 및 필드 매핑
   - `updateRoom`: 필드 매핑 및 `isActive` 필터 추가

4. **`business-back/rooms/roomRoutes.js`**

   - `DELETE /api/business/rooms/:roomId` 라우트 추가

5. **`business-back/hotels/hotelController.js`**

   - `getHotelById`: 필드 매핑 추가 (`nameEn`, `country`, `phone`, `email`)
   - `getMyHotels`: 필드 매핑 추가
   - `createHotel`: 이미지 필터링 및 필드 매핑
   - `updateHotel`: 필드 매핑 및 `isActive` 필터 추가

6. **`business-back/hotels/Hotel.js`**

   - 스키마에 `nameEn`, `country`, `phone`, `email` 필드 추가

7. **`business-back/rooms/Room.js`**

   - 스키마에 `roomSize` 필드 추가

8. **`business-back/bookings/bookingController.js`**

   - `getMyReservations`: 상태별 필터링 기능 추가
   - `cancelReservation`: 예약 취소 로직

9. **`business-back/bookings/bookingRoutes.js`**

   - `POST /api/business/reservations/:id/cancel` 라우트 추가

10. **`business-back/reviews/businessReviewController.js`**

    - `updateReply`: 리뷰 답변 수정
    - `deleteReply`: 리뷰 답변 삭제
    - `replyToReview`: 답변 생성 (기존)

11. **`business-back/reviews/businessReviewRoutes.js`**

    - `PUT /api/business/reviews/:id/reply` 라우트 추가
    - `DELETE /api/business/reviews/:id/reply` 라우트 추가

12. **`business-back/inventory/inventoryController.js`**

    - `getPricePolicies`: 가격 정책 조회

13. **`business-back/inventory/inventoryRoutes.js`**

    - `GET /api/business/inventory/price-policies` 라우트 추가

14. **`business-back/stats/businessStatsController.js`**

    - `getRevenueChart`: 매출 차트 데이터 조회

15. **`business-back/stats/businessStatsRoutes.js`**

    - `GET /api/business/statistics/revenue-chart` 라우트 추가

16. **`business-back/settlements/settlementController.js`**

    - `getSettlementById`: 정산 상세 조회

17. **`business-back/settlements/settlementRoutes.js`**

    - `GET /api/business/settlements/:id` 라우트 추가

18. **`business-back/dashboard/dashboardController.js`**

    - 리뷰 필드명 매핑 수정 (`authorName` → `userName`, `comment` → `content`)

19. **`business-back/init-business-data.js`**
    - 데이터 시드 스크립트 수정 (필드 매핑에 맞춰 조정)

### 2.2 Frontend 수정 및 연동 작업

> **참고**: 프론트엔드는 이미 구성되어 있었으며, 본인은 기존 프론트엔드에 백엔드 API 연동 및 일부 UI 개선 작업을 수행했습니다.

#### 수정/추가된 파일 목록

**1. API 클라이언트 연동**

1. **`business-front/src/api/realBusinessApi.js`**

   - 기존 API 클라이언트에 신규 백엔드 엔드포인트 연동
   - `applyBusiness`: 사업자 회원가입 API 연동
   - `deleteRoom`: 객실 삭제 API 연동
   - `getPricePolicies`: 가격 정책 조회 API 연동
   - `updateReservationStatus`: 예약 상태 변경 (PATCH → PUT 수정)
   - `cancelReservation`: 예약 취소 API 연동
   - `getRevenueChart`: 매출 차트 데이터 API 연동
   - `getSettlementById`: 정산 상세 조회 API 연동
   - `updateReply`: 리뷰 답변 수정 API 연동
   - `deleteReply`: 리뷰 답변 삭제 API 연동

2. **`business-front/src/api/businessApi.js`**
   - 신규 API들의 mock 데이터 및 fallback 로직 추가
   - 기존 API 래퍼에 신규 메서드 통합

**2. 기존 페이지에 기능 추가**

3. **`business-front/src/pages/auth/BusinessSignupForm.jsx`**

   - 기존 회원가입 폼에 비밀번호 및 비밀번호 확인 필드 추가
   - `applyBusiness` API 연동 (기존에는 미연동 상태였음)
   - 클라이언트 사이드 유효성 검사 강화

4. **`business-front/src/pages/business/BusinessRoomManagePage.jsx`**

   - 객실 삭제 버튼 및 기능 추가 (기존에는 삭제 기능 없음)
   - 삭제 확인 다이얼로그 구현
   - 이미지 로드 실패 시 플레이스홀더 표시 기능 추가

5. **`business-front/src/pages/business/BusinessReservationDetailPage.jsx`**

   - 예약 취소 버튼 및 기능 추가 (기존에는 취소 기능 없음)
   - 취소 사유 입력 및 확인 다이얼로그 구현

6. **`business-front/src/pages/business/BusinessSettlementPage.jsx`**

   - 정산 상세보기 버튼 추가 (기존에는 상세보기 기능 없음)

7. **`business-front/src/pages/business/BusinessProfilePage.jsx`**

   - 프로필 정보 필드 매핑 수정 (백엔드 응답 데이터와 매핑)
   - 비밀번호 변경 버튼 추가

8. **`business-front/src/pages/business/BusinessReviewListPage.jsx`**

   - 리뷰 답변 수정/삭제 UI 추가 (기존에는 답변만 작성 가능)
   - 답변 작성/수정 폼 조건부 렌더링 로직 개선
   - 버튼 높이 통일 (`btn-xs` → `btn-sm`)

9. **`business-front/src/pages/business/BusinessReviewDetailPage.jsx`**

   - 리뷰 답변 수정/삭제 UI 추가
   - 답변 작성/수정 폼 조건부 렌더링 로직 개선

10. **`business-front/src/pages/business/BusinessHotelCreatePage.jsx`**

    - 이미지 URL 입력 필드 추가 (기존에는 이미지 입력 기능 없음)
    - 이미지 미리보기 및 삭제 기능 구현

11. **`business-front/src/pages/business/BusinessHotelEditPage.jsx`**

    - 이미지 URL 입력 필드 추가 (기존에는 이미지 수정 기능 없음)
    - 이미지 미리보기 및 삭제 기능 구현
    - 기존 이미지 로드 및 표시 기능

12. **`business-front/src/pages/business/BusinessRoomCreatePage.jsx`**
    - 이미지 URL 입력 필드 추가 (기존에는 이미지 입력 기능 없음)
    - 이미지 미리보기 및 삭제 기능 구현

**3. 신규 페이지 생성**

13. **`business-front/src/pages/business/BusinessSettlementDetailPage.jsx`** (신규 생성)

    - 정산 상세 정보 표시 페이지 전체 구현
    - 정산 상세 데이터 조회 및 표시

14. **`business-front/src/pages/business/BusinessChangePasswordPage.jsx`** (신규 생성)
    - 비밀번호 변경 페이지 전체 구현
    - 현재 비밀번호 확인 및 새 비밀번호 변경 기능

**4. 라우팅 및 컴포넌트 수정**

15. **`business-front/src/router/businessRoutes.jsx`**

    - 정산 상세보기 라우트 추가
    - 비밀번호 변경 라우트 추가

16. **`business-front/src/components/business/dashboard/BusinessChartArea.jsx`**
    - 차트 바 너비 고정 로직 개선 (최대 6개 기준)
    - 빈 막대 추가 로직으로 일관된 UI 유지

**5. 스타일 개선**

17. **`business-front/src/styles/business.scss`**
    - 편의시설 체크박스 정렬 개선 (왼쪽 정렬, 체크박스 크기 최적화)
    - 대시보드 차트 제목과 그래프 간격 조정
    - 리뷰 관리 버튼 스타일 통일 (높이 일치)

---

## 3️⃣ 개인 기술 이해도

### 3.1 구현 흐름 및 기술 선택 이유

#### 3.1.1 Frontend-Backend API 통합

**구현 흐름:**

1. 프론트엔드에서 호출하는 API 목록 확인
2. 백엔드에 존재하지 않는 엔드포인트 식별
3. 백엔드 컨트롤러 및 라우트 구현
4. 프론트엔드 API 클라이언트에 메서드 추가
5. UI 컴포넌트에 API 연동

**기술 선택 이유:**

- **RESTful API 설계**: 표준 HTTP 메서드(GET, POST, PUT, DELETE) 사용으로 일관성 유지
- **Axios 클라이언트**: 인터셉터를 통한 인증 토큰 자동 추가 및 에러 처리
- **Mock API Fallback**: 개발 환경에서 백엔드 미구현 시에도 프론트엔드 개발 가능

#### 3.1.2 데이터 필드 매핑

**구현 흐름:**

1. 프론트엔드 기대 데이터 구조 분석
2. 백엔드 스키마와 비교하여 불일치 필드 식별
3. 컨트롤러에서 응답 데이터 변환 로직 구현
4. 스키마에 필드 추가 또는 매핑 로직 추가

**기술 선택 이유:**

- **컨트롤러 레벨 매핑**: 스키마 변경 없이 프론트엔드 요구사항 충족
- **점진적 스키마 개선**: 기존 데이터 호환성 유지하면서 새 필드 추가
- **명시적 필드 변환**: `toObject()` 후 필드 추가/변경으로 안전한 데이터 변환

#### 3.1.3 소프트 삭제 (Soft Delete)

**구현 흐름:**

1. `isActive` 플래그를 사용한 논리적 삭제
2. 조회 시 `isActive: true` 필터 적용
3. 삭제 시 실제 데이터 삭제 대신 `isActive: false` 설정

**기술 선택 이유:**

- **데이터 무결성**: 관련 데이터(예약, 리뷰 등)와의 참조 무결성 유지
- **복구 가능성**: 실수로 삭제한 경우 복구 가능
- **성능**: 실제 삭제보다 빠른 처리

#### 3.1.4 이미지 URL 관리

**구현 흐름:**

1. 이미지 URL 배열을 상태로 관리
2. URL 입력 필드 동적 추가/삭제
3. 이미지 미리보기 및 로드 실패 처리
4. 빈 문자열 필터링하여 DB 저장

**기술 선택 이유:**

- **URL 기반 저장**: 파일 업로드 인프라 없이 빠른 구현
- **배열 관리**: 여러 이미지 URL을 배열로 저장하여 유연성 확보
- **에러 핸들링**: `onError` 이벤트로 로드 실패 시 플레이스홀더 표시

### 3.2 문제 해결 과정

#### 문제 1: 리뷰 데이터가 표시되지 않음

**원인 분석:**

- 프론트엔드: `userName`, `content` 기대
- 백엔드: `authorName`, `comment` 반환

**해결 방법:**

- 컨트롤러에서 필드명 변환 로직 추가
- `reply.createdAt` 날짜 형식 변환 (Date → String)

#### 문제 2: 호텔/객실 수정 시 기존 데이터가 표시되지 않음

**원인 분석:**

- 스키마에 필드가 없어 DB에 저장되지 않음
- 프론트엔드가 기대하는 필드가 백엔드 응답에 없음

**해결 방법:**

1. 스키마에 필드 추가 (`nameEn`, `country`, `phone`, `email`, `roomSize`)
2. 컨트롤러에서 필드 매핑 로직 추가
3. `getHotelById`, `getRoomById`에서 프론트엔드 형식으로 변환

#### 문제 3: CRUD 작업이 DB에 반영되지 않음

**원인 분석:**

- 프론트엔드에서 보내는 필드가 스키마에 없음
- `isActive` 필터가 없어 삭제된 항목도 조회됨

**해결 방법:**

1. 컨트롤러에서 허용된 필드만 업데이트
2. 모든 조회 쿼리에 `isActive: true` 필터 추가
3. 소프트 삭제 로직 구현

#### 문제 4: 예약 상태 필터링이 작동하지 않음

**원인 분석:**

- `getMyReservations`에서 `req.query.status` 파라미터를 사용하지 않음

**해결 방법:**

- 쿼리 파라미터를 확인하여 필터 조건에 추가

---

## 4️⃣ 협업 및 문서화

### 4.1 GitHub 커밋 전략

**커밋 메시지 규칙:**

- `feat: 새로운 기능 추가`
- `fix: 버그 수정`
- `refactor: 코드 리팩토링`
- `style: UI/UX 개선`
- `docs: 문서 수정`

**예시 커밋:**

```
feat: 사업자 회원가입 API 구현
fix: 리뷰 데이터 필드 매핑 수정
feat: 객실 삭제 기능 추가 (소프트 삭제)
style: 편의시설 체크박스 정렬 개선
refactor: 호텔/객실 필드 매핑 로직 개선
```

### 4.2 코드 리뷰 및 품질 관리

**주요 개선 사항:**

1. **에러 처리**: try-catch 블록과 적절한 HTTP 상태 코드 사용
2. **로깅**: `console.log`를 통한 디버깅 정보 기록
3. **유효성 검사**: 프론트엔드와 백엔드 양쪽에서 입력 검증
4. **코드 일관성**: 네이밍 컨벤션 및 코드 스타일 통일

### 4.3 문서화

**주요 문서:**

1. **API 엔드포인트 문서**: 각 엔드포인트의 요청/응답 형식
2. **필드 매핑 문서**: 프론트엔드-백엔드 간 필드 매핑 관계
3. **스키마 변경 이력**: 데이터베이스 스키마 변경 사항

---

## 📊 기여도 요약

### Backend

- **신규 API 엔드포인트**: 9개
- **수정된 컨트롤러**: 10개
- **스키마 변경**: 2개 (Hotel, Room)

### Frontend (기존 구성에 연동 및 개선)

- **신규 페이지**: 2개 (정산 상세보기, 비밀번호 변경)
- **기존 페이지 수정**: 12개 (API 연동 및 기능 추가)
- **API 클라이언트 연동**: 9개 신규 엔드포인트
- **UI 개선**: 3개 (이미지 입력 필드 추가, 버튼 정렬, 체크박스 정렬)

### 주요 성과

1. ✅ 프론트엔드-백엔드 API 통합 완료
2. ✅ 데이터 불일치 문제 해결
3. ✅ 누락된 CRUD 기능 구현
4. ✅ 사용자 경험 개선
5. ✅ 데이터베이스 스키마 개선

---

## 🔗 관련 링크

### GitHub

- Repository: [프로젝트 저장소 링크]
- 주요 커밋: [커밋 링크들]
- Pull Request: [PR 링크들]

### Notion

- 기여도 문서: [Notion 문서 링크]

---

## 📝 참고 사항

- 모든 변경사항은 기존 기능과의 호환성을 유지하면서 진행되었습니다.
- 데이터베이스 마이그레이션은 필요하지 않았으며, 기존 데이터는 기본값으로 처리됩니다.
- 프론트엔드와 백엔드 간의 API 통신은 RESTful 원칙을 따릅니다.
