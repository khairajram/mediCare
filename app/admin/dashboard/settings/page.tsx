"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaSlidersH, FaEnvelope, FaSms, FaUserCog } from "react-icons/fa";

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState({
    name: "Medical Administrator",
    phone: "9876543210",
    email: "shreekarnimedical01@gmail.com",
    password: "",
  });

  const [thresholds, setThresholds] = useState({
    lowStockLevel: 5,
    reminderDays: 3,
  });

  const [smtp, setSmtp] = useState({
    host: "smtp.gmail.com",
    port: "587",
    encryption: "TLS",
    active: true,
  });

  const [saving, setSaving] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Profile settings saved successfully!");
    }, 800);
  };

  const handleConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("System configuration updated successfully!");
    }, 800);
  };

  return (
    <div className="p-6 max-w-5xl pl-0 md:pl-16 mx-auto min-h-screen dark:text-white text-gray-800 space-y-6">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Configure administrator profiles, notification thresholds, and service integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Settings */}
        <Card className="border dark:border-gray-800 shadow-sm glass-card">
          <CardHeader className="border-b dark:border-gray-800 py-4 px-6 flex flex-row items-center gap-2">
            <FaUserCog className="text-blue-500 text-lg" />
            <CardTitle className="text-base font-bold">Admin Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleProfileSave} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-2.5 border dark:border-gray-800 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  disabled
                  value={profile.phone}
                  className="w-full p-2.5 border dark:border-gray-800 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-2.5 border dark:border-gray-800 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Change Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={profile.password}
                  onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                  className="w-full p-2.5 border dark:border-gray-800 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full">
                  {saving ? "Saving..." : "Save Profile Details"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* System & Notification Configuration */}
        <div className="space-y-6">
          
          <Card className="border dark:border-gray-800 shadow-sm glass-card">
            <CardHeader className="border-b dark:border-gray-800 py-4 px-6 flex flex-row items-center gap-2">
              <FaSlidersH className="text-purple-500 text-lg" />
              <CardTitle className="text-base font-bold">Alert Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleConfigSave} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1.5" title="Quantity that triggers red low-stock warnings">Low Stock Warning</label>
                    <input
                      type="number"
                      value={thresholds.lowStockLevel}
                      onChange={(e) => setThresholds({ ...thresholds, lowStockLevel: parseInt(e.target.value) })}
                      className="w-full p-2.5 border dark:border-gray-800 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-600 dark:text-gray-400 mb-1.5" title="Default days remaining to trigger auto email reminders">Reminder Threshold</label>
                    <input
                      type="number"
                      value={thresholds.reminderDays}
                      onChange={(e) => setThresholds({ ...thresholds, reminderDays: parseInt(e.target.value) })}
                      className="w-full p-2.5 border dark:border-gray-800 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold w-full">
                    {saving ? "Saving..." : "Update Thresholds"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Service Integrations */}
          <Card className="border dark:border-gray-800 shadow-sm glass-card">
            <CardHeader className="border-b dark:border-gray-800 py-4 px-6 flex flex-row items-center gap-2">
              <FaEnvelope className="text-indigo-500 text-lg" />
              <CardTitle className="text-base font-bold">SMTP Notification Services (Gmail)</CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-sm space-y-4">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border dark:border-gray-900/30">
                <div>
                  <div className="font-semibold text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Service Status</div>
                  <div className="text-sm font-bold text-green-600 dark:text-green-400 mt-0.5">Connected (Active)</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Host: {smtp.host}</div>
                  <div className="text-xs text-gray-400">Port: {smtp.port} ({smtp.encryption})</div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border dark:border-gray-900/30">
                <div>
                  <div className="font-semibold text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">SMS Gateway (Twilio)</div>
                  <div className="text-sm font-bold text-gray-500 mt-0.5">Mock Mode (Not configured)</div>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}