"use server";
import { revalidateTag } from "next/cache";
import { getHeaders } from "./headers";

export async function addTeam(name, competitionIds = []) {
  if (!name || !name.trim()) throw new Error("Team name is required");

  const headers = await getHeaders();

  const res = await fetch(`${process.env.BASE_URL}/teams`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: name.trim(),
      //competitions: competitionIds.map((id) => ({ ID: id })),
    }),
  });
  const responseClone = res.clone();

  let responseData;
  try {
    responseData = await res.json();
  } catch {
    try {
      responseData = await responseClone.json();
    } catch {
      responseData = null;
    }
  }

  if (!res.ok) {
    const errorMessage =
      responseData?.message ||
      `Failed to add team to competition (${res.status})`;
    throw new Error(errorMessage);
  }
  revalidateTag("teams");

  return responseData;
  //return data;
}

export async function updateTeam(id, name, competitionIds = []) {
  if (!id) throw new Error("Team ID is required");
  if (!name || !name.trim()) throw new Error("Team name is required");

  const headers = await getHeaders();

  const res = await fetch(`${process.env.BASE_URL}/teams/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      name,
      competitions: competitionIds.map((id) => ({ id })),
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("Failed to update team:", res.status);
    throw new Error(data?.message || "Failed to update team");
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
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Failed to delete team");
  }

  revalidateTag("teams");
}

export async function fetchTeams(
  page = 1,
  pageSize = 20,
  competitionId = null
) {
  const headers = await getHeaders();

  let url = `${process.env.BASE_URL}/teams?page=${page}&pageSize=${pageSize}`;
  if (competitionId) {
    url += `&competitionId=${competitionId}`;
  }

  const res = await fetch(url, {
    headers,
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 60 * 5, tags: ["teams"] },
  });

  if (!res.ok) {
    console.error("Failed to fetch teams:", res.status);
    return { data: [], page, pageSize, total: 0, totalPages: 0 };
  }

  return res.json();
}

export async function fetchTeamById(id) {
  if (!id) throw new Error("Team ID is required");

  const headers = await getHeaders();

  const res = await fetch(`${process.env.BASE_URL}/teams/${id}`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed to fetch team ${id}:`, res.status, text);
    return null;
  }

  return res.json();
}

export async function searchTeamsServer(query) {
  if (!query || query.trim().length < 2) return [];

  const headers = await getHeaders();

  const res = await fetch(
    `${process.env.BASE_URL}/teams/search?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Search error:", res.status);
    return [];
  }

  return res.json();
}

export async function addTeamToCompetition(teamId, competitionId) {
  const headers = await getHeaders();

  const res = await fetch(
    `${process.env.BASE_URL}/teams/${teamId}/competitions/${competitionId}`,
    {
      method: "POST",
      headers,
    }
  );

  const responseClone = res.clone();

  let responseData;
  try {
    responseData = await res.json();
  } catch {
    try {
      responseData = await responseClone.json();
    } catch {
      responseData = null;
    }
  }

  if (!res.ok) {
    const errorMessage =
      responseData?.message ||
      `Failed to add team to competition (${res.status})`;
    throw new Error(errorMessage);
  }

  return responseData;
}

export async function removeTeamFromCompetition(teamId, competitionId) {
  const headers = await getHeaders();

  const res = await fetch(
    `${process.env.BASE_URL}/teams/${teamId}/competitions/${competitionId}`,
    {
      method: "DELETE",
      headers,
    }
  );

  const responseClone = res.clone();

  let responseData;
  try {
    responseData = await res.json();
  } catch {
    try {
      responseData = await responseClone.json();
    } catch {
      responseData = null;
    }
  }

  if (!res.ok) {
    const errorMessage =
      responseData?.message ||
      `Failed to add Remove from competition (${res.status})`;
    throw new Error(errorMessage);
  }

  return responseData;
}
