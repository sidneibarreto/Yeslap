import React from "react";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { getUserProfile, updateUserProfile, UserProfile } from "utils/firestore";

interface Props {
  user: User;
}

export function ProfileForm({ user }: Props) {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    company: "",
  });

  React.useEffect(() => {
    const loadProfile = async () => {
      const { profile, error } = await getUserProfile(user.uid);
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      if (profile) {
        setProfile(profile);
        setFormData({
          name: profile.name || "",
          phone: profile.phone || "",
          company: profile.company || "",
        });
      }
      setLoading(false);
    };

    loadProfile();
  }, [user.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const { error } = await updateUserProfile(user.uid, {
      ...profile,
      ...formData,
      updatedAt: new Date(),
    });

    setSaving(false);

    if (error) {
      setError(error);
      return;
    }

    setSuccess("Profile updated successfully");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="text-gray-600">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={user.email || ""}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {success && (
        <div className="text-green-500 text-sm">{success}</div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-blue-500 hover:bg-blue-600"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
