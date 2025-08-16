import React from "react";
import { getOrderItems } from "../apiService";

export default async function OrderItemsPage() {
  let items: any[] = [];
  try {
    items = await getOrderItems();
  } catch (e) {
    // Error handling
  }
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Items de Pedido</h1>
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        {items.length > 0 ? (
          <table className="w-full text-left text-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Pedido</th>
                <th className="py-2 px-4">Producto</th>
                <th className="py-2 px-4">Cantidad</th>
                <th className="py-2 px-4">Precio</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-800">
                  <td className="py-2 px-4">{item.id}</td>
                  <td className="py-2 px-4">{item.orderId}</td>
                  <td className="py-2 px-4">{item.productName}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-400">No hay items disponibles o error de conexión.</div>
        )}
      </div>
    </div>
  );
}
