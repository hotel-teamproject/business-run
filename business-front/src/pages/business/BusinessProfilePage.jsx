import { useState, useEffect } from "react";
import { useBusinessAuth } from "../../hooks/useBusinessAuth";

const BusinessProfilePage = () => {
  const { businessInfo } = useBusinessAuth();

  return (
    <div className="business-profile-page">
      <div className="page-header">
        <h1>내 정보</h1>
      </div>

      {businessInfo && (
        <div className="profile-section">
          <div className="profile-card">
            <h2>사업자 정보</h2>
            <div className="profile-details">
              <div className="detail-item">
                <label>사업자명</label>
                <span>{businessInfo.businessName || "-"}</span>
              </div>
              <div className="detail-item">
                <label>사업자 등록번호</label>
                <span>{businessInfo.businessNumber || "-"}</span>
              </div>
              <div className="detail-item">
                <label>이름</label>
                <span>{businessInfo.name}</span>
              </div>
              <div className="detail-item">
                <label>이메일</label>
                <span>{businessInfo.email}</span>
              </div>
              <div className="detail-item">
                <label>승인 상태</label>
                <span className={businessInfo.isApproved ? "status-approved" : "status-pending"}>
                  {businessInfo.isApproved ? "승인됨" : "승인 대기"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessProfilePage;

