"use client";
import { useEffect, useState, Suspense } from "react";

type Shoe = {
  id: number;
  model: string;
  brand: string;
  price: number;
  stock: number;
  season: string;
};
import { useSearchParams } from "next/navigation";
import { useCart } from "./CartContext";
import { API_BASE_URL } from "./apiConfig";


export default function Home() {
  return (
    <Suspense fallback={<div className="text-center text-gray-300 py-12">Cargando...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { addToCart } = useCart();
  const [showNotif, setShowNotif] = useState(false);
  const [notifText, setNotifText] = useState("");
  const [notifType, setNotifType] = useState<"success"|"error"|null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/shoes`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setShoes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Mostrar notificación si viene mensaje por query param
  useEffect(() => {
    const mensaje = searchParams.get("mensaje");
    const tipo = searchParams.get("tipo");
    if (mensaje) {
      setNotifText(decodeURIComponent(mensaje));
      setNotifType(tipo === "success" ? "success" : "error");
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
    }
  }, [searchParams]);

  function formatPYG(value: number) {
    return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(value);
  }

  function handleAddToCart(shoe: Shoe) {
    addToCart({ id: shoe.id, name: shoe.model, brand: shoe.brand, price: shoe.price, quantity: 1 });
    setNotifText(`¡${shoe.model} agregado al carrito!`);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 1800);
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-2 sm:py-10 sm:px-4 relative">
      {/* Notificación flotante */}
      {showNotif && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-xl shadow-2xl ring-2 animate-fade-in-out ${notifType === "success" ? "bg-gradient-to-r from-green-500 via-emerald-600 to-green-800 text-white ring-green-300/40" : "bg-gradient-to-r from-red-500 via-pink-600 to-pink-800 text-white ring-pink-300/40"}`}>
          {notifType === "success" ? (
            <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          <span className="font-semibold">{notifText}</span>
        </div>
      )}
      <h1 className="text-4xl font-bold mb-8 text-gray-100 text-center">Catálogo de Zapatos</h1>
      {loading ? (
        <div className="text-gray-400 text-center">Cargando productos...</div>
      ) : error ? (
        <div className="text-red-400 text-center">Error: {error}</div>
      ) : shoes.length === 0 ? (
        <div className="text-gray-400 text-center">No hay zapatos disponibles.</div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {shoes.map((shoe) => (
            <div key={shoe.id} className="bg-gray-900 rounded-lg shadow-lg p-4 sm:p-6 flex flex-col items-center w-full max-w-xs mx-auto">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-800 rounded mb-3 flex items-center justify-center">
                {/* Imagen placeholder */}
                <span className="text-6xl text-gray-700">👟</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-1 sm:mb-2 text-center break-words">{shoe.model}</h2>
              <p className="text-gray-400 mb-1 sm:mb-2 text-xs sm:text-sm">Marca: {shoe.brand}</p>
              <p className="text-gray-400 mb-1 sm:mb-2 text-xs sm:text-sm">Temporada: {shoe.season}</p>
              <p className="text-gray-400 mb-1 sm:mb-2 text-xs sm:text-sm">Stock: {shoe.stock}</p>
              <p className="text-gray-200 font-bold mb-2 sm:mb-4 text-base sm:text-lg">{formatPYG(shoe.price)}</p>
              <button
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-800 hover:from-cyan-400 hover:to-blue-700 text-white font-semibold py-2 px-2 sm:px-6 rounded shadow-lg transition-all duration-200 active:scale-95 ring-2 ring-cyan-300/40 text-sm sm:text-base"
                onClick={() => handleAddToCart(shoe)}
                disabled={shoe.stock < 1}
              >
                {shoe.stock > 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Agregar al carrito
                  </span>
                ) : "Sin stock"}
              </button>
      {/* Animación fade-in-out */}
      <style jsx>{`
        .animate-fade-in-out {
          animation: fadeInOut 1.8s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-16px) scale(0.95); }
          10% { opacity: 1; transform: none; }
          90% { opacity: 1; transform: none; }
          100% { opacity: 0; transform: translateY(-16px) scale(0.95); }
        }
      `}</style>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
