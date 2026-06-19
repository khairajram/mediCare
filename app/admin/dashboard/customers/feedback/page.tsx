"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaStar, FaArrowLeft, FaComments } from "react-icons/fa";
import Link from "next/link";

interface Feedback {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: {
    name: string;
    phoneNo: string;
  };
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("/api/feedback");
        const data = await res.json();
        if (res.ok) {
          setFeedbacks(data.feedbacks || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const totalReviews = feedbacks.length;
  const avgRating = totalReviews > 0 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";

  // Calculate rating breakdown
  const counts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5 stars
  feedbacks.forEach((f) => {
    if (f.rating >= 1 && f.rating <= 5) {
      counts[f.rating - 1]++;
    }
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`${i < rating ? "fill-current" : "text-gray-200 dark:text-gray-800"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto dark:text-white text-gray-800 min-h-screen bg-white dark:bg-[#1E1E1E] min-w-full space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Feedback & Ratings</h1>
          <p className="text-sm text-gray-500">Monitor client testimonials and service satisfaction metrics.</p>
        </div>
        <Link href="/admin/dashboard/customers">
          <Button variant="outline" className="flex items-center gap-2">
            <FaArrowLeft /> Back
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm mt-3">Loading feedback...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Summary Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="glass-card text-center p-6 border dark:border-gray-800">
              <CardTitle className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-2">Average Score</CardTitle>
              <div className="text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">{avgRating}</div>
              <div className="flex justify-center mb-1">
                {renderStars(Math.round(parseFloat(avgRating)))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Based on {totalReviews} reviews</p>
            </Card>

            <Card className="glass-card p-6 border dark:border-gray-800">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-sm uppercase tracking-wider text-gray-400 font-semibold">Ratings Distribution</CardTitle>
              </CardHeader>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = counts[star - 1];
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 font-semibold">{star}</span>
                      <FaStar className="text-yellow-500 flex-shrink-0" />
                      <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-yellow-500 h-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-6 text-right text-gray-400">{count}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Testimonials List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FaComments className="text-blue-500" /> Client Reviews ({totalReviews})
            </h2>

            {feedbacks.length === 0 ? (
              <Card className="text-center py-16 glass-panel">
                <p className="text-gray-500 text-sm">No user feedback has been posted yet.</p>
              </Card>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {feedbacks.map((f) => (
                  <Card key={f.id} className="border dark:border-gray-800 shadow-sm glass-card">
                    <CardContent className="p-5 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-sm">{f.user.name}</div>
                          <div className="text-[10px] text-gray-400">Phone: {f.user.phoneNo}</div>
                        </div>
                        <div className="text-right">
                          {renderStars(f.rating)}
                          <span className="text-[10px] text-gray-400 block mt-1">
                            {new Date(f.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {f.comment ? (
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border dark:border-gray-900/30 italic">
                          &quot;{f.comment}&quot;
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 italic">No comment provided.</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}