import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  role: string;
  onSubmit: (email: string, password: string) => void;
  onToggleForm: () => void;
  error?: string;
  isLoading?: boolean;
}

export function SignUpForm({ role, onSubmit, onToggleForm, error, isLoading }: Props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Sign up as {role.charAt(0).toUpperCase() + role.slice(1)}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <Button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Create Account"}
        </Button>
        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onToggleForm}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
