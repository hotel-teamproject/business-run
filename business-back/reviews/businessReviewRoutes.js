const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const businessReviewController = require('./businessReviewController');

// 모든 라우트는 인증 및 사업자 권한 필요
router.use(verifyToken, authorize('business'));

router.get('/', businessReviewController.getReviews);
router.get('/:id', businessReviewController.getReviewById);
router.post('/:id/reply', businessReviewController.replyToReview);

module.exports = router;

