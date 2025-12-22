import React from "react";

const AuthFormOptions = ({
  showRememberMe = false,
  rememberMe = false,
  onRememberMeChange,
  showForgotPassword = false,
  forgotPasswordLink = "#",
  showCheckbox = false,
  checkboxLabel = "",
  checkboxChecked = false,
  onCheckboxChange,
  checkboxName,
}) => {
  return (
    <div className="form-options">
      {showCheckbox && (
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            name={checkboxName}
            checked={checkboxChecked}
            onChange={onCheckboxChange}
            required
          />
          <span className="checkbox-label">{checkboxLabel}</span>
        </label>
      )}

      {showRememberMe && (
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={onRememberMeChange}
          />
          <span className="checkbox-label">비밀번호 기억하기</span>
        </label>
      )}

      {showForgotPassword && (
        <a href={forgotPasswordLink} className="forgot-password">
          Forgot Password
        </a>
      )}
    </div>
  );
};

export default AuthFormOptions;

