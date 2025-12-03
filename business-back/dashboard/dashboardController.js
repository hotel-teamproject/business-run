const Hotel = require('../hotels/Hotel');
const Booking = require('../bookings/Booking');
const Review = require('../reviews/Review');
const Room = require('../rooms/Room');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. 내 호텔 ID 목록 조회
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);

    if (hotelIds.length === 0) {
      // 호텔이 없는 경우 기본값 반환
      return res.json({
        totalRevenue: 0,
        monthlyRevenue: 0,
        bookingCount: 0,
        monthlyBookingCount: 0,
        averageRating: 0,
        reviewCount: 0,
        occupancyRate: 0,
        chartData: {
          labels: [],
          revenue: [],
          bookings: []
        },
        recentBookings: [],
        recentReviews: []
      });
    }

    // 2. 전체 예약 데이터 집계 (매출, 예약 건수)
    const stats = await Booking.aggregate([
      { $match: { hotelId: { $in: hotelIds }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    // 3. 이번 달 데이터 집계
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

    // 4. 리뷰 통계 (평균 평점, 리뷰 개수)
    const reviewStats = await Review.aggregate([
      { $match: { hotelId: { $in: hotelIds } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    // 5. 객실 점유율 계산 (최근 30일 기준)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const totalRooms = await Room.countDocuments({ hotelId: { $in: hotelIds }, isActive: true });
    
    // 최근 30일간 예약된 객실 수 계산
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

    // 6. 최근 예약 목록 (최근 5개)
    const recentBookings = await Booking.find({
      hotelId: { $in: hotelIds },
      status: { $ne: 'cancelled' }
    })
      .populate('hotelId', 'name')
      .populate('roomId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('guestName hotelId roomId checkIn checkOut totalPrice status createdAt')
      .lean();

    // 7. 최근 리뷰 목록 (최근 5개)
    const recentReviews = await Review.find({
      hotelId: { $in: hotelIds }
    })
      .populate('hotelId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('authorName hotelId rating comment createdAt')
      .lean();

    // 8. 차트 데이터 (최근 6개월)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const chartDataAgg = await Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          status: { $ne: 'cancelled' },
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    const chartLabels = chartDataAgg.map(item => `${item._id.year}년 ${item._id.month}월`);
    const chartRevenue = chartDataAgg.map(item => item.revenue);
    const chartBookings = chartDataAgg.map(item => item.bookings);

    // 프론트엔드가 기대하는 형태로 응답 변환
    res.json({
      totalRevenue: stats[0]?.totalRevenue || 0,
      monthlyRevenue: monthlyStats[0]?.monthlyRevenue || 0,
      bookingCount: stats[0]?.totalBookings || 0,
      monthlyBookingCount: monthlyStats[0]?.monthlyBookings || 0,
      averageRating: reviewStats[0]?.averageRating ? Math.round(reviewStats[0].averageRating * 10) / 10 : 0,
      reviewCount: reviewStats[0]?.reviewCount || 0,
      occupancyRate: occupancyRate,
      chartData: {
        labels: chartLabels,
        revenue: chartRevenue,
        bookings: chartBookings
      },
      recentBookings: recentBookings.map(booking => ({
        id: booking._id.toString(),
        guestName: booking.guestName,
        hotelName: booking.hotelId?.name || '',
        roomName: booking.roomId?.name || '',
        checkIn: booking.checkIn ? booking.checkIn.toISOString().split('T')[0] : '',
        checkOut: booking.checkOut ? booking.checkOut.toISOString().split('T')[0] : '',
        totalPrice: booking.totalPrice,
        status: booking.status
      })),
      recentReviews: recentReviews.map(review => ({
        id: review._id.toString(),
        authorName: review.authorName,
        hotelName: review.hotelId?.name || '',
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt
      }))
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: '통계 조회 실패', error: error.message });
  }
};

exports.getRevenueChart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = 'month' } = req.query; // month, week, year
    
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);
    
    let groupFormat;
    let dateFilter = {};
    
    if (period === 'month') {
      groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);
      dateFilter.createdAt = { $gte: startDate };
    } else if (period === 'week') {
      groupFormat = { $dateToString: { format: '%Y-%U', date: '$createdAt' } };
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 12 * 7);
      dateFilter.createdAt = { $gte: startDate };
    } else {
      groupFormat = { $dateToString: { format: '%Y', date: '$createdAt' } };
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 5);
      dateFilter.createdAt = { $gte: startDate };
    }
    
    const chartData = await Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          status: { $ne: 'cancelled' },
          ...dateFilter
        }
      },
      {
        $group: {
          _id: groupFormat,
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    res.status(500).json({ message: '차트 데이터 조회 실패', error });
  }
};

