import { API_BASE_URL } from "./apiConfig";

export async function getShoes() {
  const res = await fetch(`${API_BASE_URL}/api/shoes`);
  if (!res.ok) throw new Error("Error al obtener zapatos");
  return res.json();
}

export async function getOrders() {
  const res = await fetch(`${API_BASE_URL}/api/orders`);
  if (!res.ok) throw new Error("Error al obtener pedidos");
  return res.json();
}

export async function getCustomers() {
  const res = await fetch(`${API_BASE_URL}/api/customers`);
  if (!res.ok) throw new Error("Error al obtener clientes");
  return res.json();
}

export async function getOrderItems() {
  const res = await fetch(`${API_BASE_URL}/api/orderitems`);
  if (!res.ok) throw new Error("Error al obtener items de pedido");
  return res.json();
}
