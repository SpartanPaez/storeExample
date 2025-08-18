"use client";
import { useState } from "react";
import { API_BASE_URL } from "../../apiConfig";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/Customers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al registrar");
      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-gray-100">Registro</h1>
        <input
          type="text"
          required
          placeholder="Nombre"
          className="bg-gray-800 text-gray-100 rounded px-4 py-2"
          value={form.firstName}
          onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
        />
        <input
          type="text"
          required
          placeholder="Apellido"
          className="bg-gray-800 text-gray-100 rounded px-4 py-2"
          value={form.lastName}
          onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
        />
        <input
          type="email"
          required
          placeholder="Email"
          className="bg-gray-800 text-gray-100 rounded px-4 py-2"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <input
          type="text"
          required
          placeholder="Teléfono"
          className="bg-gray-800 text-gray-100 rounded px-4 py-2"
          value={form.phoneNumber}
          onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
        />
        <input
          type="password"
          required
          placeholder="Contraseña"
          className="bg-gray-800 text-gray-100 rounded px-4 py-2"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        />
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition">
          {loading ? "Registrando..." : "Registrarse"}
        </button>
        <p className="text-gray-400 text-center">
          ¿Ya tienes cuenta?{' '}
          <a href="/auth/login" className="text-blue-400 hover:underline">Inicia sesión</a>
        </p>
        {error && <div className="text-red-400 text-center">{error}</div>}
        {success && <div className="text-green-400 text-center">{success}</div>}
      </form>
    </div>
  );
}
