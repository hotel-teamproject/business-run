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
      reply: review.reply || null,
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
      reply: review.reply || null,
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
      reply: review.reply
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '답변 작성 실패', error: error.message });
  }
};

