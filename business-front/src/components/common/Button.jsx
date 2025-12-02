import "./Button.scss";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  type = "button",
  className = "",
}) => {
  const buttonClasses = [
    "btn",
    `btn-${variant}`,
    size !== "medium" && `btn-${size}`,
    fullWidth && "btn-block",
    loading && "btn-loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {loading ? <span>로딩 중...</span> : <span>{children}</span>}
    </button>
  );
};

export default Button;

