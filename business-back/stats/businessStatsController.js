const Hotel = require('../hotels/Hotel');
const Booking = require('../bookings/Booking');
const Room = require('../rooms/Room');

// GET /business/statistics
exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 내 호텔 ID 목록 조회
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);
    
    if (hotelIds.length === 0) {
      return res.json({
        revenue: {
          total: 0,
          monthly: 0,
          daily: 0
        },
        bookings: {
          total: 0,
          monthly: 0,
          daily: 0
        },
        occupancy: {
          rate: 0,
          totalRooms: 0,
          bookedRooms: 0
        }
      });
    }
    
    // 전체 매출 통계
    const totalStats = await Booking.aggregate([
      { $match: { hotelId: { $in: hotelIds }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalBookings: { $sum: 1 }
        }
      }
    ]);
    
    // 이번 달 통계
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyStats = await Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: '$totalPrice' },
          monthlyBookings: { $sum: 1 }
        }
      }
    ]);
    
    // 오늘 통계
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStats = await Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          status: { $ne: 'cancelled' },
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          dailyRevenue: { $sum: '$totalPrice' },
          dailyBookings: { $sum: 1 }
        }
      }
    ]);
    
    // 객실 점유율 계산 (최근 30일 기준)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const totalRooms = await Room.countDocuments({ hotelId: { $in: hotelIds }, isActive: true });
    
    const bookedRooms = await Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          status: { $ne: 'cancelled' },
          checkIn: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$roomId'
        }
      },
      {
        $count: 'uniqueRooms'
      }
    ]);
    
    const uniqueBookedRooms = bookedRooms[0]?.uniqueRooms || 0;
    const occupancyRate = totalRooms > 0 ? Math.round((uniqueBookedRooms / totalRooms) * 100) : 0;
    
    // 프런트엔드가 기대하는 형태로 응답
    res.json({
      revenue: {
        total: totalStats[0]?.totalRevenue || 0,
        monthly: monthlyStats[0]?.monthlyRevenue || 0,
        daily: todayStats[0]?.dailyRevenue || 0
      },
      bookings: {
        total: totalStats[0]?.totalBookings || 0,
        monthly: monthlyStats[0]?.monthlyBookings || 0,
        daily: todayStats[0]?.dailyBookings || 0
      },
      occupancy: {
        rate: occupancyRate,
        totalRooms: totalRooms,
        bookedRooms: uniqueBookedRooms
      }
    });
  } catch (error) {
    console.error('getStatistics error:', error);
    res.status(500).json({ success: false, message: '통계 조회 실패', error: error.message });
  }
};

