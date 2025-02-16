import React from "react";
import { RoleSelector } from "components/RoleSelector";
import { BenefitsSection } from "components/BenefitsSection";
import { SignUpForm } from "components/SignUpForm";
import { LoginForm } from "components/LoginForm";
import { Button } from "@/components/ui/button";
import { signUpWithEmailAndPassword, loginWithEmailAndPassword } from "utils/auth";
import { createUserProfile } from "utils/firestore";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = React.useState("");
  const [showSignUp, setShowSignUp] = React.useState(false);
  const [isLogin, setIsLogin] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignUp = async (email: string, password: string) => {
    setError("");
    setIsLoading(true);
    
    const { user, error } = await signUpWithEmailAndPassword(email, password);
    
    if (error) {
      setError(error);
      setIsLoading(false);
      return;
    }

    // Store user role in Firestore
    const { error: profileError } = await createUserProfile(user.uid, {
      role: selectedRole as "producer" | "agency",
      email: user.email!,
      createdAt: new Date(),
    });
    
    if (profileError) {
      setError(profileError);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(false);
    navigate("/Profile");
  };

  const handleLogin = async (email: string, password: string) => {
    setError("");
    setIsLoading(true);
    
    const { user, error } = await loginWithEmailAndPassword(email, password);
    
    if (error) {
      setError(error);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(false);
    navigate("/Dashboard");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            EventFlow Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your event planning with our comprehensive budget management platform.
            Perfect for producers and agencies.
          </p>
          <Button
            onClick={() => setShowSignUp(true)}
            className="bg-blue-500 hover:bg-blue-600 text-lg px-8"
            size="lg"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Sign Up Section */}
      {showSignUp && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto space-y-8">
              {isLogin ? (
                <LoginForm 
                  onSubmit={handleLogin}
                  onToggleForm={() => setIsLogin(false)}
                  error={error}
                  isLoading={isLoading}
                />
              ) : !selectedRole ? (
                <RoleSelector
                  selectedRole={selectedRole}
                  onRoleChange={setSelectedRole}
                />
              ) : (
                <SignUpForm 
                  role={selectedRole} 
                  onSubmit={handleSignUp}
                  onToggleForm={() => setIsLogin(true)}
                  error={error}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
