/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRegisterUserMutation } from "@/redux/featured/auth/authApi";
import { getSession, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/featured/auth/authSlice";

export function useAuthHandlers() {
  const dispatch = useAppDispatch();
  const [registerUser] = useRegisterUserMutation();

  const handleRegister = async (data: {
    name?: string;
    email: string;
    password: string;
  }) => {
    try {
      const res = await registerUser(data).unwrap();
      toast.success("Registration successful!");
    } catch (err: any) {
      console.error("Registration failed:", err);
      throw new Error(err?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.error) {
      console.error(res.error);
      throw new Error("Invalid credentials");
    }

    const session = await getSession();
    if (session?.user) {
      dispatch(setUser(session.user));
      toast.success("Login successful");
    } else {
      toast.error("Login failed — no session found");
    }
  };

  return { handleRegister, handleLogin };
}
