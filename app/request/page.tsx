"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// --- Type Definitions ---
interface SessionRequest {
  name: string;
  roll_no: string;
  phone: string;
  course_branch: string;
  academic_year: string;
  accommodation: string;
}

const EMPTY_FORM: SessionRequest = {
  name: "",
  roll_no: "",
  phone: "",
  course_branch: "",
  academic_year: "",
  accommodation: "",
};

// --- Page ---
export default function RequestPage() {
  const [formData, setFormData] = useState<SessionRequest>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  // Honeypot: bots fill this hidden field, humans never see it
  const [honeypot, setHoneypot] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSuccess(false);

    // Honeypot check — bots fill hidden fields, humans don't
    if (honeypot) return;

    // Validate Indian mobile number: 10 digits, starts with 6–9
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ""))) {
      setFormError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      roll_no: formData.roll_no,
      phone: formData.phone,
      course_branch: formData.course_branch,
      academic_year: parseInt(formData.academic_year, 10), // INT constraint
      accommodation: formData.accommodation,               // SQL check: 'hosteler' | 'day_scholar'
    };

    try {
      const { error } = await supabase
        .from("session_requests")
        .insert([payload]);
      if (error) throw error;
      setIsSuccess(true);
      setFormData(EMPTY_FORM);
    } catch (error: unknown) {
      setFormError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-10"
      >
        <span aria-hidden>←</span> Back to Home
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
          Request a Session
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Fill in your details below to book a guided stargazing session at the
          club observatory. We&apos;ll review your request and get in touch.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
        {/* Honeypot — visually hidden, only bots fill this */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={e => setHoneypot(e.target.value)}
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
        />
        {/* Success */}
        {isSuccess && (
          <div className="mb-6 rounded-lg border border-emerald-800/50 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-400">
            🎉 Your session request has been submitted successfully! We&apos;ll
            be in touch soon.
          </div>
        )}

        {/* Error */}
        {formError && (
          <div className="mb-6 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {formError}
          </div>
        )}

        <form id="session-request-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="req-name" className="text-sm font-medium text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              id="req-name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
            />
          </div>

          {/* Roll No */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="req-roll" className="text-sm font-medium text-slate-300">
              Roll No
            </label>
            <input
              type="text"
              id="req-roll"
              name="roll_no"
              required
              value={formData.roll_no}
              onChange={handleInputChange}
              placeholder="e.g., 2023UCS101"
              className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
            />
          </div>

          {/* WhatsApp Number */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="req-phone" className="text-sm font-medium text-slate-300">
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="req-phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="e.g., +91 98765 43210"
              className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
            />
          </div>

          {/* Course / Branch */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="req-branch" className="text-sm font-medium text-slate-300">
              Course / Branch
            </label>
            <input
              type="text"
              id="req-branch"
              name="course_branch"
              required
              value={formData.course_branch}
              onChange={handleInputChange}
              placeholder="e.g., B.Tech CSE"
              className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
            />
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Academic Year */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="req-year" className="text-sm font-medium text-slate-300">
                Academic Year
              </label>
              <select
                id="req-year"
                name="academic_year"
                required
                value={formData.academic_year}
                onChange={handleInputChange}
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
              >
                <option value="" disabled>Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Accommodation */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="req-accom" className="text-sm font-medium text-slate-300">
                Accommodation
              </label>
              <select
                id="req-accom"
                name="accommodation"
                required
                value={formData.accommodation}
                onChange={handleInputChange}
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
              >
                <option value="" disabled>Select Type</option>
                <option value="hosteler">Hosteler</option>
                <option value="day_scholar">Day Scholar</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="submit-request-btn"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting…" : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
