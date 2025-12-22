import React from "react";

const AuthFormHeader = ({ title, subtitle, showBackButton = false, onBack }) => {
  return (
    <div className="form-header">
      {showBackButton && (
        <button type="button" className="back-button" onClick={onBack}>
          ← Back to login
        </button>
      )}
      <h1 className="form-title">{title}</h1>
      {subtitle && <p className="form-subtitle">{subtitle}</p>}
    </div>
  );
};

export default AuthFormHeader;

