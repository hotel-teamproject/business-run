const Inventory = require('./Inventory');
const Room = require('../rooms/Room');
const Hotel = require('../hotels/Hotel');

exports.getInventory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { startDate, endDate } = req.query;
    const userId = req.user._id;
    
    // 객실 소유권 확인
    const room = await Room.findById(roomId).populate('hotelId');
    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }
    
    const hotel = await Hotel.findOne({ _id: room.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    const query = { room: roomId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const inventories = await Inventory.find(query).sort({ date: 1 });
    // 프런트 BusinessInventoryPage는 { inventory: [...] } 형태를 기대
    res.json({ inventory: inventories });
  } catch (error) {
    res.status(500).json({ message: '재고 조회 실패', error });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { roomId, date: dateParam } = req.params;
    const { date: dateBody, totalRooms, availableRooms, priceOverride, status } = req.body;
    const userId = req.user._id;
    
    // 객실 소유권 확인
    const room = await Room.findById(roomId).populate('hotelId');
    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }
    
    const hotel = await Hotel.findOne({ _id: room.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    // 재고 정보를 찾아서 업데이트하거나 새로 생성
    const updateData = {
      totalRooms,
      availableCount: availableRooms,
      status: status || (availableRooms > 0 ? 'available' : 'soldout')
    };
    
    if (priceOverride !== undefined) {
      updateData.priceOverride = priceOverride;
    }
    
    // 경로 파라미터 우선, 없으면 바디의 date 사용
    const targetDate = dateParam || dateBody;

    const inventory = await Inventory.findOneAndUpdate(
      { room: roomId, date: new Date(targetDate) },
      updateData,
      { new: true, upsert: true }
    );
    
    res.json({ message: '재고 업데이트 성공', inventory });
  } catch (error) {
    res.status(500).json({ message: '재고 업데이트 실패', error });
  }
};

exports.setPricePolicy = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { startDate, endDate, priceOverride } = req.body;
    const userId = req.user._id;
    
    // 객실 소유권 확인
    const room = await Room.findById(roomId).populate('hotelId');
    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }
    
    const hotel = await Hotel.findOne({ _id: room.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    // 기간 내 모든 날짜에 가격 정책 적용
    const start = new Date(startDate);
    const end = new Date(endDate);
    const operations = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      operations.push({
        updateOne: {
          filter: { room: roomId, date: new Date(d) },
          update: { $set: { priceOverride } },
          upsert: true
        }
      });
    }
    
    await Inventory.bulkWrite(operations);
    
    res.json({ message: '가격 정책 설정 성공' });
  } catch (error) {
    res.status(500).json({ message: '가격 정책 설정 실패', error });
  }
};

exports.getPricePolicy = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;
    const { startDate, endDate } = req.query;
    
    // 객실 소유권 확인
    const room = await Room.findById(roomId).populate('hotelId');
    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }
    
    const hotel = await Hotel.findOne({ _id: room.hotelId._id, ownerId: userId });
    if (!hotel) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    
    // 가격 정책 조회 (priceOverride가 설정된 재고 정보)
    const query = { room: roomId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // priceOverride가 있는 항목만 조회
    query.priceOverride = { $exists: true, $ne: null };
    
    const pricePolicies = await Inventory.find(query)
      .select('date priceOverride')
      .sort({ date: 1 })
      .lean();
    
    // 프론트엔드가 기대하는 형태로 변환
    const policies = pricePolicies.map(policy => ({
      date: policy.date ? policy.date.toISOString().split('T')[0] : '',
      priceOverride: policy.priceOverride
    }));
    
    res.json({ 
      roomId,
      policies,
      basePrice: room.basePrice || room.price || 0
    });
  } catch (error) {
    res.status(500).json({ message: '가격 정책 조회 실패', error: error.message });
  }
};

