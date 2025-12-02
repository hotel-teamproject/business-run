const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const businessStatsController = require('./businessStatsController');

// 모든 라우트는 인증 및 사업자 권한 필요
router.use(verifyToken, authorize('business'));

// 통계 조회
router.get('/', businessStatsController.getStatistics);

// 매출 차트 데이터 조회
router.get('/revenue/chart', businessStatsController.getRevenueChart);

module.exports = router;

