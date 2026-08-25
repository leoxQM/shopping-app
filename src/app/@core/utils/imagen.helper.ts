import { constantesApiStore } from "../constantes/apiVariable"

export function construirImagen(ruta: string | undefined | null): string {
  if (!ruta) {
    return 'assets/no-image.jpg';
  }

  if (ruta.startsWith('http')) {
    return ruta;
  }

  return `${constantesApiStore.baseImagenes}${ruta}`;
}
