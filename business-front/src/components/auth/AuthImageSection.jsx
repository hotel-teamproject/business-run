import React, { useEffect, useRef } from "react";

const AuthImageSection = () => {
  const parentRef = useRef(null);

  // 호텔 이미지 URL (로컬 이미지가 있으면 /images/hotel.jpg로 변경 가능)
  const imageUrl = "/images/hotel.jpg";
  // 무료 호텔 이미지 placeholder (로컬 이미지가 없을 때 사용)
  const fallbackImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=1200&fit=crop";
  
  // 일단 fallback URL 사용 (로컬 이미지가 없을 가능성이 높음)
  const currentImageUrl = fallbackImageUrl;

  useEffect(() => {
    // 부모 요소 찾기 (ref 사용)
    const parentElement = parentRef.current?.parentElement;
    
    if (parentElement && parentElement.classList.contains('auth-layout-image-section')) {
      // ::before 요소에 직접 스타일 적용
      const style = document.createElement('style');
      style.id = 'auth-bg-image-style';
      style.textContent = `
        .auth-layout-image-section::before {
          background-image: url(${currentImageUrl}) !important;
          background-size: cover !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          display: block !important;
        }
      `;
      
      // 기존 스타일 제거
      const existingStyle = document.getElementById('auth-bg-image-style');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      document.head.appendChild(style);
    }
    
    return () => {
      const style = document.getElementById('auth-bg-image-style');
      if (style) {
        style.remove();
      }
    };
  }, [currentImageUrl]);

  return <div ref={parentRef} style={{ display: 'none' }} />;
};

export default AuthImageSection;

