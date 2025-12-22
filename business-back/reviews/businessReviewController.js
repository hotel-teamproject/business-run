const Review = require('./Review');
const Hotel = require('../hotels/Hotel');

// GET /business/reviews
exports.getReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 내 호텔 ID 목록 조회
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);
    
    const reviews = await Review.find({ hotelId: { $in: hotelIds } })
      .populate('hotelId', 'name')
      .sort({ createdAt: -1 });
    
    // 프런트엔드가 기대하는 형태로 변환
    const formattedReviews = reviews.map(review => ({
      _id: review._id,
      userName: review.authorName,
      starRating: review.rating,
      wroteOn: review.createdAt ? review.createdAt.toISOString().split('T')[0] : '',
      hotelName: review.hotelId?.name || '',
      title: '', // Review 모델에 title 필드가 없으므로 빈 문자열
      content: review.comment,
      reply: review.reply ? {
        content: review.reply.content,
        createdAt: review.reply.createdAt ? review.reply.createdAt.toISOString().split('T')[0] : ''
      } : null,
      rating: review.rating,
      authorName: review.authorName,
      createdAt: review.createdAt
    }));
    
    res.json({
      reviews: formattedReviews,
      totalPages: 1,
      currentPage: 1,
      total: formattedReviews.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '리뷰 목록 조회 실패', error: error.message });
  }
};

// GET /business/reviews/:id
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const review = await Review.findById(id).populate('hotelId', 'name ownerId');
    
    if (!review) {
      return res.status(404).json({ success: false, message: '리뷰를 찾을 수 없습니다.' });
    }
    
    // 호텔 소유권 확인
    if (review.hotelId.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: '접근 권한이 없습니다.' });
    }
    
    res.json({
      _id: review._id,
      userName: review.authorName,
      starRating: review.rating,
      wroteOn: review.createdAt ? review.createdAt.toISOString().split('T')[0] : '',
      hotelName: review.hotelId?.name || '',
      title: '',
      content: review.comment,
      reply: review.reply ? {
        content: review.reply.content,
        createdAt: review.reply.createdAt ? review.reply.createdAt.toISOString().split('T')[0] : ''
      } : null,
      rating: review.rating,
      authorName: review.authorName,
      createdAt: review.createdAt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '리뷰 조회 실패', error: error.message });
  }
};

// POST /business/reviews/:id/reply
exports.replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
    const review = await Review.findById(id).populate('hotelId', 'ownerId');
    
    if (!review) {
      return res.status(404).json({ success: false, message: '리뷰를 찾을 수 없습니다.' });
    }
    
    // 호텔 소유권 확인
    if (review.hotelId.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: '접근 권한이 없습니다.' });
    }
    
    review.reply = {
      content,
      authorId: userId,
      createdAt: new Date()
    };
    
    await review.save();
    
    res.json({
      success: true,
      message: '답변이 작성되었습니다.',
      reply: {
        content: review.reply.content,
        createdAt: review.reply.createdAt ? review.reply.createdAt.toISOString().split('T')[0] : ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '답변 작성 실패', error: error.message });
  }
};

// PUT /business/reviews/:id/reply
exports.updateReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
    const review = await Review.findById(id).populate('hotelId', 'ownerId');
    
    if (!review) {
      return res.status(404).json({ success: false, message: '리뷰를 찾을 수 없습니다.' });
    }
    
    // 호텔 소유권 확인
    if (review.hotelId.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: '접근 권한이 없습니다.' });
    }
    
    // 답변이 없으면 에러
    if (!review.reply) {
      return res.status(400).json({ success: false, message: '수정할 답변이 없습니다.' });
    }
    
    // 답변 작성자 확인 (선택적 - 같은 사업자면 수정 가능)
    if (review.reply.authorId && review.reply.authorId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: '답변 수정 권한이 없습니다.' });
    }
    
    // 답변 내용 업데이트
    review.reply.content = content;
    review.reply.updatedAt = new Date();
    
    await review.save();
    
    res.json({
      success: true,
      message: '답변이 수정되었습니다.',
      reply: {
        content: review.reply.content,
        createdAt: review.reply.createdAt ? review.reply.createdAt.toISOString().split('T')[0] : '',
        updatedAt: review.reply.updatedAt ? review.reply.updatedAt.toISOString().split('T')[0] : ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '답변 수정 실패', error: error.message });
  }
};

// DELETE /business/reviews/:id/reply
exports.deleteReply = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const review = await Review.findById(id).populate('hotelId', 'ownerId');
    
    if (!review) {
      return res.status(404).json({ success: false, message: '리뷰를 찾을 수 없습니다.' });
    }
    
    // 호텔 소유권 확인
    if (review.hotelId.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: '접근 권한이 없습니다.' });
    }
    
    // 답변이 없으면 에러
    if (!review.reply) {
      return res.status(400).json({ success: false, message: '삭제할 답변이 없습니다.' });
    }
    
    // 답변 삭제
    review.reply = undefined;
    
    await review.save();
    
    res.json({
      success: true,
      message: '답변이 삭제되었습니다.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '답변 삭제 실패', error: error.message });
  }
};

// POST /business/reviews/:id/report
exports.reportReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, content } = req.body;
    const userId = req.user._id;
    
    const review = await Review.findById(id).populate('hotelId', 'ownerId');
    
    if (!review) {
      return res.status(404).json({ success: false, message: '리뷰를 찾을 수 없습니다.' });
    }
    
    // 호텔 소유권 확인
    if (review.hotelId.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: '접근 권한이 없습니다.' });
    }
    
    // 리뷰 신고 처리 (Review 모델의 isReported, reportCount, reportReason 필드 업데이트)
    review.isReported = true;
    review.reportCount = (review.reportCount || 0) + 1;
    review.reportReason = reason || content || '사업자 신고';
    review.reportStatus = 'pending';
    
    await review.save();
    
    res.json({
      success: true,
      message: '리뷰 신고가 접수되었습니다.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '리뷰 신고 실패', error: error.message });
  }
};

