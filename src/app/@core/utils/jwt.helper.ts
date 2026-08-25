import { JwtPayload } from "../interfaces/JwtPayload.interface";

export function descodificarToken(token: string): JwtPayload | null {
  try {
    const partes = token.split('.');
    if(partes.length !== 3) return null;

    const payloadBase64 = partes[1];
    const payloadNormalizado = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const payloadDecodificado = atob(payloadNormalizado);

    return JSON.parse(payloadDecodificado) as JwtPayload;
  } catch {
    return null;
  }
}

export function tokenExpirado(token: string): boolean {
  const payload = descodificarToken(token);
  if(!payload || !payload.exp) return true;

  const ahora = Math.floor(Date.now() / 1000);
  return payload.exp < ahora;
}
