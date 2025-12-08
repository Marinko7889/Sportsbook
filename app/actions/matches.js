"use server";
import { revalidateTag } from "next/cache";
import { getHeaders } from "./headers";
const BASE_URL = process.env.BASE_URL;

export async function addMatch(newMatch) {
  try {
    const headers = await getHeaders();

    const res = await fetch(`${BASE_URL}/matches`, {
      method: "POST",
      headers,
      body: JSON.stringify(newMatch),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Add match error:", errorText);
      return {
        ok: false,
        error: `Failed to add match: ${res.status} ${errorText}`,
        status: res.status,
      };
    }

    revalidateTag("matches");
    const data = await res.json();
    return { ok: true, data };
  } catch (error) {
    console.error("Add match exception:", error);
    return {
      ok: false,
      error: error.message || "Network error occurred",
      status: 500,
    };
  }
}

export async function deleteMatch(matchId) {
  try {
    const headers = await getHeaders();

    const res = await fetch(`${BASE_URL}/matches/${matchId}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Delete match error:", errorText);
      return {
        ok: false,
        error: `Failed to delete match: ${res.status} ${errorText}`,
        status: res.status,
      };
    }

    revalidateTag("matches");
    return { ok: true };
  } catch (error) {
    console.error("Delete match exception:", error);
    return {
      ok: false,
      error: error.message || "Network error occurred",
      status: 500,
    };
  }
}

export async function fetchMatches(page = 1, competitionId = null) {
  const headers = await getHeaders();
  let url = `${process.env.BASE_URL}/matches?page=${page}`;
  if (competitionId) url += `&competitionId=${competitionId}`;

  try {
    const res = await fetch(url, {
      headers,
      method: "GET",
      cache: "force-cache",
      next: { revalidate: 60 * 5, tags: ["matches"] },
    });

    if (!res.ok) {
      console.error("Failed to fetch matches:", res.status);
      return { matches: [], page: 1, totalDays: 0, day: null };
    }

    const data = await res.json();
    return {
      matches: data.matches || [],
      page: data.page || 1,
      totalDays: data.totalDays || 1,
      day: data.day || null,
    };
  } catch (err) {
    console.error("Error fetching matches:", err);
    return { matches: [], page: 1, totalDays: 0, day: null };
  }
}
export async function fetchAllMatches() {
  const headers = await getHeaders();
  const url = `${process.env.BASE_URL}/matches/all`;

  const res = await fetch(url, { headers });

  if (!res.ok) return [];

  return await res.json();
}
