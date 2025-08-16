"use client";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../apiConfig";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Guardar la ruta previa para redirigir después del login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prev = document.referrer;
      if (prev && prev.includes("/cart")) {
        localStorage.setItem("redirectAfterLogin", "/cart");
      }
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/Customers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Credenciales incorrectas");
      // Suponiendo que el backend ahora devuelve { token, customerId }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("customerId", data.customerId);
      // Redirigir a donde corresponde
      const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 relative overflow-hidden">
      {/* Glassmorphism y brillos sutiles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-blue-900/10 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-cyan-400/10 via-blue-400/10 to-blue-900/20 rounded-full blur-2xl animate-blob z-0" />
      <form onSubmit={handleSubmit} className="relative bg-white/10 bg-clip-padding p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-8 border border-blue-700/30 backdrop-blur-[18px] ring-2 ring-blue-500/20 before:absolute before:inset-0 before:rounded-3xl before:bg-white/10 before:backdrop-blur-[20px] before:pointer-events-none before:z-10">
        <div className="flex flex-col items-center mb-2 z-20">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-tr from-cyan-400/40 to-blue-400/30 rounded-full blur-lg animate-pulse" />
            <div className="bg-gradient-to-tr from-blue-500 via-cyan-400 to-blue-700 rounded-full p-3 mb-3 shadow-2xl animate-pulse border-2 border-white/20">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#e0f2fe"/><ellipse cx="12" cy="18" rx="8" ry="4" fill="#bae6fd"/></svg>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-center text-white tracking-tight drop-shadow-lg">Bienvenido</h1>
          <p className="text-blue-200 text-center text-base mt-1 font-medium animate-fade-in">Inicia sesión para continuar</p>
        </div>
        <br />
        <div className="flex flex-col gap-6 mt-2 mb-2 w-full">
          <input
            type="email"
            required
            placeholder="Email"
            className="bg-blue-900/40 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-blue-900/60 transition shadow-inner border border-blue-700/40 hover:border-cyan-400/60 hover:scale-[1.03] duration-200 z-20"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            type="password"
            required
            placeholder="Contraseña"
            className="bg-blue-900/40 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-blue-900/60 transition shadow-inner border border-blue-700/40 hover:border-cyan-400/60 hover:scale-[1.03] duration-200 z-20"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
        </div>
        <div className="flex justify-center w-full">
          <button disabled={loading} className="bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-700 hover:from-cyan-500 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-xl shadow-xl transition-all duration-200 active:scale-95 ring-2 ring-cyan-200/40 border border-white/10 backdrop-blur-lg animate-glow z-20">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-cyan-100 border-t-transparent rounded-full animate-spin"></span>
                Ingresando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-100 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Entrar
              </span>
            )}
          </button>
        </div>
        <br />
        <p className="text-blue-200 text-center text-sm z-20">
          ¿No tienes cuenta?{' '}
          <a href="/auth/register" className="text-cyan-300 hover:text-cyan-400 hover:underline font-semibold transition animate-glow">Regístrate</a>
        </p>
        {error && <div className="text-red-400 text-center font-semibold drop-shadow-lg animate-pulse z-20">{error}</div>}
      {/* Efectos animados extra para glassmorphism y glow */}
      <style jsx>{`
        .animate-glow {
          box-shadow: 0 0 16px 2px #a21caf44, 0 0 32px 4px #22d3ee33;
          animation: glow 2.5s ease-in-out infinite alternate;
        }
        @keyframes glow {
          0% { box-shadow: 0 0 16px 2px #a21caf44, 0 0 32px 4px #22d3ee33; }
          100% { box-shadow: 0 0 32px 8px #a21caf88, 0 0 48px 12px #22d3ee66; }
        }
        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 3s ease-in-out infinite alternate;
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .animate-blob {
          animation: blob 8s infinite alternate cubic-bezier(.77,0,.18,1);
        }
        @keyframes blob {
          0% { transform: scale(1) translate(0,0); }
          100% { transform: scale(1.2) translate(30px, 20px); }
        }
      `}</style>
      </form>
    </div>
  );
}
