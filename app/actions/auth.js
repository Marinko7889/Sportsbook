"use server";

import { cookies } from "next/headers";

export async function loginUser(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const res = await fetch(`${process.env.BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Login failed");
  }

  const cookieStore = await cookies();
  cookieStore.set("jwtToken", data.token, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 12,
    path: "/",
  });

  return data;
}
export async function registerUser(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const res = await fetch(`${process.env.BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Registration failed");
  }

  return data;
}

export async function logoutUser() {
  const res = await fetch(`${process.env.BASE_URL}/auth/logout`, {
    method: "POST",
  });
  const cookieStore = await cookies();
  cookieStore.delete("jwtToken");

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  return true;
}

export async function getCurrentUser() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/auth/me`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    return null;
  }
}
