# 백엔드에 존재하지만 프론트엔드에서 사용하지 않는 엔드포인트

## 🔍 발견된 미사용 엔드포인트

### 1. 대시보드 차트 API ⚠️

**백엔드 엔드포인트**: `GET /api/business/dashboard/chart`
- **파일**: `business-back/dashboard/dashboardController.js` (getRevenueChart 함수)
- **라우트**: `business-back/dashboard/dashboardRoutes.js`
- **기능**: 매출 차트 데이터 조회 (period 파라미터: month, week, year)
- **프론트엔드 상태**: ❌ 사용하지 않음
- **대안**: 프론트엔드는 `/business/statistics/revenue/chart`를 호출하려고 하지만, 백엔드에는 `/business/dashboard/chart`만 존재

**비고**: 프론트엔드의 `realBusinessStatsApi.getRevenueChart`는 `/business/statistics/revenue/chart`를 호출하지만, 실제 백엔드 경로는 `/business/dashboard/chart`입니다.

---

### 2. 비밀번호 변경 API ⚠️

**백엔드 엔드포인트**: `PUT /api/business/auth/password`
- **파일**: `business-back/auth/authController.js` (changePassword 함수)
- **라우트**: `business-back/auth/authRoutes.js`
- **기능**: 현재 비밀번호 확인 후 새 비밀번호로 변경
- **프론트엔드 상태**: ❌ 사용하지 않음

**요청 본문**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

---

### 3. 비밀번호 재설정 요청 API ⚠️

**백엔드 엔드포인트**: `POST /api/business/auth/forgot-password`
- **파일**: `business-back/auth/authController.js` (forgotPassword 함수)
- **라우트**: `business-back/auth/authRoutes.js`
- **기능**: 비밀번호 재설정 요청 (현재는 성공 응답만 반환, 실제 이메일 발송 미구현)
- **프론트엔드 상태**: ❌ 사용하지 않음

**요청 본문**:
```json
{
  "email": "string"
}
```

---

### 4. 예약 취소 API (라우트 누락) ❌

**백엔드 컨트롤러**: `POST /api/business/reservations/:id/cancel`
- **파일**: `business-back/bookings/bookingController.js` (cancelReservation 함수)
- **라우트**: ❌ `business-back/bookings/bookingRoutes.js`에 라우트가 없음
- **프론트엔드 상태**: ✅ 호출 시도 (`realBusinessReservationApi.cancelReservation`)
- **문제**: 컨트롤러는 존재하지만 라우트가 등록되지 않아 404 에러 발생

**요청 본문**:
```json
{
  "reason": "string"
}
```

---

## 📋 프론트엔드에서 호출하지만 백엔드에 없는 엔드포인트

### 1. 사업자 신청 API ❌

**프론트엔드 호출**: `POST /api/business/auth/apply`
- **파일**: `business-front/src/api/realBusinessApi.js` (realBusinessAuthApi.applyBusiness)
- **백엔드 상태**: ❌ 엔드포인트 없음
- **비고**: 회원가입 기능과 관련된 것으로 보임

---

### 2. 객실 삭제 API ❌

**프론트엔드 호출**: `DELETE /api/business/rooms/:roomId`
- **파일**: `business-front/src/api/realBusinessApi.js` (realBusinessRoomApi.deleteRoom)
- **백엔드 상태**: ❌ 엔드포인트 없음
- **백엔드 라우트**: `business-back/rooms/roomRoutes.js`에 DELETE 라우트 없음

---

### 3. 가격 정책 조회 API ❌

**프론트엔드 호출**: `GET /api/business/rooms/:roomId/pricing`
- **파일**: `business-front/src/api/realBusinessApi.js` (realBusinessRoomApi.getPricePolicies)
- **백엔드 상태**: ❌ 엔드포인트 없음
- **비고**: 가격 정책 설정(`POST`)은 있지만 조회(`GET`)는 없음

---

### 4. 통계 차트 API 경로 불일치 ⚠️

**프론트엔드 호출**: `GET /api/business/statistics/revenue/chart`
- **파일**: `business-front/src/api/realBusinessApi.js` (realBusinessStatsApi.getRevenueChart)
- **백엔드 실제 경로**: `GET /api/business/dashboard/chart`
- **문제**: 경로가 일치하지 않음

---

### 5. 정산 상세 조회 API ❌

**프론트엔드 호출**: `GET /api/business/settlements/:id`
- **파일**: `business-front/src/api/realBusinessApi.js` (realBusinessSettlementApi.getSettlementById)
- **백엔드 상태**: ❌ 엔드포인트 없음
- **백엔드 라우트**: `business-back/settlements/settlementRoutes.js`에 상세 조회 라우트 없음

---

## 📊 요약

### 백엔드에만 존재 (프론트엔드 미사용)
1. ✅ `GET /api/business/dashboard/chart` - 대시보드 차트
2. ✅ `PUT /api/business/auth/password` - 비밀번호 변경
3. ✅ `POST /api/business/auth/forgot-password` - 비밀번호 재설정 요청

### 프론트엔드에서 호출하지만 백엔드에 없음
1. ❌ `POST /api/business/auth/apply` - 사업자 신청
2. ❌ `DELETE /api/business/rooms/:roomId` - 객실 삭제
3. ❌ `GET /api/business/rooms/:roomId/pricing` - 가격 정책 조회
4. ❌ `POST /api/business/reservations/:id/cancel` - 예약 취소 (컨트롤러는 있지만 라우트 없음)
5. ❌ `GET /api/business/statistics/revenue/chart` - 통계 차트 (경로 불일치)
6. ❌ `GET /api/business/settlements/:id` - 정산 상세 조회

---

## 🔧 권장 조치사항

### 우선순위 1 (기능 누락)
1. **예약 취소 라우트 추가** - `bookingRoutes.js`에 `router.post('/:id/cancel', bookingController.cancelReservation)` 추가
2. **가격 정책 조회 API 추가** - `inventoryRoutes.js`에 GET 라우트 추가
3. **정산 상세 조회 API 추가** - `settlementController.js`와 `settlementRoutes.js`에 추가

### 우선순위 2 (경로 불일치)
4. **통계 차트 경로 통일** - 프론트엔드 경로를 `/business/dashboard/chart`로 변경하거나, 백엔드에 `/business/statistics/revenue/chart` 라우트 추가

### 우선순위 3 (선택적 기능)
5. **객실 삭제 API 추가** - 필요시 구현
6. **사업자 신청 API 추가** - 회원가입 기능 구현 시 추가
7. **비밀번호 변경/재설정 기능 연동** - 프론트엔드 UI 추가 시 사용

