import React from "react";
import { getCustomers } from "../apiService";

type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export default async function CustomersPage() {
  let customers: Customer[] = [];
  try {
    customers = await getCustomers();
  } catch (_e) {
    // Error handling
  }
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Clientes</h1>
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        {customers.length > 0 ? (
          <table className="w-full text-left text-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-800">
                  <td className="py-2 px-4">{customer.id}</td>
                  <td className="py-2 px-4">{customer.firstName} {customer.lastName}</td>
                  <td className="py-2 px-4">{customer.email}</td>
                  <td className="py-2 px-4">{customer.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-400">No hay clientes disponibles o error de conexión.</div>
        )}
      </div>
    </div>
  );
}
