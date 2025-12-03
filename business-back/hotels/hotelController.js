const Hotel = require('./Hotel');
const Room = require('../rooms/Room');
const Review = require('../reviews/Review');

exports.getMyHotels = async (req, res) => {
  try {
    const userId = req.user._id;
    const hotels = await Hotel.find({ ownerId: userId }).sort({ createdAt: -1 });
    
    // 각 호텔에 roomCount, reviewCount, averageRating 추가
    const hotelsWithStats = await Promise.all(
      hotels.map(async (hotel) => {
        const hotelObj = hotel.toObject();
        
        // 객실 개수
        const roomCount = await Room.countDocuments({ hotelId: hotel._id, isActive: true });
        
        // 리뷰 통계
        const reviewStats = await Review.aggregate([
          { $match: { hotelId: hotel._id } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$rating' },
              reviewCount: { $sum: 1 }
            }
          }
        ]);
        
        hotelObj.roomCount = roomCount;
        hotelObj.reviewCount = reviewStats[0]?.reviewCount || 0;
        hotelObj.averageRating = reviewStats[0]?.averageRating 
          ? Math.round(reviewStats[0].averageRating * 10) / 10 
          : 0;
        
        return hotelObj;
      })
    );
    
    // 프런트 BusinessHotelListPage 에서 data.hotels 로 사용
    res.json({
      hotels: hotelsWithStats,
      totalPages: 1,
      currentPage: 1,
      total: hotelsWithStats.length,
    });
  } catch (error) {
    res.status(500).json({ message: '호텔 목록 조회 실패', error });
  }
};

exports.getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const hotel = await Hotel.findOne({ _id: id, ownerId: userId });
    
    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }
    
    // 프런트 BusinessHotelEditPage 에서 호텔 객체를 그대로 사용
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: '호텔 조회 실패', error });
  }
};

exports.createHotel = async (req, res) => {
  try {
    const newHotel = new Hotel({
      ...req.body,
      ownerId: req.user._id,
      isApproved: false
    });
    
    await newHotel.save();
    res.status(201).json({ message: '호텔 등록 성공', hotel: newHotel });
  } catch (error) {
    res.status(500).json({ message: '호텔 등록 실패', error });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const hotel = await Hotel.findOne({ _id: id, ownerId: userId });
    
    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }
    
    Object.assign(hotel, req.body);
    await hotel.save();
    
    res.json({ message: '호텔 수정 성공', hotel });
  } catch (error) {
    res.status(500).json({ message: '호텔 수정 실패', error });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const hotel = await Hotel.findOne({ _id: id, ownerId: userId });
    
    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }
    
    hotel.isActive = false;
    await hotel.save();
    
    res.json({ message: '호텔 삭제 성공' });
  } catch (error) {
    res.status(500).json({ message: '호텔 삭제 실패', error });
  }
};

