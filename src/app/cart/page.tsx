"use client";
import { useCart } from "../CartContext";
import { useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, clearCart, removeFromCart, addToCart } = useCart();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();



  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formatPYG = (value: number) => new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(value);

  function validateForm() {
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/.test(form.firstName)) {
      setError("El nombre solo debe contener letras y tener al menos 2 caracteres.");
      return false;
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/.test(form.lastName)) {
      setError("El apellido solo debe contener letras y tener al menos 2 caracteres.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("El email no es válido.");
      return false;
    }
    if (!/^\d{7,}$/.test(form.phoneNumber)) {
      setError("El teléfono debe contener solo números y al menos 7 dígitos.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Obtener el customerId del localStorage
      const customerId = localStorage.getItem("customerId");
      if (!customerId) throw new Error("No se encontró el cliente logueado. Por favor, vuelve a iniciar sesión.");

      // 1. Crear el pedido
      const orderRes = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });
      if (!orderRes.ok) throw new Error("Error creando pedido");
      const order = await orderRes.json();

      // 2. Crear los items del pedido (uno por cada producto en el carrito)
      for (const item of cart) {
        const orderItemRes = await fetch(`${API_BASE_URL}/api/orderitems`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id, productId: item.id, quantity: item.quantity, price: item.price }),
        });
        if (!orderItemRes.ok) throw new Error(`Error creando item de pedido para ${item.name}`);
      }

      // 3. Generar el link de pago AdamsPay para el total del carrito
      const now = new Date();
      const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 días de validez
      const paymentBody = {
        reference: `pedido-${order.id}`,
        amount: {
          currency: "PYG",
          value: total
        },
        description: `Compra de ${cart.length} producto(s)`,
        callbackUrl: window.location.origin + "/api/payments/adamspay/callback",
        validPeriod: {
          start: now.toISOString(),
          end: end.toISOString()
        }
      };
      const res = await fetch(`${API_BASE_URL}/api/payments/adamspay/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentBody),
      });
      if (!res.ok) throw new Error("No se pudo generar el link de pago");
      const data = await res.json();
      if (!data.url) throw new Error("Respuesta inesperada de AdamsPay");
      // Redirigir al usuario al link de pago
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return <div className="max-w-xl mx-auto py-16 text-center text-gray-400">No hay productos en el carrito.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-100 text-center">Confirmar compra</h1>
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 mb-8 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-blue-200 border-b border-blue-900/40">
              <th className="py-2">Producto</th>
              <th className="py-2">Marca</th>
              <th className="py-2 text-center">Cantidad</th>
              <th className="py-2 text-center">Precio</th>
              <th className="py-2 text-center">Subtotal</th>
              <th className="py-2 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id} className="border-b border-gray-800 last:border-0">
                <td className="py-2 font-semibold text-gray-100">{item.name}</td>
                <td className="py-2 text-gray-400">{item.brand}</td>
                <td className="py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button type="button" className="bg-blue-800 hover:bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold" onClick={() => addToCart({ ...item, quantity: 1 })}>+</button>
                    <span className="px-2 text-blue-200 font-bold">{item.quantity}</span>
                    <button type="button" className="bg-blue-800 hover:bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold" onClick={() => removeFromCart(item.id)}>-</button>
                  </div>
                </td>
                <td className="py-2 text-center text-blue-100">{formatPYG(item.price)}</td>
                <td className="py-2 text-center text-blue-100 font-bold">{formatPYG(item.price * item.quantity)}</td>
                <td className="py-2 text-center">
                  <button type="button" className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded px-3 py-1 font-semibold shadow transition" onClick={() => removeFromCart(item.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <span className="text-xl text-blue-200 font-bold">Total: {formatPYG(total)}</span>
        </div>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input required type="text" placeholder="Nombre" className="bg-gray-800 text-gray-100 rounded px-4 py-2" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
        <input required type="text" placeholder="Apellido" className="bg-gray-800 text-gray-100 rounded px-4 py-2" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
        <input required type="email" placeholder="Email" className="bg-gray-800 text-gray-100 rounded px-4 py-2" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        <input required type="text" placeholder="Teléfono" className="bg-gray-800 text-gray-100 rounded px-4 py-2" value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))} />
        <button disabled={loading} className="bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-800 hover:from-cyan-400 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-xl transition-all duration-200 active:scale-95 ring-2 ring-cyan-300/40 mt-4">
          {loading ? "Procesando..." : "Finalizar compra"}
        </button>
      </form>
      {error && <div className="text-red-400 mt-4 text-center">{error}</div>}
      {success && <div className="text-green-400 mt-4 text-center">{success}</div>}
    </div>
  );
}
