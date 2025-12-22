# 리뷰 API 프론트엔드-백엔드 불일치 사항 정리

## 🔍 발견된 문제점

### 1. 대시보드 리뷰 데이터 필드명 불일치 ⚠️

**위치**: `BusinessRecentTable.jsx` (프론트엔드)

**프론트엔드 기대 필드**:
```javascript
{
  id: string,
  userName: string,    // ❌ 백엔드는 authorName 반환
  rating: number,      // ✅ 일치
  content: string,     // ❌ 백엔드는 comment 반환
  hotelName: string,   // ✅ 일치
  createdAt: string    // ✅ 일치 (하지만 Date 객체일 수 있음)
}
```

**백엔드 실제 응답** (`dashboardController.js:184-191`):
```javascript
{
  id: review._id.toString(),
  authorName: review.authorName,  // ❌ userName이 아님
  hotelName: review.hotelId?.name || '',
  rating: review.rating,
  comment: review.comment,          // ❌ content가 아님
  createdAt: review.createdAt       // Date 객체 (문자열 변환 필요)
}
```

**영향**: 대시보드의 "최근 리뷰" 섹션에서 데이터가 표시되지 않음

---

### 2. 리뷰 신고 API 엔드포인트 누락 ❌

**프론트엔드 호출** (`realBusinessApi.js:153-156`):
```javascript
reportReview: async (reviewId, reason, content) => {
  const response = await axiosClient.post(`/business/reviews/${reviewId}/report`, { reason, content });
  return response;
}
```

**백엔드 라우트** (`businessReviewRoutes.js`):
- ❌ `/business/reviews/:id/report` 라우트가 없음
- 현재 존재하는 라우트:
  - `GET /business/reviews` ✅
  - `GET /business/reviews/:id` ✅
  - `POST /business/reviews/:id/reply` ✅

**영향**: 리뷰 신고 기능이 작동하지 않음

---

### 3. 리뷰 목록/상세 응답의 reply.createdAt 형식 불일치 ⚠️

**프론트엔드 기대** (`BusinessReviewListPage.jsx:64`, `BusinessReviewDetailPage.jsx:100`):
```javascript
review.reply.createdAt  // 문자열 형식 (예: "2024-11-09")
```

**백엔드 응답** (`businessReviewController.js:99`):
```javascript
review.reply = {
  content,
  authorId: userId,
  createdAt: new Date()  // Date 객체
}
```

**영향**: 답변 날짜가 제대로 표시되지 않을 수 있음

---

### 4. 리뷰 목록 API 응답 구조는 일치 ✅

**프론트엔드 기대**:
```javascript
{
  reviews: [...],
  totalPages: number,
  currentPage: number,
  total: number
}
```

**백엔드 응답** (`businessReviewController.js:32-37`):
```javascript
{
  reviews: formattedReviews,
  totalPages: 1,
  currentPage: 1,
  total: formattedReviews.length
}
```

✅ 구조는 일치하지만, 페이지네이션이 제대로 구현되지 않음 (항상 1페이지로 반환)

---

## 📋 수정이 필요한 항목

### 우선순위 1 (데이터 표시 문제)
1. ✅ **대시보드 리뷰 필드명 수정** - `dashboardController.js`의 `recentReviews` 매핑 수정
   - `authorName` → `userName`
   - `comment` → `content`
   - `createdAt` Date 객체를 문자열로 변환

### 우선순위 2 (기능 누락)
2. ✅ **리뷰 신고 API 라우트 추가** - `businessReviewRoutes.js`와 `businessReviewController.js`에 추가

### 우선순위 3 (데이터 형식)
3. ✅ **reply.createdAt 문자열 변환** - `businessReviewController.js`의 `replyToReview`와 `getReviews`, `getReviewById`에서 Date를 문자열로 변환

---

## 📝 상세 비교표

| 항목 | 프론트엔드 기대 | 백엔드 실제 | 상태 |
|------|----------------|------------|------|
| 리뷰 목록 엔드포인트 | `GET /business/reviews` | `GET /business/reviews` | ✅ 일치 |
| 리뷰 상세 엔드포인트 | `GET /business/reviews/:id` | `GET /business/reviews/:id` | ✅ 일치 |
| 답변 작성 엔드포인트 | `POST /business/reviews/:id/reply` | `POST /business/reviews/:id/reply` | ✅ 일치 |
| 리뷰 신고 엔드포인트 | `POST /business/reviews/:id/report` | ❌ 없음 | ❌ 누락 |
| 리뷰 목록 응답 구조 | `{reviews, totalPages, currentPage, total}` | `{reviews, totalPages, currentPage, total}` | ✅ 일치 |
| 리뷰 필드: userName | `userName` | `userName` (변환됨) | ✅ 일치 |
| 리뷰 필드: starRating | `starRating` | `starRating` (변환됨) | ✅ 일치 |
| 리뷰 필드: content | `content` | `content` (comment에서 변환) | ✅ 일치 |
| 리뷰 필드: title | `title` | `title` (빈 문자열) | ✅ 일치 |
| 대시보드 리뷰: userName | `userName` | `authorName` | ❌ 불일치 |
| 대시보드 리뷰: content | `content` | `comment` | ❌ 불일치 |
| reply.createdAt 형식 | 문자열 | Date 객체 | ⚠️ 형식 불일치 |

---

## 🔧 수정 완료 내역

### ✅ 1. 대시보드 리뷰 필드명 수정 완료
**파일**: `business-back/dashboard/dashboardController.js`

**변경 사항**:
- `authorName` → `userName`으로 변경
- `comment` → `content`로 변경
- `createdAt` Date 객체를 문자열 형식(`YYYY-MM-DD`)으로 변환

```javascript
// 수정 전
authorName: review.authorName,
comment: review.comment,
createdAt: review.createdAt

// 수정 후
userName: review.authorName,
content: review.comment,
createdAt: review.createdAt ? review.createdAt.toISOString().split('T')[0] : ''
```

### ✅ 2. 리뷰 신고 API 추가 완료
**파일**: 
- `business-back/reviews/businessReviewRoutes.js` - 라우트 추가
- `business-back/reviews/businessReviewController.js` - 컨트롤러 함수 추가

**추가된 엔드포인트**:
- `POST /business/reviews/:id/report`
- 요청 본문: `{ reason: string, content: string }`
- 응답: `{ success: true, message: '리뷰 신고가 접수되었습니다.' }`

**기능**:
- 리뷰의 `isReported`를 `true`로 설정
- `reportCount` 증가
- `reportReason` 저장
- `reportStatus`를 `'pending'`으로 설정

### ✅ 3. reply.createdAt 문자열 변환 완료
**파일**: `business-back/reviews/businessReviewController.js`

**변경 사항**:
- `getReviews()`: reply 객체의 `createdAt`을 문자열로 변환
- `getReviewById()`: reply 객체의 `createdAt`을 문자열로 변환
- `replyToReview()`: 응답의 reply 객체의 `createdAt`을 문자열로 변환

```javascript
// 수정 후
reply: review.reply ? {
  content: review.reply.content,
  createdAt: review.reply.createdAt ? review.reply.createdAt.toISOString().split('T')[0] : ''
} : null
```

---

## 📝 테스트 체크리스트

수정 완료 후 다음 항목들을 테스트해주세요:

- [ ] 대시보드의 "최근 리뷰" 섹션에 리뷰 데이터가 정상적으로 표시되는지 확인
- [ ] 리뷰 목록 페이지에서 리뷰 데이터가 정상적으로 표시되는지 확인
- [ ] 리뷰 상세 페이지에서 답변 날짜가 정상적으로 표시되는지 확인
- [ ] 리뷰 신고 기능이 정상적으로 작동하는지 확인
- [ ] 리뷰 답변 작성 후 날짜가 정상적으로 표시되는지 확인

