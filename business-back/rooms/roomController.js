const Room = require('./Room');
const Hotel = require('../hotels/Hotel');

exports.getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user._id;
    
    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: hotelId, ownerId: userId });
    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }
    
    // isActive가 true인 객실만 조회 (삭제된 객실 제외)
    const rooms = await Room.find({ hotelId, isActive: true }).sort({ createdAt: -1 });
    
    // 프론트엔드가 기대하는 형식으로 변환
    const formattedRooms = rooms.map(room => ({
      _id: room._id,
      name: room.name,
      nameEn: room.type, // type을 nameEn으로 매핑
      roomSize: room.roomSize || '', // roomSize는 이제 스키마에 있음
      capacityMin: room.capacity, // capacity를 capacityMin으로 매핑
      capacityMax: room.capacity, // capacity를 capacityMax로도 매핑 (실제로는 capacity만 있음)
      basePrice: room.basePrice,
      totalRooms: 1, // totalRooms는 스키마에 없으므로 기본값 1
      description: room.description || '',
      amenities: room.amenities || [],
      images: room.images || [],
      mainImage: room.images && room.images.length > 0 ? room.images[0] : null,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt
    }));
    
    // 프런트 BusinessRoomManagePage 에서 data.rooms 로 사용
    res.json({ rooms: formattedRooms });
  } catch (error) {
    res.status(500).json({ message: '객실 목록 조회 실패', error });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;
    
    // isActive가 true인 객실만 조회 (삭제된 객실 제외)
    const room = await Room.findOne({ _id: roomId, isActive: true }).populate('hotelId');
    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }
    
    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: room.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    // 프론트엔드가 기대하는 형식으로 변환
    const formattedRoom = {
      _id: room._id,
      name: room.name,
      nameEn: room.type, // type을 nameEn으로 매핑
      roomSize: room.roomSize || '', // roomSize는 이제 스키마에 있음
      capacityMin: room.capacity || 2, // capacity를 capacityMin으로 매핑
      capacityMax: room.capacity || 4, // capacity를 capacityMax로도 매핑
      basePrice: room.basePrice || 0, // basePrice가 없으면 0
      totalRooms: 1, // totalRooms는 스키마에 없으므로 기본값 1
      description: room.description || '',
      amenities: room.amenities || [],
      images: room.images || [],
      mainImage: room.images && room.images.length > 0 ? room.images[0] : null
    };
    
    // 프런트 BusinessRoomEditPage 에서 객실 객체를 그대로 사용
    res.json(formattedRoom);
  } catch (error) {
    res.status(500).json({ message: '객실 조회 실패', error });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const userId = req.user._id;
    
    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: hotelId, ownerId: userId });
    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }
    
    // 프론트엔드 필드를 백엔드 스키마에 맞게 변환
    const roomData = {
      name: req.body.name,
      type: req.body.type || req.body.nameEn || 'standard', // type이 없으면 nameEn 또는 기본값 사용
      capacity: req.body.capacity || req.body.capacityMin || 2, // capacityMin을 capacity로 매핑
      roomSize: req.body.roomSize || '', // roomSize는 이제 스키마에 있음
      basePrice: req.body.basePrice || 0,
      description: req.body.description || '',
      amenities: req.body.amenities || [],
      images: Array.isArray(req.body.images) ? req.body.images.filter(img => img && img.trim()) : [], // 빈 문자열 제거
      hotelId
    };
    
    const newRoom = new Room(roomData);
    
    await newRoom.save();
    console.log('객실 생성 완료:', { id: newRoom._id, name: newRoom.name, hotelId: hotelId });
    res.status(201).json({ message: '객실 생성 성공', room: newRoom });
  } catch (error) {
    console.error('객실 생성 에러:', error);
    res.status(500).json({ message: '객실 생성 실패', error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;
    
    // isActive가 true인 객실만 수정 가능 (삭제된 객실 제외)
    const room = await Room.findOne({ _id: roomId, isActive: true }).populate('hotelId');
    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }
    
    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: room.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    // 프론트엔드 필드를 백엔드 스키마에 맞게 변환하여 업데이트
    if (req.body.name !== undefined) {
      room.name = req.body.name;
    }
    if (req.body.type !== undefined) {
      room.type = req.body.type;
    } else if (req.body.nameEn !== undefined) {
      // nameEn이 오면 type으로 사용 (기존 로직 유지)
      room.type = req.body.nameEn;
    }
    if (req.body.capacity !== undefined) {
      room.capacity = req.body.capacity;
    } else if (req.body.capacityMin !== undefined) {
      // capacityMin이 오면 capacity로 매핑
      room.capacity = req.body.capacityMin;
    }
    if (req.body.roomSize !== undefined) {
      room.roomSize = req.body.roomSize; // roomSize는 이제 스키마에 있음
    }
    if (req.body.basePrice !== undefined) {
      room.basePrice = req.body.basePrice;
    }
    if (req.body.description !== undefined) {
      room.description = req.body.description;
    }
    if (req.body.amenities !== undefined) {
      room.amenities = req.body.amenities;
    }
    if (req.body.images !== undefined) {
      room.images = req.body.images;
    }
    
    // 변경사항이 있는지 확인
    const hasChanges = req.body.name !== undefined || 
                      req.body.type !== undefined || 
                      req.body.nameEn !== undefined ||
                      req.body.capacity !== undefined || 
                      req.body.capacityMin !== undefined ||
                      req.body.roomSize !== undefined ||
                      req.body.basePrice !== undefined || 
                      req.body.description !== undefined || 
                      req.body.amenities !== undefined || 
                      req.body.images !== undefined;
    
    if (!hasChanges) {
      return res.json({ message: '변경사항이 없습니다.', room });
    }
    
    await room.save();
    console.log('객실 수정 완료:', { id: room._id, name: room.name });
    
    res.json({ message: '객실 수정 성공', room });
  } catch (error) {
    console.error('객실 수정 에러:', error);
    res.status(500).json({ message: '객실 수정 실패', error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;
    
    // isActive가 true인 객실만 삭제 가능 (이미 삭제된 객실 제외)
    const room = await Room.findOne({ _id: roomId, isActive: true }).populate('hotelId');
    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }
    
    // 호텔 소유권 확인
    const hotel = await Hotel.findOne({ _id: room.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    // 예약이 있는지 확인 (선택적 - 예약이 있으면 삭제 불가)
    const Booking = require('../bookings/Booking');
    const existingBooking = await Booking.findOne({ roomId: roomId, status: { $ne: 'cancelled' } });
    if (existingBooking) {
      return res.status(400).json({ 
        message: '예약이 있는 객실은 삭제할 수 없습니다. 먼저 예약을 취소해주세요.' 
      });
    }
    
    // 실제 삭제 대신 isActive를 false로 설정 (소프트 삭제)
    room.isActive = false;
    await room.save();
    console.log('객실 삭제 완료:', { id: room._id, name: room.name, isActive: room.isActive });
    
    res.json({ message: '객실이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '객실 삭제 실패', error: error.message });
  }
};

