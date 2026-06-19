"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaStar, FaCommentAlt, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function UserFeedbackPage() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Thank you for your valuable feedback! We appreciate your support.");
        setComment("");
        setRating(5);
      } else {
        alert(data.message || "Failed to submit feedback");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto dark:text-white text-gray-800 min-h-screen flex flex-col justify-start space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Share Feedback</h1>
          <p className="text-sm text-gray-500">Rate your experience with Karni Medical.</p>
        </div>
        <Link href="/home">
          <Button variant="outline" className="flex items-center gap-2 text-xs">
            <FaArrowLeft /> Dashboard
          </Button>
        </Link>
      </div>

      <Card className="border dark:border-gray-800 shadow-sm glass-card">
        <CardHeader className="border-b dark:border-gray-800 py-4 px-5">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FaCommentAlt className="text-yellow-500" /> Share Review
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            
            {/* Star Selector */}
            <div className="space-y-2 text-center">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Overall Rating
              </label>
              
              <div className="flex justify-center gap-2 text-3xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="transition-transform duration-100 hover:scale-125 focus:outline-none"
                  >
                    <FaStar
                      className={`${
                        star <= (hoverRating ?? rating)
                          ? "text-yellow-500 fill-current"
                          : "text-gray-200 dark:text-gray-800"
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              <span className="text-xs font-medium text-gray-400 block">
                {rating === 5 && "😍 Excellent! Loved it."}
                {rating === 4 && "😊 Great! Very satisfied."}
                {rating === 3 && "😐 Average. Good experience."}
                {rating === 2 && "😟 Poor. Needs improvement."}
                {rating === 1 && "😡 Terrible. Dissatisfied."}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Your Review Comments</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about our service, delivery workers, doctor appointments, or anything else..."
                className="w-full p-3 glass-input rounded-xl text-sm focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 text-xs tracking-wide uppercase"
            >
              {submitting ? "Submitting Review..." : "Submit Review"}
            </Button>
          </form>
        </CardContent>
      </Card>

    </div>
  );
}
