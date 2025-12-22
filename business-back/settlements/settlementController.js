const Settlement = require('./Settlement');

exports.getSettlements = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, status } = req.query;
    
    const query = { businessUser: userId };
    if (month) query.month = month;
    if (status) query.status = status;
    
    const settlements = await Settlement.find(query)
      .sort({ month: -1 });
    
    const totalAmount = settlements.reduce((sum, s) => sum + s.finalAmount, 0);
    
    // 프런트 BusinessSettlementPage 에서 data.settlements 로 사용
    res.json({
      settlements,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: '정산 내역 조회 실패', error });
  }
};

exports.getSettlementById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const settlement = await Settlement.findById(id);
    
    if (!settlement) {
      return res.status(404).json({ 
        success: false,
        message: '정산 내역을 찾을 수 없습니다.' 
      });
    }
    
    // 정산 내역 소유권 확인
    if (settlement.businessUser.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false,
        message: '접근 권한이 없습니다.' 
      });
    }
    
    res.json(settlement);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: '정산 내역 조회 실패', 
      error: error.message 
    });
  }
};

