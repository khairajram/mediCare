"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FaUserShield, FaPhone, FaLock } from "react-icons/fa";

export default function AdminLogin() {
  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNo: form.phone,
          password: form.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error ? `${result.message}: ${result.error}` : (result.message || "Login failed"));
      } else {
        window.location.reload();
        route.push('/admin/dashboard')
      }

    } catch (err) {
      setError(`Something went wrong ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen min-w-full flex items-center justify-center bg-[#070b13] overflow-hidden">
      
      {/* Animated Glowing Blobs */}
      <div className="absolute top-[20%] left-[15%] w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />

      <Card className="relative z-10 w-full max-w-md shadow-2xl rounded-2xl glass-panel neon-border-blue p-6 transition-all duration-300 hover:shadow-blue-500/10 hover:shadow-2xl border-blue-500/20">
        <CardHeader className="space-y-1.5 pb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20 mb-2">
            <FaUserShield />
          </div>
          <CardTitle className="text-center text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Admin Access
          </CardTitle>
          <p className="text-center text-xs text-slate-400">
            Jodhpur Karni Pet Care Center
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Phone Number */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Phone Number
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm">
                  <FaPhone />
                </span>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter registered mobile"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="pl-10 glass-input text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm">
                  <FaLock />
                </span>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter access code"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="pl-10 glass-input text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs font-medium text-center">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm"
            >
              {loading ? "Verifying Authenticity..." : "Access Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
