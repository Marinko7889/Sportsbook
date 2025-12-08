"use client";

import Link from "next/link";

export default function CompetitionLink({ competition }) {
  return (
    <Link
      href={`/competition/${competition.id}`}
      className="text-blue-600 hover:underline text-xl block my-5"
    >
      {competition.name}
    </Link>
  );
}
