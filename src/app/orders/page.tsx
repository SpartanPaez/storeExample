import React from "react";
import { getOrders } from "../apiService";

type Order = {
  id: number;
  customerId: number;
  customerName: string;
  date: string;
  total: number;
};

export default async function OrdersPage() {
  let orders: Order[] = [];
  try {
    orders = await getOrders();
  } catch (_e) {
    // Error handling
  }
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Pedidos</h1>
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        {orders.length > 0 ? (
          <table className="w-full text-left text-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Cliente</th>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-800">
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">{order.customerName}</td>
                  <td className="py-2 px-4">{order.date}</td>
                  <td className="py-2 px-4">${order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-400">No hay pedidos disponibles o error de conexión.</div>
        )}
      </div>
    </div>
  );
}
