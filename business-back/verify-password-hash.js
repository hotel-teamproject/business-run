// 비밀번호 해시 검증 스크립트
// 사용법: node verify-password-hash.js

const bcrypt = require('bcryptjs');

const storedHash = "$2a$10$D3hQGRY/vHzcBc2QB20xFOERImEPkiE8L/IhpFg9X4NpVEvJioMjq";
const testPassword = "business1234";

console.log("비밀번호 해시 검증 테스트");
console.log("========================");
console.log("저장된 해시:", storedHash);
console.log("테스트 비밀번호:", testPassword);
console.log("");

// 기존 해시와 비교
bcrypt.compare(testPassword, storedHash)
  .then((isMatch) => {
    console.log("비교 결과:", isMatch ? "✅ 일치" : "❌ 불일치");
    
    if (!isMatch) {
      console.log("\n새로운 해시 생성 중...");
      return bcrypt.hash(testPassword, 10);
    }
    return null;
  })
  .then((newHash) => {
    if (newHash) {
      console.log("새로 생성된 해시:", newHash);
      console.log("\n새 해시로 다시 비교:");
      return bcrypt.compare(testPassword, newHash);
    }
    return null;
  })
  .then((newMatch) => {
    if (newMatch !== null) {
      console.log("새 해시 비교 결과:", newMatch ? "✅ 일치" : "❌ 불일치");
    }
  })
  .catch((error) => {
    console.error("오류:", error);
  });

