

"use client";
import Link from "next/link";
import { useCart } from "./CartContext";
import { useEffect, useState } from "react";
export default function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isLogged, setIsLogged] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  function handleMenuToggle() {
    setMenuOpen((open) => !open);
  }

  function handleMenuClose() {
    setMenuOpen(false);
  }

  return (
    <nav className="relative bg-gradient-to-r from-gray-950 via-blue-950 to-cyan-900/80 border-b border-blue-900/40 py-2 px-2 sm:py-4 sm:px-8 flex flex-wrap justify-between items-center shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="inline-block w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-blue-800 shadow-lg animate-pulse" />
        <span className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent drop-shadow-lg tracking-tight">Spartan Store</span>
      </div>
      {/* Botón hamburguesa */}
      <button
        className="sm:hidden flex items-center cursor-pointer ml-auto mr-2 z-50"
        aria-label="Abrir menú"
        onClick={handleMenuToggle}
      >
        <svg className="w-7 h-7 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {/* Overlay para cerrar menú */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={handleMenuClose} />
      )}
      <ul
        className={`flex-col sm:flex-row gap-2 sm:gap-8 text-blue-100 font-medium w-full sm:w-auto sm:static absolute left-0 right-0 top-full bg-gradient-to-r from-gray-950 via-blue-950 to-cyan-900/95 sm:bg-none z-50 transition-all duration-200 ease-in-out p-4 sm:p-0 rounded-b-xl sm:rounded-none shadow-lg sm:shadow-none ${menuOpen ? 'flex max-h-96' : 'hidden max-h-0'} sm:flex sm:max-h-none`}
        style={{ overflow: menuOpen ? 'visible' : 'hidden' }}
        onClick={handleMenuClose}
      >
        <li>
          <Link href="/" className="block py-2 px-2 sm:p-0 hover:text-cyan-300 transition font-semibold">Catálogo</Link>
        </li>
        <li className="relative">
          <Link href="/cart" className="py-2 px-2 sm:p-0 hover:text-cyan-300 transition font-semibold flex items-center gap-1">
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
            <Link href="/auth/login" className="block py-2 px-2 sm:p-0 hover:text-cyan-300 transition font-semibold">Ingresar</Link>
          </li>
        ) : (
          <li>
            <button onClick={handleLogout} className="block py-2 px-2 sm:p-0 hover:text-cyan-300 transition font-semibold bg-transparent border-none cursor-pointer">Salir</button>
          </li>
        )}
      </ul>
    </nav>
  );
}
