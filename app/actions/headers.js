"use server";
import { cookies } from "next/headers";

export async function getHeaders(additional = {}) {
  const cookieStore = await cookies();
  const jwtCookie = cookieStore.get("jwtToken");

  const headers = {
    "Content-Type": "application/json",
    ...additional,
  };

  if (jwtCookie) {
    headers["Authorization"] = `Bearer ${jwtCookie.value}`;
  }

  return headers;
}
