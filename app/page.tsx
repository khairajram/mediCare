"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PawPrint,
  Pill,
  Bell,
  Stethoscope,
  Mail,
  Instagram,
  ArrowRight,
  ShieldAlert,
  User,
  Calendar,
  MapPin,
  MessageSquare,
  Star,
  Activity,
  Heart,
  CheckCircle2,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Lock,
  Settings,
  ChevronDown,
  ChevronUp,
  Check,
  Package,
  Clock,
  Sparkles,
  MapPinOff,
  UserCheck,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  form: string;
}

export default function LandingPage() {
  // Hero Tab Switcher: "parent" vs "admin"
  const [heroTab, setHeroTab] = useState<"parent" | "admin">("parent");

  // Feature Deep-Dive Tab: "pets" | "pharmacy" | "booking" | "admin"
  const [featureTab, setFeatureTab] = useState<"pets" | "pharmacy" | "booking" | "admin">("pets");

  // Simulator State
  const [simulatorCart, setSimulatorCart] = useState<CartItem[]>([
    { id: "1", name: "Nutri-Boost Vitamin Syrup", price: 240, qty: 1, form: "SYRUP" },
  ]);
  const [simulatorAddress, setSimulatorAddress] = useState("123 Karni Heights, Jodhpur, Rajasthan");
  const [gpsLocked, setGpsLocked] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [tempLatitude, setTempLatitude] = useState(26.2389);
  const [tempLongitude, setTempLongitude] = useState(73.0243);

  // FAQ Accordion State (open indexes)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Mock Medicines available in the Simulator
  const mockMedicines = [
    { id: "1", name: "Nutri-Boost Vitamin Syrup", price: 240, form: "SYRUP" },
    { id: "2", name: "Joint-Flex Care Tablets", price: 350, form: "TABLET" },
    { id: "3", name: "Anti-Tick Spot Topical", price: 480, form: "TOPICAL" },
  ];

  // Simulator actions
  const handleAddToCart = (item: typeof mockMedicines[0]) => {
    setSimulatorCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setSimulatorCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const handleClearCart = () => {
    setSimulatorCart([]);
  };

  const triggerGpsLock = () => {
    setGpsLoading(true);
    setGpsLocked(false);
    setTimeout(() => {
      // Simulate random perturbation of coordinates around Jodhpur
      const offsetLat = (Math.random() - 0.5) * 0.05;
      const offsetLng = (Math.random() - 0.5) * 0.05;
      setTempLatitude(26.2389 + offsetLat);
      setTempLongitude(73.0243 + offsetLng);
      setGpsLoading(false);
      setGpsLocked(true);
    }, 1200);
  };

  const handlePlaceOrder = () => {
    if (simulatorCart.length === 0) return;
    const randomId = "MCD-" + Math.floor(1000 + Math.random() * 9000);
    setPlacedOrderId(randomId);
    setOrderComplete(true);
  };

  const handleResetSimulator = () => {
    setSimulatorCart([{ id: "1", name: "Nutri-Boost Vitamin Syrup", price: 240, qty: 1, form: "SYRUP" }]);
    setSimulatorAddress("123 Karni Heights, Jodhpur, Rajasthan");
    setGpsLocked(false);
    setGpsLoading(false);
    setOrderComplete(false);
    setPlacedOrderId("");
  };

  // Auto-scrolling feature logs or indicators
  const cartSubtotal = simulatorCart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + 50 : 0; // flat ₹50 shipping fee

  // FAQs data
  const faqs = [
    {
      q: "Can I sign up directly on this platform?",
      a: "Yes! While the platform has pre-configured administrative accounts, regular pet parents can click 'Get Started' to sign up instantly, setting their custom email, password, delivery address, and listing multiple pets.",
    },
    {
      q: "How does the simulated GPS coordinates feature work?",
      a: "During checkout, instead of typing a long address, you can use our map telemetry module to instantly lock your precise latitude and longitude. The admin receives your exact coordinates alongside the address and can view your location in one click.",
    },
    {
      q: "What types of bookings are supported in the Scheduler?",
      a: "We support booking slots for professional Veterinary Doctors and Grooming treatments (Pet Bathing, Pet Haircuts, or the Premium Full Grooming Package). Submissions are instantly routed to the admin dashboard for approval or rejection.",
    },
    {
      q: "How does the stock level alert system prevent shortages?",
      a: "Every medicine item has a configurable Minimum Stock Level. If the stock falls below this limit, a red low-stock alert badge appears next to the item on the admin panel, and an alert is recorded in the activity log.",
    },
    {
      q: "Is there online payment integrated?",
      a: "For demonstration purposes, all orders are processed via Cash on Delivery (COD) with flat shipping. This allows clinics to operate delivery fleets locally within cities like Jodhpur.",
    },
  ];

  return (
    <main className="relative flex flex-col items-center justify-start w-full min-h-screen bg-[#070b13] overflow-hidden text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[130px] animate-pulse-glow" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: "3s" }} />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "5s" }} />

      {/* Floating Blurred Navigation Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl h-16 z-50 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shadow-2xl transition-all">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white">
            <PawPrint className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            MediCare
          </span>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#simulator" className="hover:text-white transition-colors">Simulator</a>
          <a href="#workflow" className="hover:text-white transition-colors">Journey</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQs</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl font-bold transition-all text-xs sm:text-sm text-slate-300 hover:text-white"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl font-bold transition-all shadow-md shadow-blue-500/10 text-xs sm:text-sm text-white"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full pt-36 pb-20 px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto z-10 gap-12 lg:gap-8">
        
        {/* Left Side Content */}
        <div className="flex-1 text-left space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" /> Complete Clinic & Pet Ecosystem
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Smart Health, Refills <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              & Booking for Pets
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
            A veterinary care management platform. Pet parents can register medical profiles, order prescriptions with simulated GPS locking, and request grooming or medical visits. Admins get central inventory management, live stock counters, order dispatch logs, and booking approval dashboards.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/signup"
              className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 group text-sm"
            >
              Start Your Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/login"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl font-bold transition-all text-sm text-slate-300 hover:text-white"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>

        {/* Right Side - Interactive Dashboard mock switcher */}
        <div className="flex-1 w-full max-w-lg lg:max-w-xl z-10">
          <div className="relative p-1.5 rounded-3xl bg-slate-900/60 border border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between p-2 border-b border-white/5 bg-slate-950/50 rounded-t-2xl">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setHeroTab("parent")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    heroTab === "parent"
                      ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  🐶 Pet Parent Portal
                </button>
                <button
                  onClick={() => setHeroTab("admin")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    heroTab === "admin"
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  💼 Admin Operations Hub
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                <span className="w-2 h-2 rounded-full bg-green-500/80" />
              </div>
            </div>

            {/* Dashboard Container */}
            <div className="p-5 min-h-[340px] flex flex-col justify-between text-xs space-y-4">
              {heroTab === "parent" ? (
                /* PARENT INTERACTIVE PORTAL SCREEN MOCK */
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Top Bar info */}
                  <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
                        B
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                          Buddy <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Golden Retriever</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Owner: Registered Parent</p>
                      </div>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Active Pet Profile" />
                  </div>

                  {/* Two Column details */}
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Vaccination Timelines */}
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2.5">
                      <h4 className="font-bold text-slate-300 flex items-center gap-1">
                        <ClipboardList className="w-3.5 h-3.5 text-indigo-400" /> Vaccination Due
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] bg-slate-950/40 p-1.5 rounded border border-white/5">
                          <span className="text-slate-400">Rabies Booster</span>
                          <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                            <Check className="w-3 h-3 text-emerald-400" /> Ok
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] bg-slate-950/40 p-1.5 rounded border border-white/5">
                          <span className="text-slate-400">DHPP Multi</span>
                          <span className="text-orange-400 font-semibold">Due July 12</span>
                        </div>
                      </div>
                    </div>

                    {/* Booked appointment */}
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2.5">
                      <h4 className="font-bold text-slate-300 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" /> Appointments
                      </h4>
                      <div className="bg-slate-950/40 p-2 rounded border border-white/5 space-y-1">
                        <div className="font-bold text-[10px] text-purple-300 flex items-center gap-1">
                          🛁 Grooming Bathing
                        </div>
                        <div className="text-[9px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-slate-500" /> Tomorrow 10:30 AM
                        </div>
                        <span className="inline-block mt-1 text-[8px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/10">
                          APPROVED
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Refill status & GPS LOCK */}
                  <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-blue-400 animate-bounce" /> Medicine Refill #1029
                      </div>
                      <p className="text-[9px] text-slate-500">COD Delivery Locked to Jodhpur Base</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-blue-400 animate-pulse bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        SHIPPED
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* ADMIN HUB PORTAL SCREEN MOCK */
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Top Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center">
                      <div className="text-slate-400 text-[9px] uppercase tracking-wider">Pending Orders</div>
                      <div className="text-base font-extrabold text-indigo-400">12</div>
                    </div>
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                      <div className="text-slate-400 text-[9px] uppercase tracking-wider">Low Stock items</div>
                      <div className="text-base font-extrabold text-rose-400 animate-pulse">3</div>
                    </div>
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                      <div className="text-slate-400 text-[9px] uppercase tracking-wider">Approved Slots</div>
                      <div className="text-base font-extrabold text-emerald-400">18</div>
                    </div>
                  </div>

                  {/* Active orders control widget */}
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-semibold">Active Dispatch Control:</span>
                      <span className="font-mono text-slate-500">Order ID: #MCD-3094</span>
                    </div>
                    <div className="bg-slate-950/40 p-2 rounded border border-white/5 space-y-1">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>Client • Buddy</span>
                        <span className="text-indigo-400">₹740 (COD)</span>
                      </div>
                      <div className="text-[9px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-400" /> locked GPS: 26.2389° N, 73.0243° E
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex justify-between gap-2 pt-1">
                      <button className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[9px] font-bold text-slate-300 transition-colors">
                        Pack Order
                      </button>
                      <button className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[9px] font-bold text-slate-300 transition-colors">
                        Ship Order
                      </button>
                      <button className="flex-1 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-[9px] font-bold text-white transition-colors shadow shadow-indigo-600/30">
                        Set Delivered
                      </button>
                    </div>
                  </div>

                  {/* Realtime logs timeline */}
                  <div className="p-2.5 bg-slate-950/40 border border-white/5 rounded-xl space-y-1.5 font-mono text-[9px] text-slate-500">
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                      <Activity className="w-3.5 h-3.5 text-rose-400" /> System Action logs
                    </div>
                    <div className="space-y-0.5">
                      <p><span className="text-slate-600">[17:42]</span> <strong className="text-slate-400">Client Profile</strong> placed order #MCD-3094</p>
                      <p><span className="text-slate-600">[17:39]</span> Alert: <strong className="text-red-400">Paracetamol Syrup</strong> stock level fell below 5</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom footer text */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3.5 text-[9px] text-slate-500 font-mono">
                <span>DATABASE STATUS: ONLINE (AWS NEON)</span>
                <span>SECURE SSL v3</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Metrics Slider */}
      <section className="w-full py-12 bg-slate-950/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          {[
            { label: "Registered Pets", value: "250+", icon: <PawPrint className="w-4 h-4 text-blue-400 mx-auto" /> },
            { label: "Prescription Deliveries", value: "480+", icon: <Pill className="w-4 h-4 text-indigo-400 mx-auto" /> },
            { label: "Active Admins & Clinic Staff", value: "100% Logs", icon: <UserCheck className="w-4 h-4 text-emerald-400 mx-auto" /> },
            { label: "Simulated GPS Locks", value: "Flat ₹50 Shipping", icon: <MapPin className="w-4 h-4 text-rose-400 mx-auto" /> },
          ].map((m, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-center">{m.icon}</div>
              <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {m.value}
              </div>
              <div className="text-xs text-slate-500 font-semibold">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Order & GPS Simulator Section */}
      <section id="simulator" className="relative w-full py-24 px-4 sm:px-6 z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-bold text-rose-400 uppercase tracking-wider">
              🎮 Interactive Playground
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Try Our Simulated GPS Checkout</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Simulate adding medicine refills to your cart, locking your device coordinates on Jodhpur grid, and placing a test order.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product Shelf (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-blue-400" /> Veterinary Medicine Shelf
              </h3>

              <div className="space-y-3">
                {mockMedicines.map((med) => {
                  const inCart = simulatorCart.find((i) => i.id === med.id);
                  return (
                    <div key={med.id} className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex justify-between items-center hover:border-indigo-500/20 transition-all">
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">{med.name}</h4>
                        <p className="text-[10px] text-indigo-400">₹{med.price} • {med.form}</p>
                      </div>
                      
                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRemoveFromCart(med.id)}
                            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono text-slate-200">{inCart.qty}</span>
                          <button
                            onClick={() => handleAddToCart(med)}
                            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(med)}
                          className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold text-white transition-colors"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Middle: Shopping Cart & Checkout Input (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-indigo-400" /> Simulator Cart
                </h3>
                {simulatorCart.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-[10px] text-slate-500 hover:text-red-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {simulatorCart.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <ShoppingCart className="w-8 h-8 mx-auto text-slate-700 animate-pulse" />
                  <p className="text-xs">Your cart is empty.</p>
                  <p className="text-[10px] text-slate-600">Select items on the shelf to start.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items list */}
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {simulatorCart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs bg-slate-950/20 p-2 rounded-lg border border-white/5">
                        <div>
                          <div className="font-semibold text-slate-300">{item.name}</div>
                          <div className="text-[9px] text-slate-500">₹{item.price} x {item.qty}</div>
                        </div>
                        <span className="font-mono font-bold text-slate-200">₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  {/* Address input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">
                      Delivery Address (Manual Input)
                    </label>
                    <input
                      type="text"
                      value={simulatorAddress}
                      onChange={(e) => setSimulatorAddress(e.target.value)}
                      disabled={orderComplete}
                      className="w-full text-xs p-2.5 rounded-lg bg-slate-950/60 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                    />
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 border-t border-white/5 pt-3 text-[11px] font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Items Subtotal:</span>
                      <span>₹{cartSubtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Flat Delivery Fee:</span>
                      <span>₹50</span>
                    </div>
                    <div className="flex justify-between text-slate-200 font-bold border-t border-white/5 pt-1.5 text-xs">
                      <span>Total Cost (COD):</span>
                      <span className="text-indigo-400">₹{cartTotal}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: GPS Telemetry Lock & Receipt (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-950/50 border border-white/10 shadow-2xl relative min-h-[300px] flex flex-col justify-between">
              
              {!orderComplete ? (
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-400" /> GPS Telemetry Module
                    </h3>

                    {/* GPS Map grid visualizer */}
                    <div className="h-28 w-full bg-slate-950 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center font-mono">
                      
                      {/* Grid background lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
                      
                      {gpsLoading ? (
                        <div className="text-center space-y-2 z-10">
                          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
                          <p className="text-[9px] text-slate-500 tracking-wider">ACQUIRING TELESIGNAL...</p>
                        </div>
                      ) : gpsLocked ? (
                        <div className="text-center space-y-1.5 z-10 p-2">
                          <MapPin className="w-6 h-6 text-emerald-400 animate-bounce mx-auto" />
                          <p className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">
                            🛰️ COORD LOCKED
                          </p>
                          <p className="text-[9px] text-slate-400">
                            {tempLatitude.toFixed(6)}° N, {tempLongitude.toFixed(6)}° E
                          </p>
                        </div>
                      ) : (
                        <div className="text-center space-y-1.5 z-10">
                          <MapPinOff className="w-6 h-6 text-slate-700 mx-auto" />
                          <p className="text-[9px] text-slate-500">GPS TELEMETRY STATUS: DISCONNECTED</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={triggerGpsLock}
                      disabled={gpsLoading || simulatorCart.length === 0}
                      className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all font-bold text-xs text-slate-200 disabled:opacity-50"
                    >
                      {gpsLocked ? "Re-Acquire Coordinates" : "Get Current Location (GPS Lock)"}
                    </button>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={simulatorCart.length === 0 || gpsLoading}
                    className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl font-bold text-xs text-white transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Place Cash on Delivery Order
                  </button>
                </>
              ) : (
                /* ORDER COMPLETION STATE SCREEN */
                <div className="space-y-4 animate-fade-in flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce mt-2">
                      <Check className="w-6 h-6" />
                    </div>
                    
                    <div className="text-center space-y-1">
                      <h4 className="font-extrabold text-sm text-slate-100">Order Placed Successfully!</h4>
                      <p className="text-[10px] text-slate-500">Order Ref: <span className="font-mono text-indigo-400 font-bold">{placedOrderId}</span></p>
                    </div>

                    {/* Placed Order Summary details */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5 space-y-2 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-600 block">DELIVERY ADDRESS:</span>
                        <span className="text-slate-300">{simulatorAddress}</span>
                      </div>
                      
                      {gpsLocked && (
                        <div>
                          <span className="text-slate-600 block">LOCKED COORDINATES:</span>
                          <span className="text-emerald-400">{tempLatitude.toFixed(6)}° N, {tempLongitude.toFixed(6)}° E</span>
                        </div>
                      )}

                      <div className="border-t border-white/5 pt-2">
                        <span className="text-slate-600 block">SHIPPING TYPE:</span>
                        <span className="text-slate-300">COD (Cash on Delivery)</span>
                      </div>

                      <div className="flex justify-between border-t border-white/5 pt-1.5 font-bold">
                        <span className="text-slate-400">TOTAL COST:</span>
                        <span className="text-indigo-400">₹{cartTotal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {/* Suggesting real app connection */}
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[9px] text-indigo-300 text-center leading-relaxed">
                      💡 <strong>Next Step:</strong> Log in as an Administrator to view active telemetry logs, dispatch, and mark orders as Delivered!
                    </div>

                    <button
                      onClick={handleResetSimulator}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      Reset Simulator Playground
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* Feature Deep Dive Section */}
      <section id="features" className="relative w-full py-24 px-4 sm:px-6 bg-slate-950/20 border-y border-white/5 z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Our Feature-Rich Ecosystem</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Everything pet owners and medical administrators need to manage medication schedules, inventories, and treatments.
            </p>

            {/* Feature Tabs Selector */}
            <div className="flex flex-wrap gap-2 justify-center pt-6">
              {[
                { id: "pets", label: "🐶 Pet Health & Vaccine Bios" },
                { id: "pharmacy", label: "💊 Medicine Store Catalog" },
                { id: "booking", label: "📅 Vet & Grooming Booking" },
                { id: "admin", label: "📊 Admin Control Panel" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFeatureTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    featureTab === tab.id
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Showcase Tab Content */}
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md">
            <AnimatePresence mode="wait">
              {featureTab === "pets" && (
                <motion.div
                  key="pets"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                      Manage Pet Profiles & Vaccination Timelines
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Create individual profiles for multiple pets. Log key characteristics like species, breed, gender, and age, then track their clinical immunization histories in a visually structured timeline.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Vaccination alerts trigger next-dose dates directly inside the dashboard.
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Admins can record medicine dosage completions (e.g. Paracetamol, Rabies vaccine) for specific pets.
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Keep notes on special allergy restrictions, weights, and birth dates.
                      </li>
                    </ul>
                  </div>

                  {/* Visual mockup block */}
                  <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3 font-mono text-[10px]">
                    <div className="font-bold text-slate-400 border-b border-white/5 pb-2">
                      🐶 VACCINE HISTOGRAM (BUDDY)
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                        <div>
                          <p className="font-bold text-slate-200">DHPP Triple Dose</p>
                          <p className="text-[8px] text-slate-500 font-normal">Completed Jun 12, 2026</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">COMPLETED</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                        <div>
                          <p className="font-bold text-slate-200">Rabies Immunization</p>
                          <p className="text-[8px] text-slate-500 font-normal">Target Date: Jul 18, 2026</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">NEXT DUE</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {featureTab === "pharmacy" && (
                <motion.div
                  key="pharmacy"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                      Medicine Catalog & Flat Rate Order Refills
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Order prescription medicines (tablets, syrups, injections) with real-time stock-level validations. Place orders for home delivery using flat-rate delivery charges (₹50) and local COD fulfillment.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Sort through dosage forms: Syrup, Tablet, Topical, Powders.
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Simulate live coordinate pin locations via built-in GPS telemetry checks.
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Secure orders locked dynamically into the Neon database.
                      </li>
                    </ul>
                  </div>

                  {/* Visual mockup block */}
                  <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2.5 font-mono text-[10px]">
                    <div className="font-bold text-slate-400 border-b border-white/5 pb-2">
                      💊 MEDICATION INVENTORY
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[9px]">
                      <div className="p-2 bg-white/5 rounded border border-white/5 space-y-1">
                        <div className="font-bold text-slate-300">Amoxicillin (100ml)</div>
                        <p className="text-slate-500">In Stock: 42 left</p>
                        <span className="text-[8px] bg-green-500/10 text-green-400 px-1 rounded">HEALTHY</span>
                      </div>
                      <div className="p-2 bg-white/5 rounded border border-white/5 space-y-1">
                        <div className="font-bold text-slate-300">Paracetamol Syrup</div>
                        <p className="text-slate-500">In Stock: 3 left</p>
                        <span className="text-[8px] bg-red-500/10 text-red-400 px-1 rounded animate-pulse">LOW STOCK</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {featureTab === "booking" && (
                <motion.div
                  key="booking"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                      Vet Consultation & Grooming Scheduler
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Select consultation types with medical experts, or opt for professional pet styling services: Bathing, Haircut, or the complete grooming treatment package.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Pick custom booking dates and times using the scheduling grid.
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Status updates transition instantly: Pending, Approved, Completed, or Rejected.
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Historical logs preserve all completed clinical appointments.
                      </li>
                    </ul>
                  </div>

                  {/* Visual mockup block */}
                  <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 font-mono text-[10px]">
                    <div className="font-bold text-slate-400 border-b border-white/5 pb-2">
                      📅 APPOINTMENT STATUS WORKFLOW
                    </div>
                    <div className="space-y-1.5 text-[9px] text-slate-400">
                      <div className="flex justify-between p-1.5 bg-yellow-500/10 text-yellow-400 rounded">
                        <span>🐕 Grooming Haircut (Buddy)</span>
                        <span>PENDING APPROVAL</span>
                      </div>
                      <div className="flex justify-between p-1.5 bg-blue-500/10 text-blue-400 rounded">
                        <span>🩺 Doctor consultation (Buddy)</span>
                        <span>SLOT APPROVED</span>
                      </div>
                      <div className="flex justify-between p-1.5 bg-emerald-500/10 text-emerald-400 rounded">
                        <span>🛁 Bathing Treatment (Max)</span>
                        <span>COMPLETED</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {featureTab === "admin" && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                      Admin Command Desk & Operational Controls
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Designed to give veterinarians and clinic operators full transparency. Manage medication inventory levels, process deliveries, update booking slots, respond to user support requests, and view automatically-generated activity logs.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Unified dashboards showing stock, pending orders, and appointment workflows.
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Reply to support questions and resolve parent support tickets.
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        Track clinic operations logs detailing stock alerts, registrations, and checkouts.
                      </li>
                    </ul>
                  </div>

                  {/* Visual mockup block */}
                  <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 font-mono text-[9px] text-slate-500">
                    <div className="font-bold text-slate-400 border-b border-white/5 pb-2 text-[10px]">
                      📊 ADMIN ACTION CONTROLS
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-white/5 space-y-1 text-slate-400">
                      <p className="font-bold text-slate-300">Order Dispatch Dispatcher</p>
                      <p>Customer: Registered Client</p>
                      <p>Locked GPS: 26.2389° N</p>
                      <div className="flex gap-1.5 pt-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[8px] font-bold text-slate-300 cursor-pointer">PACK</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[8px] font-bold text-slate-300 cursor-pointer">SHIP</span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-[8px] font-bold text-white cursor-pointer">DELIVER</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Parent Journey / Workflow */}
      <section id="workflow" className="relative w-full py-20 px-4 sm:px-6 z-10">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">The Pet Parent Journey</h2>
            <p className="text-slate-500 text-sm">Four simple stages to align your pet's wellness with our ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "Register Account",
                desc: "Sign up yourself or visit our Jodhpur center to link your details and add your pets' details."
              },
              {
                step: "02",
                title: "Request Services",
                desc: "Select medicine products, lock your device coordinates, or choose booking date slots."
              },
              {
                step: "03",
                title: "Admin Fulfillment",
                desc: "Admin accepts the slots, manages medication stocks, and dispatches orders."
              },
              {
                step: "04",
                title: "Receive & Rate",
                desc: "Pay Cash on Delivery for medicine refills and submit feedback comments to rate services."
              }
            ].map((s, i) => (
              <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl relative space-y-3 hover:border-indigo-500/25 transition-all">
                <div className="text-4xl font-extrabold text-indigo-500/20 font-mono">{s.step}</div>
                <h4 className="font-bold text-base text-slate-100">{s.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Review Grid */}
      <section className="relative w-full py-24 px-4 sm:px-6 bg-slate-950/20 border-y border-white/5 z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">What Pet Parents Say</h2>
            <p className="text-slate-500 text-sm">Real reviews submitted by active clients of our center.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Vikram Singh",
                pet: "Buddy (Retriever)",
                review: "The vaccination timeline feature is amazing. I always know when Buddy's booster is due. Highly recommended!",
                rating: 5,
              },
              {
                name: "Anjali Sharma",
                pet: "Simba (Persian Cat)",
                review: "Ordering medication is seamless. The GPS coordinates lock is so helpful since my house is hard to find on normal maps.",
                rating: 5,
              },
              {
                name: "Rajesh Gehlot",
                pet: "Bruno (German Shepherd)",
                review: "I use Medicare for booking weekly bathing grooming. The approval is quick, and the center handles Bruno with great care.",
                rating: 5,
              },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex gap-0.5 text-yellow-500">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">"{t.review}"</p>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                  <div className="font-bold text-xs text-slate-200">{t.name}</div>
                  <div className="text-[10px] text-indigo-400 font-mono">{t.pet}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collapsible FAQ Section */}
      <section id="faq" className="relative w-full py-24 px-4 sm:px-6 z-10">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-sm">Answers to common questions about accounts, booking, and delivery.</p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="border border-white/10 bg-slate-900/40 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-5 flex items-center justify-between text-left text-sm font-bold text-slate-100 hover:text-indigo-400 transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-white/5 bg-slate-950/20">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Clinic Footer */}
      <footer className="w-full py-16 px-6 bg-slate-950 border-t border-white/5 text-center text-slate-500 space-y-6 relative z-10">
        <div className="flex gap-6 justify-center items-center">
          <a
            target="_blank"
            href="https://www.instagram.com/shri.karni.pet.care.center?igsh=MWZqd2gxbDZtc2NmNQ=="
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
            rel="noopener noreferrer"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
        
        <div className="space-y-3.5 max-w-lg mx-auto">
          <p className="text-xs">© {new Date().getFullYear()} Shri Karni Pet Care Center. All rights reserved.</p>
          <div className="h-px bg-white/5 w-1/2 mx-auto" />
          <p className="text-[10px] text-slate-600 leading-relaxed">
            Operations Hub: Jodhpur, Rajasthan, India <br />
            Email: shreekarnimedical01@gmail.com • Support Phone: +91 9876543210
          </p>
        </div>
      </footer>
    </main>
  );
}
