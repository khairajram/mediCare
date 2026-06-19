"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaShoppingBag, FaMapMarkerAlt, FaLocationArrow, FaPlus, FaMinus, FaTrash, FaArrowLeft, FaCheck } from "react-icons/fa";
import Link from "next/link";

interface Medicine {
  id: string;
  name: string;
  type: string;
  dose: string | null;
  price: number;
  quantityInStock: number;
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  medicine: {
    name: string;
    type: string;
    dose: string | null;
  };
}

interface Order {
  id: string;
  createdAt: string;
  deliveryAddress: string;
  lat?: number | null;
  lng?: number | null;
  deliveryFee: number;
  totalCost: number;
  status: string;
  items: OrderItem[];
}

export default function UserOrdersPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Checkout details
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  
  // Mock Map coordinates
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [usingMap, setUsingMap] = useState(false);
  const [mapPinned, setMapPinned] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch available medicines
      const medRes = await fetch("/api/MedicineRecord/medicineMaster");
      const medData = await medRes.json();
      if (medRes.ok) {
        setMedicines(medData.medicines || []);
      }

      // Fetch user's orders
      const orderRes = await fetch("/api/orders");
      const orderData = await orderRes.json();
      if (orderRes.ok) {
        setOrders(orderData.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToCart = (med: Medicine) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === med.id);
      if (existing) {
        if (existing.quantity >= med.quantityInStock) {
          alert(`Cannot add more. Only ${med.quantityInStock} items in stock.`);
          return prev;
        }
        return prev.map((item) =>
          item.medicine.id === med.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { medicine: med, quantity: 1 }];
    });
  };

  const updateQuantity = (medId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.medicine.id === medId) {
            const nextQty = item.quantity + delta;
            if (nextQty > item.medicine.quantityInStock) {
              alert(`Cannot add more. Only ${item.medicine.quantityInStock} items in stock.`);
              return item;
            }
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (medId: string) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== medId));
  };

  // Mock Map Location simulation
  const simulateMapPin = () => {
    setUsingMap(true);
    setLoading(true);
    setTimeout(() => {
      // Simulate pinning at user's current city center
      const randomLat = 26.2389 + (Math.random() - 0.5) * 0.05;
      const randomLng = 73.0243 + (Math.random() - 0.5) * 0.05;
      setLat(parseFloat(randomLat.toFixed(6)));
      setLng(parseFloat(randomLng.toFixed(6)));
      setAddress("Jodhpur, Rajasthan, India (GPS Pin)");
      setMapPinned(true);
      setLoading(false);
    }, 1000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!address) return alert("Please specify a delivery address.");

    try {
      setSubmitting(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryAddress: address,
          lat,
          lng,
          notes,
          items: cart.map((item) => ({
            medicineId: item.medicine.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Order placed successfully! Cash on Delivery (COD) will be collected upon arrival.");
        setCart([]);
        setAddress("");
        setNotes("");
        setLat(null);
        setLng(null);
        setUsingMap(false);
        setMapPinned(false);
        fetchData(); // refresh list
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    } finally {
      setSubmitting(false);
    }
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 50.0 : 0.0;
  const cartTotal = cartSubtotal + deliveryFee;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending Approval</Badge>;
      case "PACKING":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Packing</Badge>;
      case "SHIPPED":
        return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">Out for Delivery</Badge>;
      case "DELIVERED":
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Delivered</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto dark:text-white text-gray-800 min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Store & Refills</h1>
          <p className="text-sm text-gray-500">Order medicines directly. Pay Cash on Delivery (COD).</p>
        </div>
        <Link href="/home">
          <Button variant="outline" className="flex items-center gap-2">
            <FaArrowLeft /> Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Medicine Product Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FaShoppingBag className="text-blue-500" /> Available Products
          </h2>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 text-xs mt-3">Loading store items...</p>
            </div>
          ) : medicines.length === 0 ? (
            <Card className="p-10 text-center">
              <p className="text-gray-500">No products are currently cataloged by the administrator.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {medicines.map((med) => {
                const inCart = cart.find((item) => item.medicine.id === med.id);
                return (
                  <Card key={med.id} className="border dark:border-gray-800 shadow-sm glass-card overflow-hidden">
                    <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="font-bold text-base leading-tight truncate">{med.name}</h3>
                          <Badge variant="outline" className="text-xs uppercase bg-slate-50 dark:bg-slate-900">{med.type}</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Dosage: {med.dose || "As directed"}</p>
                        
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-3">
                          ₹{med.price.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t dark:border-gray-800">
                        <span className="text-xs text-gray-400">
                          {med.quantityInStock > 0 ? (
                            <span className="text-green-600 dark:text-green-400 font-semibold">{med.quantityInStock} in stock</span>
                          ) : (
                            <span className="text-red-500 font-semibold">Out of Stock</span>
                          )}
                        </span>

                        <Button
                          size="sm"
                          disabled={med.quantityInStock <= 0 || (inCart && inCart.quantity >= med.quantityInStock)}
                          onClick={() => addToCart(med)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                        >
                          {inCart ? `Add More (${inCart.quantity})` : "Add to Cart"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Shopping Cart & Location Pin Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border dark:border-gray-800 shadow-sm glass-card">
            <CardHeader className="border-b dark:border-gray-800 py-4 px-5">
              <CardTitle className="text-base font-bold flex items-center gap-2">🛒 Order Cart</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  Your cart is empty. Click items to add.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items List */}
                  <ul className="divide-y dark:divide-gray-800 text-sm max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <li key={item.medicine.id} className="py-2.5 flex justify-between items-center gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold truncate">{item.medicine.name}</div>
                          <div className="text-xs text-gray-400">₹{item.medicine.price} each</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.medicine.id, -1)}
                            className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.medicine.id, 1)}
                            className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                          >
                            <FaPlus className="text-xs" />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.medicine.id)}
                            className="p-1.5 ml-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Delivery details form */}
                  <form onSubmit={handleSubmitOrder} className="pt-4 border-t dark:border-gray-800 space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Delivery Address</label>
                      <input
                        type="text"
                        required
                        placeholder="House no, Street name, City"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2.5 border dark:border-gray-800 rounded-lg bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* GPS Map Pinner */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-400 uppercase tracking-wider block">Live Map Location Pin</span>
                        <button
                          type="button"
                          onClick={simulateMapPin}
                          className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline bg-transparent text-xs"
                        >
                          <FaLocationArrow className="animate-bounce" /> Pin GPS Location
                        </button>
                      </div>

                      {mapPinned ? (
                        <div className="space-y-2">
                          <div className="relative w-full h-32 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-3">
                            {/* Gridlines overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
                            
                            {/* Pulse rings */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                              <span className="absolute inline-flex h-12 w-12 rounded-full bg-blue-500/30 animate-ping" />
                              <span className="absolute inline-flex h-6 w-6 rounded-full bg-blue-500/40 animate-pulse" />
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                            </div>

                            {/* Corner coordinates HUD */}
                            <div className="relative z-10 flex justify-between text-[9px] font-mono text-slate-500">
                              <span>COORD_LOCK</span>
                              <span>ALT: 218m</span>
                            </div>

                            <div className="relative z-10 text-[10px] font-mono text-blue-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              GPS PIN: {lat}° N, {lng}° E
                            </div>
                          </div>
                          
                          <div className="p-2.5 bg-green-500/10 rounded-lg border border-green-500/20 text-green-700 dark:text-green-400 flex items-center justify-between">
                            <span>📍 Location Pinned successfully!</span>
                            <FaCheck className="text-xs" />
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border dark:border-slate-900/60 text-center text-gray-400 flex flex-col items-center justify-center gap-1.5">
                          <span className="text-lg">🗺️</span>
                          <span>No GPS Pin set. Click above to simulate live location selection.</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Order Notes (Optional)</label>
                      <input
                        type="text"
                        placeholder="Special delivery instructions"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-2.5 border dark:border-gray-800 rounded-lg bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Invoice Pricing */}
                    <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-lg border dark:border-gray-900/30 text-sm">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Subtotal</span>
                        <span>₹{cartSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t dark:border-gray-800 pt-1.5 mt-1.5">
                        <span>Total Cost</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 text-xs tracking-wide uppercase"
                    >
                      {submitting ? "Placing Order..." : "Place Cash On Delivery Order"}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* User Order History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          📋 Order History
        </h2>
        {orders.length === 0 ? (
          <Card className="p-8 text-center text-gray-500 text-sm">
            You haven&apos;t placed any orders yet.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="border dark:border-gray-800 shadow-sm glass-card overflow-hidden">
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-gray-400">Order ID: {order.id.slice(0, 8)}...</div>
                      <div className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Items summary */}
                  <ul className="text-xs space-y-1 divide-y dark:divide-gray-800/50">
                    {order.items.map((item) => (
                      <li key={item.id} className="pt-1.5 flex justify-between">
                        <span>{item.medicine.name} ({item.quantity}x)</span>
                        <span className="font-semibold">₹{item.quantity * item.priceAtPurchase}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t dark:border-gray-800 flex justify-between items-center text-sm">
                    <div>
                      <span className="text-xs text-gray-400 block">Deliver to:</span>
                      <span className="font-medium text-xs truncate max-w-[200px] block" title={order.deliveryAddress}>
                        {order.deliveryAddress}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">Total paid:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">₹{order.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
