"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { locale, setLocale } = useLocale();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5072/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data || "Registration failed");
        return;
      }

      setSuccess("Registered successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {t("Register", locale)}
        </h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700"
        >
          {t("Register", locale)}
        </button>
        <button
          onClick={() => router.push("/login")}
          className="bg-white-600 text-green w-full p-2 rounded hover:bg-white-700 mt-2"
        >
          {t("Login", locale)}
        </button>
        <div className="flex gap-2 mt-4 justify-center">
          <button type="button" onClick={() => setLocale("en")}>
            EN
          </button>
          <button type="button" onClick={() => setLocale("hr")}>
            HR
          </button>
        </div>
      </form>
    </div>
  );
}
