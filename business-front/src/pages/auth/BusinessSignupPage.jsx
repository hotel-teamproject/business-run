import AuthLayout from "../../components/auth/AuthLayout";
import BusinessSignupForm from "../../components/auth/BusinessSignupForm";

const BusinessSignupPage = () => {
  return (
    <AuthLayout reverse={true} className="signup-page">
      <BusinessSignupForm />
    </AuthLayout>
  );
};

export default BusinessSignupPage;