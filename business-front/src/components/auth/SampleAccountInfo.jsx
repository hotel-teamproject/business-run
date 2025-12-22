import React from "react";

const SampleAccountInfo = ({ email, password, label = "테스트 계정" }) => {
  if (!email || !password) return null;

  return (
    <div className="sample-account-info">
      <p>📌 {label}</p>
      <p>이메일: {email}</p>
      <p>비밀번호: {password}</p>
    </div>
  );
};

export default SampleAccountInfo;

