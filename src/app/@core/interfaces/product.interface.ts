export interface Product {
  id?: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  moneda?: string;
  categoria?: string;
  tallas?: string[];
  colores?: string[];
  imagen?: string;
  imagenes?: string[];
  stock?: number;
}
