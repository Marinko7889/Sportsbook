"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "../actions/auth";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";

export default function AuthForm({ mode = "login" }) {
  const router = useRouter();
  const { locale, setLocale } = useLocale();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      if (mode === "register") {
        formData.append("name", name);
      }
      formData.append("email", email);
      formData.append("password", password);

      if (mode === "login") {
        await loginUser(formData);
        router.push("/competition");
      } else {
        await registerUser(formData);
        setSuccess("Registered successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 500);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const switchMode = () => {
    router.push(mode === "login" ? "/register" : "/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? t("Login", locale) : t("Register", locale)}
        </h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        {mode === "register" && (
          <input
            type="text"
            placeholder={t("Name", locale)}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full mb-3"
            required
          />
        )}

        <input
          type="email"
          placeholder={t("Email", locale)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <input
          type="password"
          placeholder={t("Password", locale)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />

        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${
            mode === "login"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {mode === "login" ? t("Login", locale) : t("Register", locale)}
        </button>

        <button
          type="button"
          onClick={switchMode}
          className="w-full p-2 mt-2 rounded border text-center"
        >
          {mode === "login" ? t("Register", locale) : t("Login", locale)}
        </button>

        <div className="flex gap-2 mt-4 justify-center">
          <button type="button" onClick={() => setLocale("en")}>
            EN
          </button>
          <button type="button" onClick={() => setLocale("hr")}>
            HR
          </button>
          <button type="button" onClick={() => setLocale("es")}>
            ES
          </button>
        </div>
      </form>
    </div>
  );
}
