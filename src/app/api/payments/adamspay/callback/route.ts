import { NextRequest, NextResponse } from "next/server";

// AdamsPay redirige aquí tras el pago. Recibe parámetros por querystring.
// Ejemplo: ?status=success|failure&orderId=123

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // AdamsPay puede enviar distintos parámetros según el flujo
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const intent = searchParams.get("intent");
  const merchant = searchParams.get("merchant");
  const app = searchParams.get("app");
  const type = searchParams.get("type");
  const doc_id = searchParams.get("doc_id");

  let redirectUrl = "/?";
  if (status === "success") {
    redirectUrl += `mensaje=¡Pago+exitoso!+Gracias+por+tu+compra.&tipo=success`;
  } else if (status === "failure") {
    redirectUrl += `mensaje=No+se+pudo+procesar+el+pago.+Intenta+nuevamente.&tipo=error`;
  } else {
    // Si no viene status, igual redirige con mensaje genérico
    redirectUrl += `mensaje=El+proceso+de+AdamsPay+ha+finalizado.&tipo=success`;
  }
  return NextResponse.redirect(redirectUrl);
}
