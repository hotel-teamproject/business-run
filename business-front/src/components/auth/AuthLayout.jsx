import React, { useEffect } from "react";
import AuthImageSection from "./AuthImageSection";

const AuthLayout = ({ children, reverse = false, className = "" }) => {
  useEffect(() => {
    // 배경 이미지 설정
    const imageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=1200&fit=crop";
    const style = document.createElement('style');
    style.id = 'auth-bg-image-style';
    style.textContent = `
      .auth-layout-image-section::before {
        background-image: url(${imageUrl}) !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        display: block !important;
      }
    `;
    
    const existingStyle = document.getElementById('auth-bg-image-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
    
    return () => {
      const style = document.getElementById('auth-bg-image-style');
      if (style) {
        style.remove();
      }
    };
  }, []);

  return (
    <div className={`auth-layout-page ${className}`}>
      <div className="auth-layout-container">
        <div className={`auth-layout-content ${reverse ? "auth-layout-content-reverse" : ""}`}>
          {/* 폼 섹션 */}
          <div className="auth-layout-form-section">
            {children}
          </div>

          {/* 이미지 섹션 */}
          <div className="auth-layout-image-section">
            <AuthImageSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

