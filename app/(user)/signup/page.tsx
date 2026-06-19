"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaUser, FaPhone, FaLock, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

export default function UserSignup() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate phone length
    if (form.phone.length !== 10 || isNaN(Number(form.phone))) {
      setError("Phone number must be exactly 10 digits");
      setLoading(false);
      return;
    }

    try {
      // Create user
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phoneNo: form.phone,
          email: form.email,
          address: form.address,
          password: form.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Registration failed");
      } else {
        // Automatically login the user after signup
        const loginRes = await fetch("/api/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNo: form.phone,
            password: form.password,
          }),
        });

        if (loginRes.ok) {
          window.location.reload();
          router.push("/home");
        } else {
          router.push("/login");
        }
      }
    } catch (err) {
      setError(`Something went wrong: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen min-w-full flex items-center justify-center bg-[#070b13] overflow-hidden py-12 px-4">
      {/* Animated Glowing Blobs */}
      <div className="absolute top-[15%] left-[10%] w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[15%] right-[10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: "3s" }} />

      <Card className="relative z-10 w-full max-w-md shadow-2xl rounded-2xl glass-panel neon-border-blue p-6 transition-all duration-300 hover:shadow-blue-500/10 hover:shadow-2xl border-blue-500/20">
        <CardHeader className="space-y-1.5 pb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20 mb-2">
            <FaUserPlus />
          </div>
          <CardTitle className="text-center text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Create Pet Parent Account
          </CardTitle>
          <p className="text-center text-xs text-slate-400">
            Join the smart pet care ecosystem
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Full Name
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm">
                  <FaUser />
                </span>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="pl-10 glass-input text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Phone Number (10 digits)
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm">
                  <FaPhone />
                </span>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="pl-10 glass-input text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm">
                  <FaEnvelope />
                </span>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="pl-10 glass-input text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                />
              </div>
            </div>

            {/* Registered Address */}
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Registered Address
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm">
                  <FaMapMarkerAlt />
                </span>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter address details"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="pl-10 glass-input text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Password (min 6 chars)
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm">
                  <FaLock />
                </span>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Choose password"
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
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 text-sm"
            >
              {loading ? "Registering Account..." : "Sign Up"}
            </Button>

            <div className="pt-2 text-center text-xs text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:underline font-semibold">
                Login here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
