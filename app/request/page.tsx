"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StarfieldCanvas from "@/components/StarfieldCanvas";

// --- Type Definitions ---
interface SessionRequest {
  name: string;
  roll_no: string;
  phone: string;
  course_branch: string;
  academic_year: string;
  accommodation: string;
  preferred_date: string;
  group_size: string;
  purpose: string;
}

const EMPTY_FORM: SessionRequest = {
  name: "",
  roll_no: "",
  phone: "",
  course_branch: "",
  academic_year: "",
  accommodation: "",
  preferred_date: "",
  group_size: "",
  purpose: "",
};

export default function RequestPage() {
  const [formData, setFormData] = useState<SessionRequest>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSuccess(false);

    // Honeypot anti-spam check
    if (honeypot) return;

    // Validate 10-digit Indian mobile number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ""))) {
      setFormError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsSubmitting(true);

    const refCode = `AC-REQ-${Math.floor(100000 + Math.random() * 900000)}`;

    const payload = {
      name: formData.name,
      roll_no: formData.roll_no,
      phone: formData.phone,
      course_branch: formData.course_branch,
      academic_year: parseInt(formData.academic_year, 10),
      accommodation: formData.accommodation,
      preferred_date: formData.preferred_date || null,
      group_size: formData.group_size || null,
      purpose: formData.purpose || null,
    };

    try {
      const { error } = await supabase
        .from("session_requests")
        .insert([payload]);
      
      if (error) throw error;
      
      setReferenceId(refCode);
      setIsSuccess(true);
      setFormData(EMPTY_FORM);
    } catch (error: unknown) {
      setFormError(
        error instanceof Error ? error.message : "An unexpected database error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background stars */}
      <StarfieldCanvas />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-10 group"
        >
          <span className="transition-transform group-hover:-translate-x-1" aria-hidden>←</span> Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <div className="text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase mb-2">
            Observation Operations
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
            Request an Observation Session
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Submit your telemetry credentials below to book a guided stargazing session at the
            club observatory. We will coordinate schedule windows and contact you directly.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-6 md:p-8 backdrop-blur-md shadow-xl">
          {/* Honeypot anti-spam field */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
          />

          {/* Success screen */}
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Request Lodged</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 font-medium">
                Your stargazing request has been verified and registered. The AstroClub council will reach out to you shortly via WhatsApp.
              </p>
              <div className="bg-slate-905/60 border border-slate-800 rounded-xl p-4 inline-block mb-8">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Receipt Reference</span>
                <span className="text-base font-mono font-bold text-cyan-400 tracking-wider">{referenceId}</span>
              </div>
              <div>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="rounded-lg bg-slate-905 border border-slate-800 hover:bg-slate-800 text-sm font-semibold text-white px-6 py-2.5 transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <>
              {formError && (
                <div className="mb-6 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                  {formError}
                </div>
              )}

              <form id="session-request-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Basic Details Sub-header */}
                <div className="border-b border-slate-900 pb-2">
                  <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">1. Personal Credentials</h3>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="req-name" className="text-xs font-medium text-slate-400">
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
                    className="rounded-lg border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition"
                  />
                </div>

                {/* Academic credentials side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Roll No */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="req-roll" className="text-xs font-medium text-slate-400">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      id="req-roll"
                      name="roll_no"
                      required
                      value={formData.roll_no}
                      onChange={handleInputChange}
                      placeholder="e.g. 2023UCS101"
                      className="rounded-lg border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Course / Branch */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="req-branch" className="text-xs font-medium text-slate-400">
                      Course & Branch
                    </label>
                    <input
                      type="text"
                      id="req-branch"
                      name="course_branch"
                      required
                      value={formData.course_branch}
                      onChange={handleInputChange}
                      placeholder="e.g. B.Tech CSE"
                      className="rounded-lg border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* WhatsApp & Academic Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* WhatsApp Number */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="req-phone" className="text-xs font-medium text-slate-400">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      id="req-phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile"
                      className="rounded-lg border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Academic Year */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="req-year" className="text-xs font-medium text-slate-400">
                      Academic Year
                    </label>
                    <select
                      id="req-year"
                      name="academic_year"
                      required
                      value={formData.academic_year}
                      onChange={handleInputChange}
                      className="rounded-lg border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition"
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
                    <label htmlFor="req-accom" className="text-xs font-medium text-slate-400">
                      Accommodation
                    </label>
                    <select
                      id="req-accom"
                      name="accommodation"
                      required
                      value={formData.accommodation}
                      onChange={handleInputChange}
                      className="rounded-lg border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition"
                    >
                      <option value="" disabled>Select Type</option>
                      <option value="hosteler">Hosteler</option>
                      <option value="day_scholar">Day Scholar</option>
                    </select>
                  </div>
                </div>

                {/* Session Specifications Sub-header */}
                <div className="border-b border-slate-900 pb-2 mt-2">
                  <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">2. Session Target Specs</h3>
                </div>

                {/* Preferred Date & Group Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Preferred Date */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="req-date" className="text-xs font-medium text-slate-400">
                      Preferred Date & Window
                    </label>
                    <input
                      type="text"
                      id="req-date"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleInputChange}
                      placeholder="e.g. Next Friday evening, 8 PM"
                      className="rounded-lg border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Group Size */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="req-size" className="text-xs font-medium text-slate-400">
                      Observation Group Size
                    </label>
                    <select
                      id="req-size"
                      name="group_size"
                      value={formData.group_size}
                      onChange={handleInputChange}
                      className="rounded-lg border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition"
                    >
                      <option value="">Select Group Size (Optional)</option>
                      <option value="Solo (1)">Solo (Just Me)</option>
                      <option value="Duo / Trio (2-3)">Small Group (2-3 people)</option>
                      <option value="Group (4-8)">Medium Group (4-8 people)</option>
                      <option value="Class / Large (8+)">Large Batch (8+ people)</option>
                    </select>
                  </div>
                </div>

                {/* Purpose of Visit */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="req-purpose" className="text-xs font-medium text-slate-400">
                    Observation Focus / Purpose of Visit
                  </label>
                  <textarea
                    id="req-purpose"
                    name="purpose"
                    rows={3}
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="e.g. Lunar crater analysis, astrophotography, or simple constellation scouting..."
                    className="rounded-lg border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  id="submit-request-btn"
                  disabled={isSubmitting}
                  className="mt-4 w-full rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-white/5"
                >
                  {isSubmitting ? "Lodging Telemetry..." : "File Observation Request"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Step-by-Step Flow "What Happens Next" */}
        <div className="mt-12 text-center">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-8">
            Observation Request Flow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative text-left">
            {/* Step 1 */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/30 p-5 relative">
              <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded">
                STAGE 01
              </div>
              <h4 className="text-sm font-semibold text-white mt-2 mb-1.5">File telemetry details</h4>
              <p className="text-xs text-slate-550 leading-relaxed">
                Provide academic credentials, contact route, and desired observational targets.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/30 p-5 relative">
              <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded">
                STAGE 02
              </div>
              <h4 className="text-sm font-semibold text-white mt-2 mb-1.5">Council evaluation</h4>
              <p className="text-xs text-slate-550 leading-relaxed">
                The AstroClub leadership checks scheduled slots and weather profiles for optimal viewing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/30 p-5 relative">
              <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded">
                STAGE 03
              </div>
              <h4 className="text-sm font-semibold text-white mt-2 mb-1.5">Observation active</h4>
              <p className="text-xs text-slate-550 leading-relaxed">
                Receive coordinates and confirmation key directly on WhatsApp to access the dome.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
