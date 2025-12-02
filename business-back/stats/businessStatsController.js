const Hotel = require('../hotels/Hotel');
const Booking = require('../bookings/Booking');
const Review = require('../reviews/Review');
const Room = require('../rooms/Room');

// 공통: 날짜 필터 빌더
const buildDateFilter = (from, to, field = 'createdAt') => {
  const filter = {};
  if (from || to) {
    filter[field] = {};
    if (from) filter[field].$gte = new Date(from);
    if (to) filter[field].$lte = new Date(to);
  }
  return filter;
};

// GET /business/statistics - 사업자 통계 조회
exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { from, to } = req.query;

    // 사업자가 소유한 호텔 ID 목록 조회
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);

    if (hotelIds.length === 0) {
      return res.json({
        success: true,
        data: {
          revenue: {
            total: 0,
            monthly: 0,
            daily: 0,
          },
          bookings: {
            total: 0,
            monthly: 0,
            daily: 0,
          },
          occupancy: {
            rate: 0,
            totalRooms: 0,
            bookedRooms: 0,
          },
        },
      });
    }

    const dateFilter = buildDateFilter(from, to, 'createdAt');
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 전체 매출 및 예약 건수
    const totalStats = await Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          status: { $ne: 'cancelled' },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalBookings: { $sum: 1 },
        },
      },
    ]);

    // 이번 달 매출 및 예약 건수
    const monthlyStats = await Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: '$totalPrice' },
          monthlyBookings: { $sum: 1 },
        },
      },
    ]);

    // 오늘 매출 및 예약 건수
    const dailyStats = await Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startOfDay },
        },
      },
      {
        $group: {
          _id: null,
          dailyRevenue: { $sum: '$totalPrice' },
          dailyBookings: { $sum: 1 },
        },
      },
    ]);

    // 전체 객실 수 및 예약된 객실 수
    const roomStats = await Room.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalRooms: { $sum: 1 },
        },
      },
    ]);

    // 현재 예약된 객실 수 계산 (체크인/체크아웃 날짜 기준)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookedRooms = await Booking.countDocuments({
      hotelId: { $in: hotelIds },
      status: { $in: ['confirmed', 'pending'] },
      checkIn: { $lte: today },
      checkOut: { $gt: today },
    });

    const totalRooms = roomStats[0]?.totalRooms || 0;
    const occupancyRate = totalRooms > 0 ? (bookedRooms / totalRooms) * 100 : 0;

    const totalInfo = totalStats[0] || { totalRevenue: 0, totalBookings: 0 };
    const monthlyInfo = monthlyStats[0] || { monthlyRevenue: 0, monthlyBookings: 0 };
    const dailyInfo = dailyStats[0] || { dailyRevenue: 0, dailyBookings: 0 };

    res.json({
      success: true,
      data: {
        revenue: {
          total: totalInfo.totalRevenue || 0,
          monthly: monthlyInfo.monthlyRevenue || 0,
          daily: dailyInfo.dailyRevenue || 0,
        },
        bookings: {
          total: totalInfo.totalBookings || 0,
          monthly: monthlyInfo.monthlyBookings || 0,
          daily: dailyInfo.dailyBookings || 0,
        },
        occupancy: {
          rate: Math.round(occupancyRate * 100) / 100,
          totalRooms: totalRooms,
          bookedRooms: bookedRooms,
        },
      },
    });
  } catch (error) {
    console.error('getStatistics error:', error);
    res.status(500).json({
      success: false,
      message: '통계 조회 실패',
      error: error.message,
    });
  }
};

// GET /business/statistics/revenue/chart - 매출 차트 데이터 조회
exports.getRevenueChart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { from, to, groupBy = 'month' } = req.query;

    // 사업자가 소유한 호텔 ID 목록 조회
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);

    if (hotelIds.length === 0) {
      return res.json({
        success: true,
        data: {
          labels: [],
          revenue: [],
        },
      });
    }

    let groupExpr;
    if (groupBy === 'day') {
      groupExpr = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else if (groupBy === 'year') {
      groupExpr = { $dateToString: { format: '%Y', date: '$createdAt' } };
    } else {
      // default: month
      groupExpr = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    }

    const dateFilter = buildDateFilter(from, to, 'createdAt');

    const data = await Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          status: { $ne: 'cancelled' },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: groupExpr,
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        labels: data.map((d) => d._id),
        revenue: data.map((d) => d.revenue),
      },
    });
  } catch (error) {
    console.error('getRevenueChart error:', error);
    res.status(500).json({
      success: false,
      message: '매출 차트 데이터 조회 실패',
      error: error.message,
    });
  }
};

