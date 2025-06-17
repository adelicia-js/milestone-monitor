"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.webp";
import { Urbanist } from "next/font/google";
import "../../globals.css";
import { useAuth } from '@/lib/hooks/useAuth';

const generalText = Urbanist({
  weight: "500",
  subsets: ["latin"],
});

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isLoading } = useAuth();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signUp(email, password);
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  return (
    <div
      className={`${generalText.className} flex-1 flex flex-col justify-center gap-2 bg-cover h-screen w-screen py-16 px-96 bg-[#3b9b9b]`}
    >
      <div className="bg-150%  bg-center bg-[url('../public/login-bg.svg')] h-full flex justify-center items-center">
        <div className="flex flex-col">
          <Image
            src={logo}
            width={150}
            height={150}
            alt={"logo"}
            className="self-center"
          />
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-r-2 border-b-2 border-teal-700">🚀</div>
              <p className="text-teal-700 text-lg">Signing you up . . .</p>
            </div>
          ) : (
            <form
              className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
              onSubmit={handleSignUp}
            >
              <label
                className="text-md text-emerald-800 uppercase"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="caret-emerald-700 rounded-md px-4 py-2 bg-inherit mb-6 border-2 border-teal-400/20 focus:border-emerald-500"
                style={{ color: "#237A70" }}
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <label
                className="text-md text-emerald-800 uppercase"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="caret-emerald-700 rounded-md px-4 py-2 bg-inherit mb-6 border-2 border-teal-400/20 focus:border-emerald-500 w-full"
                  style={{ color: "#237A70" }}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/3 -translate-y-1/2 text-emerald-800"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              <div className="flex flex-col items-center justify-center">
                <button
                  className="bg-teal-700 text-center w-[10vw] rounded-full px-4 py-2 text-emerald-200 hover:bg-teal-500 uppercase tracking-wide hover:shadow-md hover:shadow-teal-300/50 hover:text-cyan-100"
                  disabled={isLoading}
                >
                  Sign Up
                </button>
                {!isLoading && (
                  <Link
                    href="/login"
                    className="text-center py-2 text-teal-700 hover:shadow-cyan-100/50 hover:text-teal-500 hover:underline hover:underline-offset-2 hover:cursor-pointer"
                  >
                    Already Registered? Sign In!
                  </Link>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
