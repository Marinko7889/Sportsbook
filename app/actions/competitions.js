"use server";
import { revalidateTag } from "next/cache";
import { getHeaders } from "./headers";

const BASE_URL = process.env.BASE_URL;

export async function fetchCompetitions() {
  const headers = await getHeaders();

  const res = await fetch(`${BASE_URL}/competitions`, {
    headers,
    next: { revalidate: 3600, tags: ["competitions"] },
    cache: "force-cache",
  });

  if (!res.ok) throw new Error("Failed to fetch competitions");
  return res.json();
}

export async function addCompetition(name) {
  if (!name || !name.trim()) throw new Error("Name required");
  const headers = await getHeaders();

  const res = await fetch(`${BASE_URL}/competitions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Failed to add competition");

  revalidateTag("competitions");
}
export async function updateCompetition({ id, name, rowVersion }) {
  if (!id || !name || !rowVersion) {
    return { ok: false, status: 400, message: "Missing fields" };
  }

  const headers = await getHeaders();

  const res = await fetch(`${BASE_URL}/competitions/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ name, rowVersion }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return { ok: false, status: res.status, message: data?.message || "Error" };
  }

  revalidateTag("competitions");
  return { ok: true, data };
}

export async function deleteCompetition(id) {
  if (!id) throw new Error("ID required");

  const headers = await getHeaders();

  const res = await fetch(`${BASE_URL}/competitions/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) throw new Error("Failed to delete competition");

  revalidateTag("competitions");
}
