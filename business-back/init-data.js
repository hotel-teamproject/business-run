// MongoDB 초기 데이터 삽입 스크립트
// 사용법: docker exec -i mongodb mongosh business-back < init-data.js

// 데이터베이스 선택
db = db.getSiblingDB("business-back");

// 기존 데이터 삭제 (선택사항)
print("기존 데이터 삭제 중...");
db.users.deleteMany({});
db.hotels.deleteMany({});
db.rooms.deleteMany({});
db.bookings.deleteMany({});
db.inventories.deleteMany({});

// 사업자 사용자 생성 (비밀번호: business1234)
// bcrypt 해시: $2a$10$D3hQGRY/vHzcBc2QB20xFOERImEPkiE8L/IhpFg9X4NpVEvJioMjq
print("사업자 사용자 생성 중...");
const businessUser = db.users.insertOne({
  email: "wow@hotel.com",
  password: "$2a$10$D3hQGRY/vHzcBc2QB20xFOERImEPkiE8L/IhpFg9X4NpVEvJioMjq", // business1234
  name: "홍길동",
  role: "business",
  businessNumber: "123-45-67890",
  phone: "010-1234-5678",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

const ownerId = businessUser.insertedId;
print("생성된 사용자 ID: " + ownerId);

// 두 번째 사업자 사용자 생성 (비밀번호: business1234)
print("두 번째 사업자 사용자 생성 중...");
const businessUser2 = db.users.insertOne({
  email: "korea@hotel.com",
  password: "$2a$10$D3hQGRY/vHzcBc2QB20xFOERImEPkiE8L/IhpFg9X4NpVEvJioMjq", // business1234
  name: "이순신",
  role: "business",
  businessNumber: "987-65-43210",
  phone: "010-9876-5432",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

const ownerId2 = businessUser2.insertedId;
print("생성된 두 번째 사용자 ID: " + ownerId2);

// 세 번째 사업자 사용자 생성 (비밀번호: business1234)
print("세 번째 사업자 사용자 생성 중...");
const businessUser3 = db.users.insertOne({
  email: "seoul@hotel.com",
  password: "$2a$10$D3hQGRY/vHzcBc2QB20xFOERImEPkiE8L/IhpFg9X4NpVEvJioMjq", // business1234
  name: "강감찬",
  role: "business",
  businessNumber: "555-12-34567",
  phone: "010-5555-6666",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

const ownerId3 = businessUser3.insertedId;
print("생성된 세 번째 사용자 ID: " + ownerId3);

// 호텔 데이터 삽입
print("호텔 데이터 삽입 중...");
const hotels = db.hotels.insertMany([
  {
    ownerId: ownerId,
    name: "롯데호텔 서울",
    address: "서울특별시 중구 을지로 30",
    city: "서울",
    description: "서울 중심부 명동에 위치한 5성급 호텔입니다. 최고급 서비스와 시설을 제공합니다.",
    amenities: ["와이파이", "주차장", "레스토랑", "피트니스", "스파", "회의실"],
    images: [],
    rating: 4.5,
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: ownerId,
    name: "신라호텔 제주",
    address: "제주특별자치도 서귀포시 중문관광로 72번길 75",
    city: "제주",
    description: "제주도 중문해변에 위치한 리조트 호텔입니다. 자연 속에서 여유로운 휴식을 즐기실 수 있습니다.",
    amenities: ["와이파이", "주차장", "수영장", "골프장", "스파", "레스토랑"],
    images: [],
    rating: 4.8,
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: ownerId,
    name: "부산 그랜드 호텔",
    address: "부산광역시 해운대구 해운대해변로 264",
    city: "부산",
    description: "해운대 해변을 바라보는 오션뷰 호텔입니다. 바다 전망을 즐기며 편안한 휴식을 취하세요.",
    amenities: ["와이파이", "주차장", "수영장", "피트니스", "레스토랑"],
    images: [],
    rating: 4.3,
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 두 번째 사업자 (이순신)의 호텔
  {
    ownerId: ownerId2,
    name: "경주 힐튼 호텔",
    address: "경상북도 경주시 첨성로 286",
    city: "경주",
    description: "경주 불국사 근처에 위치한 리조트 호텔입니다. 한국 전통 문화와 현대적 편의시설을 겸비했습니다.",
    amenities: ["와이파이", "주차장", "수영장", "스파", "레스토랑", "골프장", "회의실"],
    images: [],
    rating: 4.6,
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: ownerId2,
    name: "전주 한옥마을 호텔",
    address: "전라북도 전주시 완산구 기린대로 99",
    city: "전주",
    description: "전주 한옥마을 근처에 위치한 전통 한옥 스타일 호텔입니다. 한국의 전통을 체험할 수 있습니다.",
    amenities: ["와이파이", "주차장", "레스토랑", "한옥 체험"],
    images: [],
    rating: 4.4,
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 세 번째 사업자 (강감찬)의 호텔
  {
    ownerId: ownerId3,
    name: "서울 스위스호텔",
    address: "서울특별시 강남구 테헤란로 427",
    city: "서울",
    description: "강남 중심가에 위치한 비즈니스 호텔입니다. 최신 시설과 서비스를 제공합니다.",
    amenities: ["와이파이", "주차장", "피트니스", "레스토랑", "라운지", "회의실", "비즈니스 센터"],
    images: [],
    rating: 4.7,
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: ownerId3,
    name: "강원 스키리조트 호텔",
    address: "강원도 평창군 대관령면 솔봉로 325",
    city: "평창",
    description: "평창 알펜시아 근처에 위치한 스키 리조트 호텔입니다. 겨울 스포츠를 즐기기 최적의 장소입니다.",
    amenities: ["와이파이", "주차장", "스키장", "곤돌라", "스파", "레스토랑", "바"],
    images: [],
    rating: 4.5,
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("생성된 호텔 수: " + hotels.insertedIds.length);

// 호텔별 객실 데이터 삽입
print("객실 데이터 삽입 중...");
const hotelIds = Object.values(hotels.insertedIds);
const rooms = [];

// 첫 번째 호텔 (롯데호텔 서울) 객실
rooms.push({
  hotelId: hotelIds[0],
  name: "디럭스 룸",
  type: "deluxe",
  capacity: 2,
  description: "넓고 쾌적한 디럭스 룸입니다. 도심 전망을 감상하실 수 있습니다.",
  amenities: ["TV", "에어컨", "미니바", "금고", "무료 와이파이"],
  images: [],
  basePrice: 150000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

rooms.push({
  hotelId: hotelIds[0],
  name: "프리미어 스위트",
  type: "suite",
  capacity: 4,
  description: "최고급 스위트 룸입니다. 거실과 침실이 분리되어 있어 편안한 공간을 제공합니다.",
  amenities: ["TV", "에어컨", "미니바", "금고", "무료 와이파이", "거실", "다이닝 테이블"],
  images: [],
  basePrice: 300000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// 두 번째 호텔 (신라호텔 제주) 객실
rooms.push({
  hotelId: hotelIds[1],
  name: "오션뷰 룸",
  type: "ocean_view",
  capacity: 2,
  description: "제주 바다를 감상할 수 있는 오션뷰 객실입니다.",
  amenities: ["TV", "에어컨", "미니바", "금고", "무료 와이파이", "발코니"],
  images: [],
  basePrice: 200000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

rooms.push({
  hotelId: hotelIds[1],
  name: "가든뷰 룸",
  type: "garden_view",
  capacity: 2,
  description: "조용한 정원 전망을 즐길 수 있는 객실입니다.",
  amenities: ["TV", "에어컨", "미니바", "금고", "무료 와이파이"],
  images: [],
  basePrice: 180000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// 세 번째 호텔 (부산 그랜드 호텔) 객실
rooms.push({
  hotelId: hotelIds[2],
  name: "스탠다드 룸",
  type: "standard",
  capacity: 2,
  description: "편안하고 깔끔한 스탠다드 룸입니다.",
  amenities: ["TV", "에어컨", "미니바", "무료 와이파이"],
  images: [],
  basePrice: 120000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

rooms.push({
  hotelId: hotelIds[2],
  name: "패밀리 룸",
  type: "family",
  capacity: 4,
  description: "가족 단위 고객을 위한 넓은 객실입니다.",
  amenities: ["TV", "에어컨", "미니바", "금고", "무료 와이파이", "침대 2개"],
  images: [],
  basePrice: 220000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// 네 번째 호텔 (경주 힐튼 호텔) 객실
rooms.push({
  hotelId: hotelIds[3],
  name: "디럭스 룸",
  type: "deluxe",
  capacity: 2,
  description: "전통과 현대가 조화로운 디럭스 룸입니다.",
  amenities: ["TV", "에어컨", "미니바", "금고", "무료 와이파이", "발코니"],
  images: [],
  basePrice: 180000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

rooms.push({
  hotelId: hotelIds[3],
  name: "로얄 스위트",
  type: "suite",
  capacity: 4,
  description: "최고급 스위트 룸으로 전통 한옥 인테리어가 적용되어 있습니다.",
  amenities: ["TV", "에어컨", "미니바", "금고", "무료 와이파이", "거실", "다이닝", "스파"],
  images: [],
  basePrice: 400000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// 다섯 번째 호텔 (전주 한옥마을 호텔) 객실
rooms.push({
  hotelId: hotelIds[4],
  name: "전통 한옥 룸",
  type: "traditional",
  capacity: 2,
  description: "한국 전통 한옥 스타일의 객실입니다.",
  amenities: ["TV", "에어컨", "전통 온돌", "무료 와이파이"],
  images: [],
  basePrice: 150000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

rooms.push({
  hotelId: hotelIds[4],
  name: "한옥 패밀리 룸",
  type: "family",
  capacity: 4,
  description: "가족이 함께 머물 수 있는 넓은 한옥 스타일 객실입니다.",
  amenities: ["TV", "에어컨", "전통 온돌", "미니바", "무료 와이파이"],
  images: [],
  basePrice: 250000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// 여섯 번째 호텔 (서울 스위스호텔) 객실
rooms.push({
  hotelId: hotelIds[5],
  name: "비즈니스 스위트",
  type: "business_suite",
  capacity: 2,
  description: "비즈니스 여행객을 위한 최적화된 스위트 룸입니다.",
  amenities: ["TV", "에어컨", "미니바", "금고", "무료 와이파이", "업무용 책상", "프린터"],
  images: [],
  basePrice: 280000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

rooms.push({
  hotelId: hotelIds[5],
  name: "클럽 플로어 룸",
  type: "club",
  capacity: 2,
  description: "클럽 라운지 이용이 가능한 프리미엄 룸입니다.",
  amenities: ["TV", "에어컨", "미니바", "금고", "무료 와이파이", "클럽 라운지 이용"],
  images: [],
  basePrice: 350000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// 일곱 번째 호텔 (강원 스키리조트 호텔) 객실
rooms.push({
  hotelId: hotelIds[6],
  name: "스키뷰 룸",
  type: "ski_view",
  capacity: 2,
  description: "스키장을 내려다볼 수 있는 객실입니다.",
  amenities: ["TV", "에어컨", "미니바", "금고", "무료 와이파이", "발코니", "스키장 전망"],
  images: [],
  basePrice: 250000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

rooms.push({
  hotelId: hotelIds[6],
  name: "패밀리 스위트",
  type: "family_suite",
  capacity: 6,
  description: "가족 단위 고객을 위한 넓은 스위트 룸입니다.",
  amenities: ["TV", "에어컨", "미니바", "금고", "무료 와이파이", "거실", "침대 3개"],
  images: [],
  basePrice: 450000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

const insertedRooms = db.rooms.insertMany(rooms);
print("생성된 객실 수: " + insertedRooms.insertedIds.length);

// 예약 데이터 삽입 (선택사항)
print("예약 데이터 삽입 중...");
const roomIds = Object.values(insertedRooms.insertedIds);

const bookings = db.bookings.insertMany([
  {
    hotelId: hotelIds[0],
    roomId: roomIds[0],
    guestName: "김고객",
    guestEmail: "guest1@example.com",
    guestPhone: "010-1111-2222",
    checkIn: new Date("2024-12-15"),
    checkOut: new Date("2024-12-17"),
    numberOfGuests: 2,
    totalPrice: 300000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotelIds[1],
    roomId: roomIds[2],
    guestName: "이고객",
    guestEmail: "guest2@example.com",
    guestPhone: "010-3333-4444",
    checkIn: new Date("2024-12-20"),
    checkOut: new Date("2024-12-22"),
    numberOfGuests: 2,
    totalPrice: 400000,
    status: "pending",
    paymentStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 두 번째 사업자 호텔 예약
  {
    hotelId: hotelIds[3],
    roomId: roomIds[6],
    guestName: "박고객",
    guestEmail: "guest3@example.com",
    guestPhone: "010-5555-7777",
    checkIn: new Date("2024-12-18"),
    checkOut: new Date("2024-12-20"),
    numberOfGuests: 2,
    totalPrice: 360000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotelIds[4],
    roomId: roomIds[8],
    guestName: "최고객",
    guestEmail: "guest4@example.com",
    guestPhone: "010-8888-9999",
    checkIn: new Date("2024-12-25"),
    checkOut: new Date("2024-12-27"),
    numberOfGuests: 4,
    totalPrice: 500000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 세 번째 사업자 호텔 예약
  {
    hotelId: hotelIds[5],
    roomId: roomIds[10],
    guestName: "정고객",
    guestEmail: "guest5@example.com",
    guestPhone: "010-2222-3333",
    checkIn: new Date("2024-12-10"),
    checkOut: new Date("2024-12-12"),
    numberOfGuests: 2,
    totalPrice: 560000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotelIds[6],
    roomId: roomIds[12],
    guestName: "윤고객",
    guestEmail: "guest6@example.com",
    guestPhone: "010-4444-5555",
    checkIn: new Date("2024-12-28"),
    checkOut: new Date("2024-12-30"),
    numberOfGuests: 2,
    totalPrice: 500000,
    status: "pending",
    paymentStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    hotelId: hotelIds[6],
    roomId: roomIds[13],
    guestName: "조고객",
    guestEmail: "guest7@example.com",
    guestPhone: "010-6666-7777",
    checkIn: new Date("2025-01-05"),
    checkOut: new Date("2025-01-07"),
    numberOfGuests: 6,
    totalPrice: 900000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("생성된 예약 수: " + bookings.insertedIds.length);

// 재고 데이터 삽입 (다음 30일)
print("재고 데이터 삽입 중...");
const today = new Date();
today.setHours(0, 0, 0, 0);

const inventories = [];
roomIds.forEach((roomId) => {
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    inventories.push({
      room: roomId,
      date: date,
      totalRooms: 10,
      reservedCount: Math.floor(Math.random() * 5), // 0-4 사이 랜덤
      availableCount: 10 - Math.floor(Math.random() * 5),
      status: "available"
    });
  }
});

db.inventories.insertMany(inventories);
print("생성된 재고 데이터 수: " + inventories.length);

print("\n=== 초기 데이터 삽입 완료 ===");
print("사업자 계정 1: wow@hotel.com (홍길동) / 비밀번호: business1234");
print("사업자 계정 2: korea@hotel.com (이순신) / 비밀번호: business1234");
print("사업자 계정 3: seoul@hotel.com (강감찬) / 비밀번호: business1234");
print("생성된 호텔: " + hotelIds.length + "개");
print("생성된 객실: " + roomIds.length + "개");
print("생성된 예약: " + bookings.insertedIds.length + "개");

