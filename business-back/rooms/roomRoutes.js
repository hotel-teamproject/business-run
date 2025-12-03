const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../auth/authMiddleware');
const roomController = require('./roomController');

// 모든 라우트는 인증 및 사업자 권한 필요
router.use(verifyToken, authorize('business'));

// 프런트엔드 realBusinessRoomApi 경로에 맞춘 라우트
// GET  /api/business/hotels/:hotelId/rooms
router.get('/hotels/:hotelId/rooms', roomController.getRoomsByHotel);
// POST /api/business/hotels/:hotelId/rooms
router.post('/hotels/:hotelId/rooms', roomController.createRoom);
// GET  /api/business/rooms/:roomId
router.get('/rooms/:roomId', roomController.getRoomById);
// PUT  /api/business/rooms/:roomId
router.put('/rooms/:roomId', roomController.updateRoom);

module.exports = router;

