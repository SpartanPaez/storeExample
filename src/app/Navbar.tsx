

"use client";
import Link from "next/link";
import { useCart } from "./CartContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLogged(!!localStorage.getItem("token"));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("customerId");
    window.location.href = "/";
  }

  return (
    <nav className="relative bg-gradient-to-r from-gray-950 via-blue-950 to-cyan-900/80 border-b border-blue-900/40 py-4 px-8 flex justify-between items-center shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-blue-800 shadow-lg animate-pulse" />
        <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent drop-shadow-lg tracking-tight">Spartan Store</span>
      </div>
      <ul className="flex gap-8 text-blue-100 font-medium">
        <li>
          <Link href="/" className="hover:text-cyan-300 transition font-semibold">Catálogo</Link>
        </li>
        <li className="relative">
          <Link href="/cart" className="hover:text-cyan-300 transition font-semibold flex items-center gap-1">
            Carrito
            {totalItems > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-gradient-to-r from-cyan-500 to-blue-700 rounded-full shadow ring-2 ring-cyan-300/40 animate-bounce">
                {totalItems}
              </span>
            )}
          </Link>
        </li>
        {!isLogged ? (
          <li>
            <Link href="/auth/login" className="hover:text-cyan-300 transition font-semibold">Ingresar</Link>
          </li>
        ) : (
          <li>
            <button onClick={handleLogout} className="hover:text-cyan-300 transition font-semibold bg-transparent border-none cursor-pointer">Salir</button>
          </li>
        )}
      </ul>
    </nav>
  );
}
