import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = ({
  label,
  type = "text",
  name,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  showPasswordToggle = false,
  className = "",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id || name;
  const inputType = showPasswordToggle && showPassword ? "text" : type;

  return (
    <div className={`form-group ${className}`}>
      {showPasswordToggle ? (
        <div className="password-input-wrapper">
          <input
            type={inputType}
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="form-input"
            {...rest}
          />
          {label && <label htmlFor={inputId} className="form-label">{label}</label>}
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      ) : (
        <>
          <input
            type={type}
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="form-input"
            {...rest}
          />
          {label && <label htmlFor={inputId} className="form-label">{label}</label>}
        </>
      )}
    </div>
  );
};

export default Input;

