"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "../lib/i18n";
// import { LocaleProvider } from "../context/LocaleContext";
import { useLocale } from "../context/LocaleContext";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { locale, setLocale } = useLocale();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5072/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      //console.log("Hajduk");
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Login failed");
        console.log("Eroro neki");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userId", data.userId);

      router.push("/competition"); // redirect nakon login-a
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  const register = () => {
    router.push("/register");
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {t("Login", locale)}
        </h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

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
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          {t("Login", locale)}
        </button>
        <button
          onClick={register}
          className="bg-white text-blue w-full p-2 rounded mt-2"
        >
          {t("Register", locale)}
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
