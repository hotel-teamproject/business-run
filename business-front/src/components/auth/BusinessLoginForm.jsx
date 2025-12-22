import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinessAuth } from "../../hooks/useBusinessAuth";
import AuthFormHeader from "./AuthFormHeader";
import SampleAccountInfo from "./SampleAccountInfo";
import AuthFormOptions from "./AuthFormOptions";
import Input from "../common/Input";
import ErrorMessage from "../common/ErrorMessage";

const BusinessLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useBusinessAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/business/dashboard");
    } catch (err) {
      setError(err.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="common-form login-form">
      <AuthFormHeader title="Login" subtitle="로그인해주세요" />

      <SampleAccountInfo
        email="business@hotel.com"
        password="business1234"
      />

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="form-content">
        <Input
          label="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="business@hotel.com"
          required
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          required
          disabled={loading}
          showPasswordToggle={true}
        />

        <AuthFormOptions
          showRememberMe={true}
          rememberMe={rememberMe}
          onRememberMeChange={(e) => setRememberMe(e.target.checked)}
          showForgotPassword={true}
        />

        <div className="auth-buttons-row">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/business/signup")}
            className="btn btn--accent"
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessLoginForm;

