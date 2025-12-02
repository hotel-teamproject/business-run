const Review = require('./Review');
const Hotel = require('../hotels/Hotel');

// 공통: 필터 빌더
const buildFilterFromQuery = (query) => {
  const filter = {};

  if (query.hotelId) {
    filter.hotelId = query.hotelId;
  }
  if (query.roomId) {
    filter.roomId = query.roomId;
  }
  if (query.minRating || query.maxRating) {
    filter.rating = {};
    if (query.minRating) filter.rating.$gte = Number(query.minRating);
    if (query.maxRating) filter.rating.$lte = Number(query.maxRating);
  }

  return filter;
};

// GET /business/reviews - 사업자가 소유한 호텔의 리뷰 목록 조회
exports.getReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;

    // 사업자가 소유한 호텔 ID 목록 조회
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);

    if (hotelIds.length === 0) {
      return res.json({
        success: true,
        data: {
          items: [],
          total: 0,
          page: Number(page),
          limit: Number(limit),
        },
      });
    }

    const filter = buildFilterFromQuery(req.query);
    filter.hotelId = { $in: hotelIds };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Review.find(filter)
        .populate('hotelId', 'name')
        .populate('roomId', 'name')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        items,
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '리뷰 목록 조회 실패', error });
  }
};

// GET /business/reviews/:id - 사업자가 소유한 호텔의 리뷰 상세 조회
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // 사업자가 소유한 호텔 ID 목록 조회
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);

    const review = await Review.findOne({ _id: id, hotelId: { $in: hotelIds } })
      .populate('hotelId', 'name')
      .populate('roomId', 'name');

    if (!review) {
      return res.status(404).json({ success: false, message: '리뷰를 찾을 수 없습니다.' });
    }

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: '리뷰 조회 실패', error });
  }
};

// POST /business/reviews/:id/reply - 리뷰에 답변 작성
exports.replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: '답변 내용을 입력해주세요.' });
    }

    // 사업자가 소유한 호텔 ID 목록 조회
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);

    const review = await Review.findOne({ _id: id, hotelId: { $in: hotelIds } });

    if (!review) {
      return res.status(404).json({ success: false, message: '리뷰를 찾을 수 없습니다.' });
    }

    review.reply = {
      content: content.trim(),
      authorId: userId,
      createdAt: new Date(),
    };

    await review.save();

    res.json({ success: true, message: '답변이 작성되었습니다.', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: '답변 작성 실패', error });
  }
};

// POST /business/reviews/:id/report - 리뷰 신고
exports.reportReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, content } = req.body;
    const userId = req.user._id;

    // 사업자가 소유한 호텔 ID 목록 조회
    const myHotels = await Hotel.find({ ownerId: userId }).select('_id');
    const hotelIds = myHotels.map(h => h._id);

    const review = await Review.findOne({ _id: id, hotelId: { $in: hotelIds } });

    if (!review) {
      return res.status(404).json({ success: false, message: '리뷰를 찾을 수 없습니다.' });
    }

    review.isReported = true;
    review.reportCount = (review.reportCount || 0) + 1;
    review.reportReason = reason || content || '사업자 신고';
    review.reportStatus = 'pending';

    await review.save();

    res.json({ success: true, message: '리뷰 신고가 접수되었습니다.', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: '리뷰 신고 실패', error });
  }
};

