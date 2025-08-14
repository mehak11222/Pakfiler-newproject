"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserSettings() {
  // Demo: prefill with fake user data
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [phone, setPhone] = useState("03001234567");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call backend to update profile
    setSuccess("Profile updated successfully!");
    setTimeout(() => setSuccess(""), 2000);
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
        >
          Save Changes
        </button>
        {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
      </form>
    </div>
  );
} 