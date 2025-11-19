"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getHeaders } from "./headers";

export async function addTeam(name) {
  if (!name || !name.trim()) throw new Error("Team name is required");

  const headers = await getHeaders();

  const res = await fetch(`${process.env.BASE_URL}/teams`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name }),
  });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("Failed to add team:", res.status);
    throw new Error(`Failed to add team`);
  }

  revalidateTag("teams");
  return data;
}
export async function deleteTeam({ id }) {
  if (!id) throw new Error("Team ID is required");

  const teamId = parseInt(id);
  if (isNaN(teamId)) throw new Error("Invalid team ID");

  const headers = await getHeaders();

  const res = await fetch(`${process.env.BASE_URL}/teams/${teamId}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.message || "Failed to delete team");
  }

  revalidateTag("teams");
}

export async function fetchTeams() {
  const headers = await getHeaders();

  const res = await fetch(`${process.env.BASE_URL}/teams`, {
    headers,
    next: {
      revalidate: 3600,
      tags: ["teams"],
    },
    cache: "force-cache",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to fetch teams:", res.status, text);
    return [];
  }

  return res.json();
}
