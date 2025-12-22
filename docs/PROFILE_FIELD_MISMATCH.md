# 내정보 페이지 필드 불일치 정리

## 🔍 발견된 문제점

### 백엔드 User 모델 필드
```javascript
{
  email: String,           // ✅ 있음
  name: String,            // "와우호텔 사업자" - 사업자명으로 보임
  businessNumber: String,  // ✅ 있음
  phone: String,          // ✅ 있음 (프론트는 businessPhone 기대)
  isActive: Boolean,      // ✅ 있음
  // businessName: 없음 ❌
  // businessAddress: 없음 ❌
}
```

### 프론트엔드에서 표시하는 필드
```javascript
{
  businessName: "-",           // ❌ 백엔드에 없음
  businessNumber: "123-45-67890", // ✅ 일치
  name: "와우호텔 사업자",      // ✅ 있지만 의미 불명확
  email: "wow@hotel.com",      // ✅ 일치
  businessPhone: "-",          // ❌ 백엔드는 phone
  businessAddress: "-",        // ❌ 백엔드에 없음
}
```

---

## 📋 필드별 상세 분석

### 1. 사업자명 (businessName) ❌
- **프론트엔드**: `businessInfo.businessName` 기대
- **백엔드**: `businessName` 필드 없음
- **실제 데이터**: `name` 필드에 "와우호텔 사업자" 같은 값이 저장됨
- **문제**: `name`이 사업자명인지 대표자 이름인지 불명확

### 2. 대표자 이름 ⚠️
- **프론트엔드**: `businessInfo.name || businessInfo.ownerName` 사용
- **백엔드**: `name` 필드만 있음
- **실제 데이터**: `name`에 "와우호텔 사업자" 저장 (사업자명 같음)
- **문제**: 대표자 이름이 아니라 사업자명으로 보임

### 3. 사업자 연락처 (businessPhone) ❌
- **프론트엔드**: `businessInfo.businessPhone` 기대
- **백엔드**: `phone` 필드 사용
- **문제**: 필드명 불일치

### 4. 사업장 주소 (businessAddress) ❌
- **프론트엔드**: `businessInfo.businessAddress` 기대
- **백엔드**: 필드 없음
- **문제**: 데이터 자체가 없음

---

## 🔧 해결 방안

### 옵션 1: 백엔드 응답 변환 (권장)
백엔드 `getMyInfo`에서 프론트엔드가 기대하는 형식으로 변환

### 옵션 2: 프론트엔드 필드명 수정
프론트엔드에서 백엔드 필드명에 맞춰 수정

### 옵션 3: 백엔드 모델 확장
User 모델에 `businessName`, `ownerName`, `businessAddress` 필드 추가

---

## 💡 해결 완료

**백엔드 응답 변환**으로 해결했습니다:
1. ✅ `name` → `businessName` (사업자명)
2. ✅ `name` → `ownerName` (대표자 이름 - 현재는 name과 동일)
3. ✅ `phone` → `businessPhone` (사업자 연락처)
4. ✅ `businessAddress`는 빈 문자열 반환 (필드 없음)
5. ✅ `email` → `businessEmail` (호환성)
6. ✅ `isActive` → `isApproved` (호환성)

### 변경된 파일
- `business-back/auth/authController.js` - `getMyInfo`와 `login` 응답 변환 추가
- `business-front/src/pages/business/BusinessProfilePage.jsx` - 필드명 정리 및 fallback 추가

### 필드 매핑
| 프론트엔드 표시 | 백엔드 필드 | 변환 후 |
|---------------|-----------|---------|
| 사업자명 | `name` | `businessName` |
| 대표자 이름 | `name` | `ownerName` |
| 사업자 연락처 | `phone` | `businessPhone` |
| 사업장 주소 | 없음 | `businessAddress: ""` |
| 사업자 이메일 | `email` | `businessEmail` |
| 승인 상태 | `isActive` | `isApproved` |

