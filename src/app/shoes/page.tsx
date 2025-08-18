import React from "react";
import { getShoes } from "../apiService";

type Shoe = {
  id: number;
  model: string;
  brand: string;
  price: number;
  stock: number;
  season: string;
};

export default async function ShoesPage() {
  let shoes: Shoe[] = [];
  try {
    shoes = await getShoes();
  } catch (_e) {
    // Error handling
  }
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Catálogo de Zapatos</h1>
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        {shoes.length > 0 ? (
          <table className="w-full text-left text-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Marca</th>
                <th className="py-2 px-4">Precio</th>
              </tr>
            </thead>
            <tbody>
              {shoes.map((shoe) => (
                <tr key={shoe.id} className="border-b border-gray-800">
                  <td className="py-2 px-4">{shoe.id}</td>
                  <td className="py-2 px-4">{shoe.model}</td>
                  <td className="py-2 px-4">{shoe.brand}</td>
                  <td className="py-2 px-4">${shoe.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-400">No hay zapatos disponibles o error de conexión.</div>
        )}
      </div>
    </div>
  );
}
