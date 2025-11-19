"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
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

export async function fetchMatches(competitionName) {
  try {
    const headers = await getHeaders();

    const res = await fetch(`${BASE_URL}/matches`, {
      headers,
      next: {
        revalidate: 3600,
        tags: ["matches"],
      },
      cache: "force-cache",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch matches: ${res.status}`);
    }

    const data = await res.json();

    const filtered = data.filter(
      (m) => m.competition?.toLowerCase() === competitionName?.toLowerCase()
    );

    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    return filtered;
  } catch (error) {
    console.error("Fetch matches error:", error);
    return [];
  }
}
