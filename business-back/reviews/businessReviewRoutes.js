const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const businessReviewController = require('./businessReviewController');

// 모든 라우트는 인증 및 사업자 권한 필요
router.use(verifyToken, authorize('business'));

// 리뷰 목록 조회
router.get('/', businessReviewController.getReviews);

// 리뷰 상세 조회
router.get('/:id', businessReviewController.getReviewById);

// 리뷰 답변 작성
router.post('/:id/reply', businessReviewController.replyToReview);

// 리뷰 신고
router.post('/:id/report', businessReviewController.reportReview);

module.exports = router;

