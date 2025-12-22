// MongoDB 초기 데이터 삽입 스크립트 (사업자용)
// 사용법: mongosh business-back --file init-business-data.js

print("🚀 사업자용 초기 데이터 생성 시작...");

// 데이터베이스 선택
db = db.getSiblingDB("hotel-business");

// 기존 데이터 삭제
print("기존 데이터 삭제 중...");
db.users.deleteMany({});
db.hotels.deleteMany({});
db.rooms.deleteMany({});
db.bookings.deleteMany({});
db.reviews.deleteMany({});
db.inventories.deleteMany({});

// ===== 사업자 사용자 생성 =====
print("사업자 사용자 생성 중...");

// 주의: Mongoose의 pre('save') 훅이 작동하려면 평문 비밀번호를 넣어야 합니다
// 하지만 insertMany는 훅을 실행하지 않으므로, 직접 해시값을 넣거나
// 각각 save()를 호출해야 합니다.
// 여기서는 이미 검증된 해시값을 사용합니다 (password: business1234)
// 
// 필드 설명:
// - name: 대표자 이름 (예: "홍길동")
// - businessNumber: 사업자 등록번호
// - phone: 사업자 연락처
// - 사업자명(businessName)과 사업장 주소(businessAddress)는 호텔 정보에서 자동으로 가져옴
const hashedPassword = "$2a$10$D3hQGRY/vHzcBc2QB20xFOERImEPkiE8L/IhpFg9X4NpVEvJioMjq";

const businessUsers = [
  {
    email: "wow@hotel.com",
    password: hashedPassword,
    name: "홍길동",  // 대표자 이름
    role: "business",
    businessNumber: "123-45-67890",
    phone: "02-1234-5678",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: "korea@hotel.com",
    password: hashedPassword,
    name: "김영희",  // 대표자 이름
    role: "business",
    businessNumber: "234-56-78901",
    phone: "051-2345-6789",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: "seoul@hotel.com",
    password: hashedPassword,
    name: "이철수",  // 대표자 이름
    role: "business",
    businessNumber: "345-67-89012",
    phone: "02-3456-7890",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: "busan@hotel.com",
    password: hashedPassword,
    name: "박민수",  // 대표자 이름
    role: "business",
    businessNumber: "456-78-90123",
    phone: "051-3456-7890",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: "jeju@hotel.com",
    password: hashedPassword,
    name: "최지영",  // 대표자 이름
    role: "business",
    businessNumber: "567-89-01234",
    phone: "064-1234-5678",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const insertedUsers = db.users.insertMany(businessUsers);
const userIds = Object.values(insertedUsers.insertedIds);
print(`✅ 사업자 사용자 ${userIds.length}명 생성 완료`);

// ===== 호텔 데이터 삽입 =====
print("호텔 데이터 생성 중...");

db.hotels.insertMany([
  {
    ownerId: userIds[0], // 홍길동 (대표자 이름)
    name: "롯데호텔 서울",  // 사업자명으로 사용됨
    address: "서울특별시 중구 을지로 30",
    city: "서울",
    description: "서울 중심부 명동에 위치한 5성급 호텔",
    rating: 4.5,
    amenities: ["무료 WiFi", "수영장", "피트니스", "레스토랑", "주차장"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    ],
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: userIds[1], // 김영희 (대표자 이름)
    name: "해운대 그랜드 호텔",  // 사업자명으로 사용됨
    address: "부산광역시 해운대구 해운대해변로 296",
    city: "부산",
    description: "해운대 해변이 한눈에 보이는 오션뷰 호텔",
    rating: 4.3,
    amenities: ["무료 WiFi", "오션뷰", "조식 포함", "주차장"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop",
    ],
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: userIds[2], // 이철수 (대표자 이름)
    name: "제주 신라호텔",  // 사업자명으로 사용됨
    address: "제주특별자치도 서귀포시 중문관광로 72번길 75",
    city: "제주",
    description: "제주 중문 리조트에 위치한 럭셔리 호텔",
    rating: 4.7,
    amenities: ["무료 WiFi", "스파", "골프장", "해변 접근", "키즈클럽"],
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
    ],
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: userIds[0], // 홍길동 (두 번째 호텔)
    name: "강릉 씨마크호텔",  // 사업자명으로 사용됨
    address: "강원특별자치도 강릉시 창해로 307",
    city: "강릉",
    description: "동해바다를 마주한 힐링 호텔",
    rating: 4.4,
    amenities: ["무료 WiFi", "오션뷰", "조식 포함", "주차장", "사우나"],
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    ],
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: userIds[1], // 김영희 (두 번째 호텔)
    name: "서울 파크하얏트",  // 사업자명으로 사용됨
    address: "서울특별시 강남구 테헤란로 606",
    city: "서울",
    description: "강남 중심부의 프리미엄 비즈니스 호텔",
    rating: 4.6,
    amenities: ["무료 WiFi", "루프탑 바", "피트니스", "비즈니스 센터", "발렛파킹"],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    ],
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: userIds[3], // 박민수 (대표자 이름)
    name: "부산 웨스틴 조선",  // 사업자명으로 사용됨
    address: "부산광역시 중구 중구로 67",
    city: "부산",
    description: "부산의 랜드마크 럭셔리 호텔",
    rating: 4.5,
    amenities: ["무료 WiFi", "실내수영장", "스파", "레스토랑", "주차장"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop",
    ],
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: userIds[4], // 최지영 (대표자 이름)
    name: "여수 히든베이호텔",  // 사업자명으로 사용됨
    address: "전라남도 여수시 돌산읍 무슬목길 142",
    city: "여수",
    description: "여수 밤바다가 보이는 낭만 호텔",
    rating: 4.6,
    amenities: ["무료 WiFi", "오션뷰", "루프탑", "조식 포함", "주차장"],
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&h=600&fit=crop",
    ],
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: userIds[2], // 이철수 (두 번째 호텔)
    name: "경주 코모도호텔",  // 사업자명으로 사용됨
    address: "경상북도 경주시 보문로 424-7",
    city: "경주",
    description: "보문단지 내 호수가 보이는 리조트 호텔",
    rating: 4.2,
    amenities: ["무료 WiFi", "수영장", "자전거 대여", "조식 포함", "주차장"],
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    ],
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: userIds[0], // 홍길동 (세 번째 호텔)
    name: "인천 파라다이스 시티",  // 사업자명으로 사용됨
    address: "인천광역시 중구 영종해안남로321번길 186",
    city: "인천",
    description: "공항 근처의 복합 리조트 호텔",
    rating: 4.7,
    amenities: ["무료 WiFi", "카지노", "스파", "수영장", "쇼핑몰", "무료 셔틀"],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    ],
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✅ 호텔", db.hotels.countDocuments(), "개 생성 완료");

// 호텔 ID 가져오기
const hotels = db.hotels.find().toArray();
const hotel1 = hotels[0]._id; // 롯데호텔 서울
const hotel2 = hotels[1]._id; // 해운대 그랜드 호텔
const hotel3 = hotels[2]._id; // 제주 신라호텔
const hotel4 = hotels[3]._id; // 강릉 씨마크호텔
const hotel5 = hotels[4]._id; // 서울 파크하얏트
const hotel6 = hotels[5]._id; // 부산 웨스틴 조선

// ===== Rooms 데이터 삽입 =====
print("객실 데이터 생성 중...");

db.rooms.deleteMany({});

db.rooms.insertMany([
  // 롯데호텔 서울 객실
  {
    hotelId: hotel1,
    name: "디럭스 더블룸",
    type: "더블",
    basePrice: 250000,
    capacity: 2,
    description: "시티뷰가 보이는 넓은 디럭스 룸",
    amenities: ["킹 베드", "시티뷰", "무료 WiFi", "미니바", "욕조"],
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel1,
    name: "이그제큐티브 스위트",
    type: "스위트",
    basePrice: 450000,
    capacity: 4,
    description: "럭셔리한 스위트룸",
    amenities: ["킹 베드", "거실", "시티뷰", "무료 WiFi", "욕조", "네스프레소"],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel1,
    name: "스탠다드 트윈룸",
    type: "트윈",
    basePrice: 220000,
    capacity: 2,
    description: "편안한 트윈룸",
    amenities: ["트윈 베드", "무료 WiFi", "미니바", "샤워부스"],
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 해운대 그랜드 호텔 객실
  {
    hotelId: hotel2,
    name: "오션뷰 더블룸",
    type: "더블",
    basePrice: 180000,
    capacity: 2,
    description: "해운대 해변이 한눈에 보이는 오션뷰 룸",
    amenities: ["킹 베드", "오션뷰", "발코니", "무료 WiFi", "욕조"],
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel2,
    name: "패밀리 스위트",
    type: "스위트",
    basePrice: 320000,
    capacity: 4,
    description: "가족 여행에 최적화된 스위트룸",
    amenities: ["킹 베드", "소파베드", "오션뷰", "발코니", "주방", "세탁기"],
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel2,
    name: "스탠다드 시티뷰",
    type: "더블",
    basePrice: 150000,
    capacity: 2,
    description: "합리적인 가격의 시티뷰 룸",
    amenities: ["퀸 베드", "시티뷰", "무료 WiFi", "샤워부스"],
    images: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 제주 신라호텔 객실
  {
    hotelId: hotel3,
    name: "프리미엄 오션뷰",
    type: "더블",
    basePrice: 320000,
    capacity: 2,
    description: "제주 바다가 보이는 프리미엄 룸",
    amenities: ["킹 베드", "오션뷰", "발코니", "무료 WiFi", "욕조", "네스프레소"],
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel3,
    name: "로얄 스위트",
    type: "스위트",
    basePrice: 650000,
    capacity: 4,
    description: "최고급 로얄 스위트룸",
    amenities: ["킹 베드", "거실", "오션뷰", "프라이빗 풀", "욕조", "네스프레소", "버틀러 서비스"],
    images: [
      "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel3,
    name: "가든뷰 트윈룸",
    type: "트윈",
    basePrice: 280000,
    capacity: 2,
    description: "조용한 가든뷰 트윈룸",
    amenities: ["트윈 베드", "가든뷰", "발코니", "무료 WiFi", "욕조"],
    images: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 강릉 씨마크호텔 객실
  {
    hotelId: hotel4,
    name: "오션뷰 더블룸",
    type: "더블",
    basePrice: 160000,
    capacity: 2,
    description: "동해바다가 보이는 오션뷰 룸",
    amenities: ["킹 베드", "오션뷰", "발코니", "무료 WiFi", "욕조"],
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel4,
    name: "스탠다드 트윈룸",
    type: "트윈",
    basePrice: 140000,
    capacity: 2,
    description: "편안한 트윈룸",
    amenities: ["트윈 베드", "무료 WiFi", "샤워부스"],
    images: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 서울 파크하얏트 객실
  {
    hotelId: hotel5,
    name: "비즈니스 스위트",
    type: "스위트",
    basePrice: 380000,
    capacity: 2,
    description: "비즈니스 여행객을 위한 스위트룸",
    amenities: ["킹 베드", "거실", "무료 WiFi", "비즈니스 데스크", "욕조"],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel5,
    name: "디럭스 더블룸",
    type: "더블",
    basePrice: 280000,
    capacity: 2,
    description: "강남 뷰가 보이는 디럭스 룸",
    amenities: ["킹 베드", "시티뷰", "무료 WiFi", "미니바", "욕조"],
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 부산 웨스틴 조선 객실
  {
    hotelId: hotel6,
    name: "프리미엄 오션뷰",
    type: "더블",
    basePrice: 220000,
    capacity: 2,
    description: "부산항이 보이는 오션뷰 룸",
    amenities: ["킹 베드", "오션뷰", "발코니", "무료 WiFi", "욕조"],
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel6,
    name: "스탠다드 더블룸",
    type: "더블",
    basePrice: 180000,
    capacity: 2,
    description: "합리적인 가격의 더블룸",
    amenities: ["퀸 베드", "무료 WiFi", "샤워부스"],
    images: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✅ 객실", db.rooms.countDocuments(), "개 생성 완료");

// 객실 ID 가져오기
const rooms = db.rooms.find().toArray();

// ===== 예약 데이터 삽입 (사업자가 관리할 예약들) =====
print("예약 데이터 생성 중...");

db.bookings.deleteMany({});

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const nextWeekPlus2 = new Date(nextWeek);
nextWeekPlus2.setDate(nextWeekPlus2.getDate() + 2);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const lastWeekPlus2 = new Date(lastWeek);
lastWeekPlus2.setDate(lastWeekPlus2.getDate() + 2);

db.bookings.insertMany([
  // 롯데호텔 서울 예약들
  {
    hotelId: hotel1,
    roomId: rooms[0]._id,
    guestName: "김고객",
    guestEmail: "guest1@example.com",
    guestPhone: "010-1234-5678",
    checkIn: tomorrow,
    checkOut: dayAfter,
    numberOfGuests: 2,
    totalPrice: 500000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel1,
    roomId: rooms[1]._id,
    guestName: "이예약",
    guestEmail: "guest2@example.com",
    guestPhone: "010-2345-6789",
    checkIn: nextWeek,
    checkOut: nextWeekPlus2,
    numberOfGuests: 2,
    totalPrice: 900000,
    status: "pending",
    paymentStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel1,
    roomId: rooms[0]._id,
    guestName: "박완료",
    guestEmail: "guest3@example.com",
    guestPhone: "010-3456-7890",
    checkIn: lastWeek,
    checkOut: lastWeekPlus2,
    numberOfGuests: 2,
    totalPrice: 500000,
    status: "completed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 해운대 그랜드 호텔 예약들
  {
    hotelId: hotel2,
    roomId: rooms[3]._id,
    guestName: "최해변",
    guestEmail: "guest4@example.com",
    guestPhone: "010-4567-8901",
    checkIn: lastWeek,
    checkOut: lastWeekPlus2,
    numberOfGuests: 2,
    totalPrice: 360000,
    status: "completed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel2,
    roomId: rooms[4]._id,
    guestName: "정가족",
    guestEmail: "guest5@example.com",
    guestPhone: "010-5678-9012",
    checkIn: lastWeek,
    checkOut: lastWeekPlus2,
    numberOfGuests: 4,
    totalPrice: 640000,
    status: "completed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel2,
    roomId: rooms[3]._id,
    guestName: "강취소",
    guestEmail: "guest6@example.com",
    guestPhone: "010-6789-0123",
    checkIn: lastWeek,
    checkOut: lastWeekPlus2,
    numberOfGuests: 2,
    totalPrice: 360000,
    status: "cancelled",
    paymentStatus: "refunded",
    cancelReason: "개인 사정으로 인한 취소",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 제주 신라호텔 예약들
  {
    hotelId: hotel3,
    roomId: rooms[6]._id,
    guestName: "윤제주",
    guestEmail: "guest7@example.com",
    guestPhone: "010-7890-1234",
    checkIn: lastWeek,
    checkOut: lastWeekPlus2,
    numberOfGuests: 2,
    totalPrice: 640000,
    status: "completed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotel3,
    roomId: rooms[8]._id,
    guestName: "장완료",
    guestEmail: "guest8@example.com",
    guestPhone: "010-8901-2345",
    checkIn: lastWeek,
    checkOut: lastWeekPlus2,
    numberOfGuests: 2,
    totalPrice: 560000,
    status: "completed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 강릉 씨마크호텔 예약
  {
    hotelId: hotel4,
    roomId: rooms[9]._id,
    guestName: "임강릉",
    guestEmail: "guest9@example.com",
    guestPhone: "010-9012-3456",
    checkIn: nextWeek,
    checkOut: nextWeekPlus2,
    numberOfGuests: 2,
    totalPrice: 320000,
    status: "pending",
    paymentStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 서울 파크하얏트 예약
  {
    hotelId: hotel5,
    roomId: rooms[11]._id,
    guestName: "한비즈",
    guestEmail: "guest10@example.com",
    guestPhone: "010-0123-4567",
    checkIn: tomorrow,
    checkOut: dayAfter,
    numberOfGuests: 2,
    totalPrice: 560000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 부산 웨스틴 조선 예약
  {
    hotelId: hotel6,
    roomId: rooms[13]._id,
    guestName: "신부산",
    guestEmail: "guest11@example.com",
    guestPhone: "010-1234-5678",
    checkIn: nextWeek,
    checkOut: nextWeekPlus2,
    numberOfGuests: 2,
    totalPrice: 360000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✅ 예약", db.bookings.countDocuments(), "개 생성 완료");

// 완료된 예약 ID 가져오기 (리뷰용)
const completedBookings = db.bookings.find({ status: "completed" }).toArray();
print(`✅ 완료된 예약 ${completedBookings.length}개 발견`);

// completed 예약이 5개 미만이면 에러 발생 가능
if (completedBookings.length < 5) {
  print(`⚠️ 경고: 완료된 예약이 ${completedBookings.length}개뿐입니다. 리뷰는 ${completedBookings.length}개만 생성됩니다.`);
}

// ===== 리뷰 데이터 삽입 (사업자 호텔에 대한 리뷰들) =====
print("리뷰 데이터 생성 중...");

db.reviews.deleteMany({});

// completed 예약이 있는 만큼만 리뷰 생성
const reviewsToInsert = [];

if (completedBookings.length > 0) {
  reviewsToInsert.push({
    hotelId: hotel1,
    roomId: rooms[0]._id,
    bookingId: completedBookings[0]._id,
    authorName: "박완료",
    authorEmail: "guest3@example.com",
    rating: 5,
    comment: "위치도 좋고 시설도 깨끗했어요. 직원분들도 친절하셨습니다. 다음에 또 이용하고 싶어요!",
    isReported: false,
    reportCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

if (completedBookings.length > 1) {
  reviewsToInsert.push({
    hotelId: hotel2,
    roomId: rooms[3]._id,
    bookingId: completedBookings[1]._id,
    authorName: "최해변",
    authorEmail: "guest4@example.com",
    rating: 5,
    comment: "오션뷰가 정말 환상적이었습니다! 해변 접근도 쉽고 가족 여행하기 좋았어요.",
    isReported: false,
    reportCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

if (completedBookings.length > 2) {
  reviewsToInsert.push({
    hotelId: hotel2,
    roomId: rooms[4]._id,
    bookingId: completedBookings[2]._id,
    authorName: "정가족",
    authorEmail: "guest5@example.com",
    rating: 4,
    comment: "패밀리 스위트가 넓어서 아이들과 지내기 좋았습니다. 주방이 있어서 편리했어요.",
    isReported: false,
    reportCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

if (completedBookings.length > 3) {
  reviewsToInsert.push({
    hotelId: hotel3,
    roomId: rooms[6]._id,
    bookingId: completedBookings[3]._id,
    authorName: "윤제주",
    authorEmail: "guest7@example.com",
    rating: 5,
    comment: "제주 여행의 하이라이트였습니다. 리조트 시설이 최고였고, 오션뷰가 정말 아름다웠어요!",
    isReported: false,
    reportCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

if (completedBookings.length > 4) {
  reviewsToInsert.push({
    hotelId: hotel3,
    roomId: rooms[8]._id,
    bookingId: completedBookings[4]._id,
    authorName: "장완료",
    authorEmail: "guest8@example.com",
    rating: 5,
    comment: "가든뷰도 예쁘고 조용해서 휴식하기 좋았습니다. 스파도 최고였어요. 강추!",
    isReported: false,
    reportCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

if (reviewsToInsert.length > 0) {
  db.reviews.insertMany(reviewsToInsert);
}

print("✅ 리뷰", db.reviews.countDocuments(), "개 생성 완료");

// ===== 정산 데이터 삽입 =====
print("정산 데이터 생성 중...");

db.settlements.deleteMany({});

// 현재 날짜 기준으로 이전 달들 생성
const now = new Date();
const currentMonth = now.getMonth(); // 0-11
const currentYear = now.getFullYear();

// 각 사업자별로 정산 데이터 생성
const settlementsToInsert = [];

// 1. 홍길동 (wow@hotel.com) - 롯데호텔 서울
// 완료된 예약들의 매출 합계 계산
const hongBookings = db.bookings.find({ 
  hotelId: hotel1,
  status: "completed"
}).toArray();

if (hongBookings.length > 0) {
  const hongRevenue = hongBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const platformFee = Math.floor(hongRevenue * 0.1); // 10% 수수료
  const tax = Math.floor((hongRevenue - platformFee) * 0.1); // 10% 세금
  const finalAmount = hongRevenue - platformFee - tax;
  
  // 지난 달 정산 완료
  const lastMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
  
  settlementsToInsert.push({
    businessUser: userIds[0],
    month: lastMonthStr,
    totalRevenue: hongRevenue,
    platformFee: platformFee,
    tax: tax,
    finalAmount: finalAmount,
    status: "completed",
    paymentDate: new Date(currentYear, currentMonth - 1, 15), // 지난 달 15일 지급 완료
    createdAt: new Date(currentYear, currentMonth - 1, 1),
    updatedAt: new Date(currentYear, currentMonth - 1, 15)
  });
}

// 2. 김한국 (korea@hotel.com) - 해운대 그랜드 호텔
const kimBookings = db.bookings.find({ 
  hotelId: hotel2,
  status: "completed"
}).toArray();

if (kimBookings.length > 0) {
  const kimRevenue = kimBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const platformFee = Math.floor(kimRevenue * 0.1);
  const tax = Math.floor((kimRevenue - platformFee) * 0.1);
  const finalAmount = kimRevenue - platformFee - tax;
  
  const lastMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
  
  settlementsToInsert.push({
    businessUser: userIds[1],
    month: lastMonthStr,
    totalRevenue: kimRevenue,
    platformFee: platformFee,
    tax: tax,
    finalAmount: finalAmount,
    status: "completed",
    paymentDate: new Date(currentYear, currentMonth - 1, 20), // 지난 달 20일 지급 완료
    createdAt: new Date(currentYear, currentMonth - 1, 1),
    updatedAt: new Date(currentYear, currentMonth - 1, 20)
  });
  
  // 2개월 전 정산도 추가 (더 많은 테스트 데이터)
  const twoMonthsAgo = new Date(currentYear, currentMonth - 2, 1);
  const twoMonthsAgoStr = `${twoMonthsAgo.getFullYear()}-${String(twoMonthsAgo.getMonth() + 1).padStart(2, '0')}`;
  
  settlementsToInsert.push({
    businessUser: userIds[1],
    month: twoMonthsAgoStr,
    totalRevenue: Math.floor(kimRevenue * 0.8), // 80% 매출
    platformFee: Math.floor(kimRevenue * 0.8 * 0.1),
    tax: Math.floor((kimRevenue * 0.8 - Math.floor(kimRevenue * 0.8 * 0.1)) * 0.1),
    finalAmount: Math.floor(kimRevenue * 0.8 * 0.9 * 0.9),
    status: "completed",
    paymentDate: new Date(currentYear, currentMonth - 2, 15),
    createdAt: new Date(currentYear, currentMonth - 2, 1),
    updatedAt: new Date(currentYear, currentMonth - 2, 15)
  });
}

// 3. 이철수 (seoul@hotel.com) - 제주 신라호텔
const leeBookings = db.bookings.find({ 
  hotelId: hotel3,
  status: "completed"
}).toArray();

if (leeBookings.length > 0) {
  const leeRevenue = leeBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const platformFee = Math.floor(leeRevenue * 0.1);
  const tax = Math.floor((leeRevenue - platformFee) * 0.1);
  const finalAmount = leeRevenue - platformFee - tax;
  
  const lastMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
  
  settlementsToInsert.push({
    businessUser: userIds[2],
    month: lastMonthStr,
    totalRevenue: leeRevenue,
    platformFee: platformFee,
    tax: tax,
    finalAmount: finalAmount,
    status: "completed",
    paymentDate: new Date(currentYear, currentMonth - 1, 18), // 지난 달 18일 지급 완료
    createdAt: new Date(currentYear, currentMonth - 1, 1),
    updatedAt: new Date(currentYear, currentMonth - 1, 18)
  });
}

// 4. 강릉 씨마크호텔 (강민수 - busan@hotel.com)
const kangBookings = db.bookings.find({ 
  hotelId: hotel4,
  status: { $in: ["completed", "confirmed"] } // completed가 없으면 confirmed도 포함
}).toArray();

if (kangBookings.length > 0) {
  const completedKangBookings = kangBookings.filter(b => b.status === "completed");
  const confirmedKangBookings = kangBookings.filter(b => b.status === "confirmed");
  
  // 완료된 예약이 있으면 완료된 것만, 없으면 confirmed도 포함
  const targetBookings = completedKangBookings.length > 0 ? completedKangBookings : confirmedKangBookings;
  
  if (targetBookings.length > 0) {
    const kangRevenue = targetBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const platformFee = Math.floor(kangRevenue * 0.1);
    const tax = Math.floor((kangRevenue - platformFee) * 0.1);
    const finalAmount = kangRevenue - platformFee - tax;
    
    const lastMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
    
    settlementsToInsert.push({
      businessUser: userIds[3],
      month: lastMonthStr,
      totalRevenue: kangRevenue,
      platformFee: platformFee,
      tax: tax,
      finalAmount: finalAmount,
      status: "completed",
      paymentDate: new Date(currentYear, currentMonth - 1, 22),
      createdAt: new Date(currentYear, currentMonth - 1, 1),
      updatedAt: new Date(currentYear, currentMonth - 1, 22)
    });
  }
}

// 5. 최지영 (jeju@hotel.com) - 여수 히든베이호텔
const choiBookings = db.bookings.find({ 
  hotelId: hotel5,
  status: { $in: ["completed", "confirmed"] }
}).toArray();

if (choiBookings.length > 0) {
  const completedChoiBookings = choiBookings.filter(b => b.status === "completed");
  const confirmedChoiBookings = choiBookings.filter(b => b.status === "confirmed");
  const targetBookings = completedChoiBookings.length > 0 ? completedChoiBookings : confirmedChoiBookings;
  
  if (targetBookings.length > 0) {
    const choiRevenue = targetBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const platformFee = Math.floor(choiRevenue * 0.1);
    const tax = Math.floor((choiRevenue - platformFee) * 0.1);
    const finalAmount = choiRevenue - platformFee - tax;
    
    const lastMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
    
    settlementsToInsert.push({
      businessUser: userIds[4],
      month: lastMonthStr,
      totalRevenue: choiRevenue,
      platformFee: platformFee,
      tax: tax,
      finalAmount: finalAmount,
      status: "completed",
      paymentDate: new Date(currentYear, currentMonth - 1, 25),
      createdAt: new Date(currentYear, currentMonth - 1, 1),
      updatedAt: new Date(currentYear, currentMonth - 1, 25)
    });
  }
}

if (settlementsToInsert.length > 0) {
  db.settlements.insertMany(settlementsToInsert);
}

print("✅ 정산", db.settlements.countDocuments(), "개 생성 완료");
print("  - 완료된 정산:", db.settlements.countDocuments({ status: "completed" }), "개");

print("\n🎉 사업자용 초기 데이터 생성 완료!");
print("\n📊 생성된 데이터 요약:");
print("  - 사업자 사용자:", db.users.countDocuments(), "명");
print("  - 호텔:", db.hotels.countDocuments(), "개");
print("  - 객실:", db.rooms.countDocuments(), "개");
print("  - 예약:", db.bookings.countDocuments(), "개");
print("  - 리뷰:", db.reviews.countDocuments(), "개");
print("  - 정산:", db.settlements.countDocuments(), "개");
print("\n🔑 테스트 계정:");
print("  - wow@hotel.com / business1234");
print("  - korea@hotel.com / business1234");
print("  - seoul@hotel.com / business1234");
print("  - busan@hotel.com / business1234");
print("  - jeju@hotel.com / business1234");

