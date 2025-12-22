const jwt = require('jsonwebtoken');
const User = require('./User');

// JWT 토큰 생성 헬퍼
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// 응답용 사용자 데이터 정제
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

// POST /admin/auth/login, POST /business/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('로그인 시도:', { email, hasPassword: !!password });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email과 password가 필요합니다.',
      });
    }

    // password 필드를 명시적으로 선택 (select: false가 설정되어 있을 수 있음)
    const user = await User.findOne({ email }).select('+password');
    console.log('사용자 조회 결과:', user ? { id: user._id, email: user.email, role: user.role, isActive: user.isActive, hasPassword: !!user.password } : '없음');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: '비활성화된 계정입니다.',
      });
    }

    // 사업자/관리자 역할만 허용 (현재는 business 중심)
    if (!['business', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: '접근 권한이 없는 계정입니다.',
      });
    }

    // JWT_SECRET 확인
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET이 설정되지 않았습니다!');
      return res.status(500).json({
        success: false,
        message: '서버 설정 오류가 발생했습니다.',
      });
    }

    // 디버깅: 비밀번호 비교 전 정보 확인
    console.log('비밀번호 비교 전:');
    console.log('  - 입력한 비밀번호:', password);
    console.log('  - DB에 저장된 해시:', user.password ? user.password.substring(0, 20) + '...' : '없음');
    console.log('  - 해시 길이:', user.password ? user.password.length : 0);
    
    const isMatch = await user.comparePassword(password);
    console.log('비밀번호 비교 결과:', isMatch);
    
    // 비교 실패 시 추가 디버깅
    if (!isMatch) {
      const bcrypt = require('bcryptjs');
      const directCompare = await bcrypt.compare(password, user.password);
      console.log('직접 bcrypt.compare 결과:', directCompare);
      console.log('해시값 전체:', user.password);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    const token = generateToken(user);
    const sanitized = sanitizeUser(user);
    console.log('로그인 성공:', { userId: user._id, email: user.email, hasToken: !!token });

    // 프런트엔드 business-front의 기대 응답 형태에 맞춤
    // - 사업자 로그인: { token, user }
    // - 관리자 로그인: { token, admin, user } (adminAuthApi에서 admin 필드를 사용)
    if (user.role === 'admin') {
      return res.json({
        token,
        admin: sanitized,
        user: sanitized,
      });
    }

    // 기본(사업자) 응답 - 프론트엔드 형식에 맞게 변환
    // 사업자명과 사업장 주소는 호텔 정보에서 가져옴 (로그인 시에는 첫 번째 호텔 사용)
    const Hotel = require('../hotels/Hotel');
    const firstHotel = await Hotel.findOne({ ownerId: user._id }).select('name address').lean();
    
    const formattedUser = {
      ...sanitized,
      businessName: firstHotel?.name || '',      // 호텔 이름 → businessName (사업자명)
      ownerName: sanitized.name,                 // name → ownerName (대표자 이름)
      businessPhone: sanitized.phone,           // phone → businessPhone (사업자 연락처)
      businessAddress: firstHotel?.address || '', // 호텔 주소 → businessAddress (사업장 주소)
      businessEmail: sanitized.email,            // email → businessEmail (호환성)
      isApproved: sanitized.isActive,            // isActive → isApproved (호환성)
    };

    return res.json({
      token,
      user: formattedUser,
    });
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({
      success: false,
      message: '로그인 처리 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// POST /admin/auth/logout
// 서버 측 상태를 두지 않으므로 단순 200 응답
exports.logout = async (req, res) => {
  return res.json({
    success: true,
    message: '로그아웃되었습니다.',
  });
};

// GET /admin/auth/me, GET /business/auth/me
exports.getMyInfo = async (req, res) => {
  try {
    // verifyToken 에서 req.user 설정
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.',
      });
    }

    const user = sanitizeUser(req.user);
    
    // 사업자명은 사용자의 첫 번째 호텔 이름에서 가져옴
    const Hotel = require('../hotels/Hotel');
    const firstHotel = await Hotel.findOne({ ownerId: user._id }).select('name address').lean();
    
    // 프론트엔드가 기대하는 형식으로 변환
    // name 필드는 대표자 이름으로 사용
    // businessName은 호텔 이름에서 가져옴 (없으면 빈 문자열)
    const formattedUser = {
      ...user,
      businessName: firstHotel?.name || '',  // 호텔 이름 → businessName (사업자명)
      ownerName: user.name,                  // name → ownerName (대표자 이름)
      businessPhone: user.phone,             // phone → businessPhone (사업자 연락처)
      businessAddress: firstHotel?.address || '',  // 호텔 주소 → businessAddress (사업장 주소)
      businessEmail: user.email,             // email → businessEmail (호환성)
      isApproved: user.isActive,             // isActive → isApproved (호환성)
    };

    return res.json(formattedUser);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '내 정보 조회 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// PUT /admin/auth/password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.',
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'currentPassword와 newPassword가 필요합니다.',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: '현재 비밀번호가 올바르지 않습니다.',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: '비밀번호가 변경되었습니다.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '비밀번호 변경 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// POST /admin/auth/forgot-password
// 실제 이메일 발송 대신 성공 응답만 반환 (프런트 mock과 맞춤)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'email이 필요합니다.',
      });
    }

    // TODO: 실제 서비스에서는 비밀번호 재설정 토큰 발급 및 이메일 발송 구현

    return res.json({
      success: true,
      message: '비밀번호 재설정 요청이 접수되었습니다.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '비밀번호 재설정 요청 처리 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// POST /business/auth/apply - 사업자 신청 (회원가입)
exports.applyBusiness = async (req, res) => {
  try {
    const { email, password, name, businessNumber, phone } = req.body;

    // 필수 필드 검증
    if (!email || !password || !name || !businessNumber || !phone) {
      return res.status(400).json({
        success: false,
        message: '모든 필수 필드를 입력해주세요.',
      });
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 최소 6자 이상이어야 합니다.',
      });
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '이미 등록된 이메일입니다.',
      });
    }

    // 사업자 번호 중복 확인
    const existingBusinessNumber = await User.findOne({ businessNumber });
    if (existingBusinessNumber) {
      return res.status(400).json({
        success: false,
        message: '이미 등록된 사업자 번호입니다.',
      });
    }

    // 새 사용자 생성
    const newUser = new User({
      email,
      password, // pre('save') 훅에서 자동 해싱
      name,
      businessNumber,
      phone,
      role: 'business',
      isActive: true,
    });

    await newUser.save();

    // JWT 토큰 생성
    const token = generateToken(newUser);
    const sanitized = sanitizeUser(newUser);

    return res.status(201).json({
      success: true,
      message: '사업자 신청이 완료되었습니다.',
      token,
      user: sanitized,
    });
  } catch (error) {
    console.error('applyBusiness error:', error);
    
    // MongoDB 중복 키 에러 처리
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `이미 등록된 ${field === 'email' ? '이메일' : '사업자 번호'}입니다.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: '사업자 신청 처리 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};


