# 프론트엔드 UI 상태 확인 결과

## ✅ 이미 구현된 UI (API 연결만 필요)

### 1. 사업자 신청 (회원가입)
- **페이지**: `BusinessSignupForm.jsx`
- **상태**: UI는 완성되어 있으나 API 호출이 없음
- **현재**: `alert("회원가입이 완료되었습니다!")` 만 있음
- **필요 작업**: `businessAuthApi.applyBusiness()` 호출 추가

---

## ❌ UI가 없는 기능들

### 1. 객실 삭제
- **API**: `DELETE /api/business/rooms/:roomId` ✅ 생성됨
- **페이지**: `BusinessRoomManagePage.jsx`
- **상태**: 삭제 버튼이 없음
- **필요 작업**: 객실 카드에 삭제 버튼 추가 및 `businessRoomApi.deleteRoom()` 호출

### 2. 예약 취소
- **API**: `POST /api/business/reservations/:id/cancel` ✅ 생성됨
- **페이지**: `BusinessReservationDetailPage.jsx`
- **상태**: 취소 버튼이 없음
- **필요 작업**: 예약 상세 페이지에 취소 버튼 추가 및 `businessReservationApi.cancelReservation()` 호출

### 3. 정산 상세 조회
- **API**: `GET /api/business/settlements/:id` ✅ 생성됨
- **페이지**: `BusinessSettlementPage.jsx`
- **상태**: 상세보기 링크/버튼이 없음
- **필요 작업**: 정산 카드에 상세보기 버튼 추가 및 상세 페이지 생성

### 4. 비밀번호 변경
- **API**: `PUT /api/business/auth/password` ✅ 생성됨
- **페이지**: 없음
- **상태**: 비밀번호 변경 페이지가 없음
- **필요 작업**: 
  - 비밀번호 변경 페이지 생성
  - 프로필 페이지나 설정 페이지에 링크 추가

### 5. 비밀번호 재설정 요청
- **API**: `POST /api/business/auth/forgot-password` ✅ 생성됨
- **페이지**: 없음
- **상태**: 
  - 로그인 페이지에 "Forgot Password" 링크는 있지만 (`AuthFormOptions`)
  - 실제 페이지가 없음
- **필요 작업**: 비밀번호 재설정 요청 페이지 생성

### 6. 대시보드 차트 (별도 API)
- **API**: `GET /api/business/dashboard/chart` ✅ 생성됨
- **컴포넌트**: `BusinessChartArea.jsx`
- **상태**: 
  - 차트 컴포넌트는 있음
  - 하지만 `getDashboardStats()`의 `chartData`만 사용
  - 별도 `getRevenueChart()` API는 호출하지 않음
- **필요 작업**: 
  - 현재는 문제 없음 (대시보드 통계에서 차트 데이터를 함께 받음)
  - 필요시 별도 차트 페이지에서 `getRevenueChart()` 사용 가능

---

## 📋 작업 우선순위

### 우선순위 1 (기능 완성)
1. **사업자 신청 API 연결** - `BusinessSignupForm.jsx`에 API 호출 추가
2. **객실 삭제 버튼 추가** - `BusinessRoomManagePage.jsx`에 삭제 기능 추가
3. **예약 취소 버튼 추가** - `BusinessReservationDetailPage.jsx`에 취소 기능 추가

### 우선순위 2 (사용자 편의)
4. **정산 상세 조회** - 정산 상세 페이지 생성 및 링크 추가
5. **비밀번호 변경** - 프로필/설정 페이지에 비밀번호 변경 기능 추가

### 우선순위 3 (선택적)
6. **비밀번호 재설정** - 비밀번호 재설정 요청 페이지 생성

---

## 📝 상세 작업 내용

### 1. 사업자 신청 API 연결
**파일**: `business-front/src/components/auth/BusinessSignupForm.jsx`

```javascript
// handleSubmit 함수 수정 필요
import { businessAuthApi } from "../../api/businessApi";

const handleSubmit = async (e) => {
  e.preventDefault();
  // ... 검증 로직 ...
  
  try {
    const response = await businessAuthApi.applyBusiness({
      email: formData.businessEmail,
      password: formData.password, // 비밀번호 필드 추가 필요
      name: formData.ownerName,
      businessNumber: formData.businessNumber,
      phone: formData.businessPhone,
    });
    
    alert("회원가입이 완료되었습니다!");
    navigate("/business/login");
  } catch (err) {
    setError(err.message || "회원가입에 실패했습니다.");
  }
};
```

**주의**: 현재 폼에 비밀번호 필드가 없음 - 추가 필요

---

### 2. 객실 삭제 버튼 추가
**파일**: `business-front/src/pages/business/BusinessRoomManagePage.jsx`

```javascript
const handleDelete = async (roomId) => {
  if (!window.confirm("정말 삭제하시겠습니까?")) return;
  
  try {
    await businessRoomApi.deleteRoom(roomId);
    alert("객실이 삭제되었습니다.");
    fetchRooms();
  } catch (err) {
    alert(err.message || "삭제에 실패했습니다.");
  }
};

// room-actions div에 추가
<button
  className="btn btn-sm btn-danger"
  onClick={() => handleDelete(room._id)}
>
  삭제
</button>
```

---

### 3. 예약 취소 버튼 추가
**파일**: `business-front/src/pages/business/BusinessReservationDetailPage.jsx`

```javascript
const handleCancel = async () => {
  const reason = prompt("취소 사유를 입력해주세요:");
  if (!reason) return;
  
  if (!window.confirm("정말 예약을 취소하시겠습니까?")) return;
  
  try {
    await businessReservationApi.cancelReservation(reservationId, reason);
    alert("예약이 취소되었습니다.");
    fetchReservation();
  } catch (err) {
    alert(err.message || "취소에 실패했습니다.");
  }
};

// reservation-detail div 끝에 추가
{reservation.status !== 'cancelled' && (
  <div className="detail-actions">
    <button
      className="btn btn-danger"
      onClick={handleCancel}
    >
      예약 취소
    </button>
  </div>
)}
```

---

### 4. 정산 상세 조회
**필요 작업**:
1. `BusinessSettlementDetailPage.jsx` 생성
2. `BusinessSettlementPage.jsx`에 상세보기 버튼 추가
3. 라우트 추가

---

### 5. 비밀번호 변경
**필요 작업**:
1. `BusinessChangePasswordPage.jsx` 생성
2. `BusinessProfilePage.jsx`에 비밀번호 변경 링크 추가
3. 라우트 추가

---

### 6. 비밀번호 재설정 요청
**필요 작업**:
1. `BusinessForgotPasswordPage.jsx` 생성
2. `BusinessLoginForm.jsx`의 "Forgot Password" 링크 연결
3. 라우트 추가

