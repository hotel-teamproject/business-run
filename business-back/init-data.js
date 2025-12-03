// MongoDB 초기 데이터 삽입 스크립트
// 사용법: mongosh business-back --file init-data.js

print("기존 데이터 삭제 중...");
db.users.deleteMany({});
db.hotels.deleteMany({});
db.rooms.deleteMany({});
db.bookings.deleteMany({});
db.reviews.deleteMany({});
db.inventories.deleteMany({});

print("사용자 생성 중...");

// bcrypt 해시된 비밀번호 (password: business1234)
const hashedPassword = "$2a$10$D3hQGRY/vHzcBc2QB20xFOERImEPkiE8L/IhpFg9X4NpVEvJioMjq";

const users = [
  {
    email: "wow@hotel.com",
    password: hashedPassword,
    name: "와우호텔 사업자",
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
    name: "코리아호텔 사업자",
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
    name: "서울호텔 사업자",
    role: "business",
    businessNumber: "345-67-89012",
    phone: "02-3456-7890",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const insertedUsers = db.users.insertMany(users);
print(`사용자 ${insertedUsers.insertedIds.length}명 생성 완료`);

// 호텔 생성
print("호텔 생성 중...");
const userIds = Object.values(insertedUsers.insertedIds);

const hotels = [
  {
    ownerId: userIds[0],
    name: "와우 호텔 서울",
    address: "서울시 강남구 테헤란로 123",
    city: "서울",
    description: "서울 중심가의 편안한 숙박 시설",
    amenities: ["WiFi", "주차", "조식"],
    images: [],
    rating: 4.5,
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: userIds[1],
    name: "코리아 호텔 부산",
    address: "부산시 해운대구 해운대해변로 456",
    city: "부산",
    description: "해운대 해변 인근의 최고급 호텔",
    amenities: ["WiFi", "주차", "조식", "수영장"],
    images: [],
    rating: 4.8,
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ownerId: userIds[2],
    name: "서울 그랜드 호텔",
    address: "서울시 중구 명동길 789",
    city: "서울",
    description: "명동 중심가의 럭셔리 호텔",
    amenities: ["WiFi", "주차", "조식", "피트니스"],
    images: [],
    rating: 4.7,
    isActive: true,
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const insertedHotels = db.hotels.insertMany(hotels);
print(`호텔 ${insertedHotels.insertedIds.length}개 생성 완료`);

// 객실 생성
print("객실 생성 중...");
const hotelIds = Object.values(insertedHotels.insertedIds);

const rooms = [];
hotelIds.forEach((hotelId, hotelIndex) => {
  const roomTypes = ["스탠다드", "디럭스", "스위트"];
  roomTypes.forEach((type, roomIndex) => {
    rooms.push({
      hotelId: hotelId,
      name: `${type} 룸`,
      type: type,
      capacity: 2 + roomIndex,
      description: `${type} 타입의 편안한 객실`,
      amenities: ["TV", "에어컨", "욕실"],
      images: [],
      basePrice: 100000 + (roomIndex * 50000),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
});

const insertedRooms = db.rooms.insertMany(rooms);
print(`객실 ${Object.keys(insertedRooms.insertedIds).length}개 생성 완료`);

// 예약 생성
print("예약 생성 중...");
const roomIds = Object.values(insertedRooms.insertedIds);

const bookings = [];
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);

bookings.push({
  hotelId: hotelIds[0],
  roomId: roomIds[0],
  guestName: "김고객",
  guestEmail: "guest1@example.com",
  guestPhone: "010-1234-5678",
  checkIn: tomorrow,
  checkOut: dayAfter,
  numberOfGuests: 2,
  totalPrice: 200000,
  status: "confirmed",
  paymentStatus: "paid",
  createdAt: new Date(),
  updatedAt: new Date()
});

const insertedBookings = db.bookings.insertMany(bookings);
print(`예약 ${Object.keys(insertedBookings.insertedIds).length}개 생성 완료`);

// 리뷰 생성
print("리뷰 생성 중...");
const reviews = [
  {
    hotelId: hotelIds[0],
    roomId: roomIds[0],
    bookingId: Object.values(insertedBookings.insertedIds)[0],
    authorName: "김고객",
    authorEmail: "guest1@example.com",
    rating: 5,
    comment: "정말 좋은 호텔이었습니다!",
    isReported: false,
    reportCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const insertedReviews = db.reviews.insertMany(reviews);
print(`리뷰 ${Object.keys(insertedReviews.insertedIds).length}개 생성 완료`);

print("초기 데이터 생성 완료!");

