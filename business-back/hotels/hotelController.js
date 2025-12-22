const Hotel = require('./Hotel');
const Room = require('../rooms/Room');
const Review = require('../reviews/Review');

exports.getMyHotels = async (req, res) => {
  try {
    const userId = req.user._id;
    // isActive가 true인 호텔만 조회 (삭제된 호텔 제외)
    const hotels = await Hotel.find({ ownerId: userId, isActive: true }).sort({ createdAt: -1 });
    
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
        // images 배열의 첫 번째 이미지를 mainImage로 매핑
        hotelObj.mainImage = hotelObj.images && hotelObj.images.length > 0 ? hotelObj.images[0] : null;
        
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
    // isActive가 true인 호텔만 조회 (삭제된 호텔 제외)
    const hotel = await Hotel.findOne({ _id: id, ownerId: userId, isActive: true });
    
    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }
    
    // 프론트엔드가 기대하는 형식으로 변환
    const hotelObj = hotel.toObject();
    // images 배열의 첫 번째 이미지를 mainImage로 매핑
    hotelObj.mainImage = hotelObj.images && hotelObj.images.length > 0 ? hotelObj.images[0] : null;
    
    // 프론트엔드가 기대하는 필드 매핑
    // nameEn, country, phone, email은 이제 스키마에 있으므로 그대로 사용
    hotelObj.nameEn = hotelObj.nameEn || '';
    hotelObj.country = hotelObj.country || '대한민국';
    hotelObj.phone = hotelObj.phone || '';
    hotelObj.email = hotelObj.email || '';
    // starRating: rating을 starRating으로 매핑
    hotelObj.starRating = hotelObj.rating || 5;
    // type: 스키마에 없으므로 기본값
    hotelObj.type = hotelObj.type || 'hotel';
    // checkInTime, checkOutTime: 스키마에 없으므로 기본값
    hotelObj.checkInTime = hotelObj.checkInTime || '15:00';
    hotelObj.checkOutTime = hotelObj.checkOutTime || '11:00';
    
    // 프런트 BusinessHotelEditPage 에서 호텔 객체를 그대로 사용
    res.json(hotelObj);
  } catch (error) {
    res.status(500).json({ message: '호텔 조회 실패', error });
  }
};

exports.createHotel = async (req, res) => {
  try {
    // 허용된 필드만 선택하여 호텔 생성
    const hotelData = {
      name: req.body.name,
      nameEn: req.body.nameEn || '',
      address: req.body.address || '',
      city: req.body.city || '',
      country: req.body.country || '대한민국',
      phone: req.body.phone || '',
      email: req.body.email || '',
      description: req.body.description || '',
      amenities: Array.isArray(req.body.amenities) ? req.body.amenities : [],
      images: Array.isArray(req.body.images) ? req.body.images.filter(img => img && img.trim()) : [], // 빈 문자열 제거
      rating: req.body.rating || req.body.starRating || 0,
      ownerId: req.user._id,
      isApproved: false
    };
    
    const newHotel = new Hotel(hotelData);
    
    await newHotel.save();
    console.log('호텔 등록 완료:', { id: newHotel._id, name: newHotel.name });
    res.status(201).json({ message: '호텔 등록 성공', hotel: newHotel });
  } catch (error) {
    console.error('호텔 등록 에러:', error);
    res.status(500).json({ message: '호텔 등록 실패', error: error.message });
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
    
    // 허용된 필드만 업데이트 (스키마에 정의된 필드만)
    const allowedFields = ['name', 'nameEn', 'address', 'city', 'country', 'phone', 'email', 'description', 'amenities', 'images', 'rating'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        hotel[field] = req.body[field];
      }
    });
    
    // starRating이 오면 rating으로 매핑
    if (req.body.starRating !== undefined) {
      hotel.rating = req.body.starRating;
    }
    
    // 변경사항이 있는지 확인
    const hasChanges = allowedFields.some(field => req.body[field] !== undefined) || req.body.starRating !== undefined;
    if (!hasChanges) {
      return res.json({ message: '변경사항이 없습니다.', hotel });
    }
    
    await hotel.save();
    console.log('호텔 수정 완료:', { id: hotel._id, name: hotel.name });
    
    res.json({ message: '호텔 수정 성공', hotel });
  } catch (error) {
    console.error('호텔 수정 에러:', error);
    res.status(500).json({ message: '호텔 수정 실패', error: error.message });
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
    console.log('호텔 삭제 완료:', { id: hotel._id, name: hotel.name, isActive: hotel.isActive });
    
    res.json({ message: '호텔 삭제 성공' });
  } catch (error) {
    console.error('호텔 삭제 에러:', error);
    res.status(500).json({ message: '호텔 삭제 실패', error: error.message });
  }
};

