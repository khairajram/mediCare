"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaTruck, FaBoxOpen, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaSync } from "react-icons/fa";
import Link from "next/link";

interface OrderItem {
  id: string;
  medicine: {
    name: string;
    type: string;
    dose: string;
    price: number;
  };
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  id: string;
  createdAt: string;
  deliveryAddress: string;
  lat?: number | null;
  lng?: number | null;
  deliveryFee: number;
  totalCost: number;
  status: "PENDING" | "PACKING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  notes?: string | null;
  user: {
    name: string;
    phoneNo: string;
    email: string | null;
  };
  pet?: {
    name: string;
    species: string;
  } | null;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setActionLoading(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh local orders list
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating order status");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = filter === "ALL" 
    ? orders 
    : orders.filter((o) => o.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>;
      case "PACKING":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Packing</Badge>;
      case "SHIPPED":
        return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">Shipped</Badge>;
      case "DELIVERED":
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Delivered</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen dark:text-white text-gray-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Order Fulfillment
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View orders, dispatch workers, collect COD payments, and update delivery status.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchOrders} className="flex items-center gap-2">
            <FaSync className={`${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b dark:border-gray-800">
        {["ALL", "PENDING", "PACKING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              filter === status
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800"
            }`}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Orders Grid/Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading orders data...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="glass-panel text-center py-16">
          <div className="text-4xl mb-3">📦</div>
          <CardTitle className="text-lg font-bold">No Orders Found</CardTitle>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            There are no orders matching the status &quot;{filter.toLowerCase()}&quot;.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden border dark:border-gray-800 shadow-sm glass-card">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/60 border-b dark:border-gray-800 py-4 px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">Order ID: {order.id.slice(0, 8)}...</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">Total: ₹{order.totalCost.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">(Includes ₹{order.deliveryFee} Delivery Fee • COD)</div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Customer Details */}
                <div className="space-y-2 border-r dark:border-gray-800 pr-6">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Customer & Pet</h4>
                  <div>
                    <div className="font-bold text-base">{order.user.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{order.user.phoneNo}</div>
                    {order.user.email && <div className="text-sm text-gray-400">{order.user.email}</div>}
                  </div>

                  {order.pet && (
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-lg border dark:border-blue-900/30 flex items-center gap-2 text-sm mt-3">
                      <span>🐾</span>
                      <div>
                        For <span className="font-semibold">{order.pet.name}</span> ({order.pet.species})
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Address & Map Info */}
                <div className="space-y-2 border-r dark:border-gray-800 pr-6">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Delivery Details</h4>
                  <div className="flex items-start gap-2 text-sm">
                    <FaMapMarkerAlt className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{order.deliveryAddress}</p>
                      {order.lat && order.lng ? (
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${order.lat},${order.lng}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1.5 font-semibold"
                        >
                          📍 Open Live Google Maps Location
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 block mt-1">Manual Address Input</span>
                      )}
                    </div>
                  </div>

                  {order.notes && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/15 p-2 rounded border border-yellow-100 dark:border-yellow-900/30 text-xs italic text-yellow-800 dark:text-yellow-400 mt-3">
                      &quot;{order.notes}&quot;
                    </div>
                  )}
                </div>

                {/* Items and Status Actions */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Ordered Items</h4>
                    <ul className="divide-y dark:divide-gray-800 text-sm">
                      {order.items.map((item) => (
                        <li key={item.id} className="py-1.5 flex justify-between">
                          <div>
                            <span className="font-medium">{item.medicine.name}</span>
                            <span className="text-xs text-gray-400 ml-1">({item.medicine.type} • {item.medicine.dose || 'N/A'})</span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-300">
                            {item.quantity} x ₹{item.priceAtPurchase} = <span className="font-semibold text-gray-800 dark:text-white">₹{item.quantity * item.priceAtPurchase}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions for Status updates */}
                  <div className="pt-2 border-t dark:border-gray-800 flex flex-wrap gap-2">
                    {order.status === "PENDING" && (
                      <Button
                        size="sm"
                        disabled={actionLoading === order.id}
                        onClick={() => updateOrderStatus(order.id, "PACKING")}
                        className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        <FaBoxOpen /> Approve & Pack
                      </Button>
                    )}

                    {order.status === "PACKING" && (
                      <Button
                        size="sm"
                        disabled={actionLoading === order.id}
                        onClick={() => updateOrderStatus(order.id, "SHIPPED")}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <FaTruck /> Dispatch / Ship
                      </Button>
                    )}

                    {order.status === "SHIPPED" && (
                      <Button
                        size="sm"
                        disabled={actionLoading === order.id}
                        onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <FaCheckCircle /> Mark Delivered (COD Paid)
                      </Button>
                    )}

                    {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === order.id}
                        onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/30"
                      >
                        <FaTimesCircle /> Cancel Order
                      </Button>
                    )}

                    {order.status === "DELIVERED" && (
                      <div className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1.5 py-1">
                        ✅ Delivery completed & cash payment collected. Inventory updated.
                      </div>
                    )}

                    {order.status === "CANCELLED" && (
                      <div className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5 py-1">
                        ❌ Order has been cancelled.
                      </div>
                    )}
                  </div>

                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}