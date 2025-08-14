"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/services/localStorage/auth-utils";
import { UserServices } from "@/services/user.service";

export default function UserSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user and prefill form
  useEffect(() => {
    const user = getCurrentUser<any>();
    if (user) {
      setName(user.fullName || user.name || "");
      setEmail(user.email || "");
      setPhone(user.phoneNumber || user.phone || "");
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      const user = getCurrentUser<any>();
      if (!user || !user.id && !user._id) {
        setError("User not found. Please log in again.");
        setLoading(false);
        return;
      }
      const userId = user.id || user._id;
      const updateData: any = {
        fullName: name,
        email,
        phoneNumber: phone,
      };
      if (password) updateData.password = password;
      await new UserServices().update(userId, updateData);
      setSuccess("Profile updated successfully!");
      setPassword("");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <Label className="block mb-1">Full Name</Label>
          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-3 border-b-2 border-gray-300 focus:border-green-600"
            required
          />
        </div>
        <div>
          <Label className="block mb-1">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 border-b-2 border-gray-300 focus:border-green-600"
            required
          />
        </div>
        <div>
          <Label className="block mb-1">Phone</Label>
          <Input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full p-3 border-b-2 border-gray-300 focus:border-green-600"
            required
          />
        </div>
        <div>
          <Label className="block mb-1">Password</Label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border-b-2 border-gray-300 focus:border-green-600"
            placeholder="Leave blank to keep current password"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-3 rounded bg-gradient-to-r from-green-600 to-green-400 text-white text-lg font-semibold shadow hover:from-green-700 hover:to-green-500 transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
        {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
      </form>
    </div>
  );
} 