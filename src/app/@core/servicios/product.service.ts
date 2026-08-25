import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { map, Observable } from 'rxjs';
import { constantesApiStore } from '../constantes/apiVariable';
import { PageResponse } from '../interfaces/pageResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  // getProducts() {
  //   return this.http.get<Product[]>('/data/product.json');
  // }

  // getProductById(id: number) {
  //   return this.getProducts().pipe(
  //     map((products) => products.find((p) => p.id === id)),
  //   );
  // }

  obtenerProductos(page: number = 0, size: number = 10) {
    const url = `${constantesApiStore.obtenerProductos}?page=${page}&size=${size}`;
    return this.http.get<PageResponse<Product>>(url);
  }

  obtenerProductosXId(id: number) {
    const url = `${constantesApiStore.obtenerProductos}/${id}`;
    return this.http.get<Product>(url);
  }

  buscarProductos(nombre: string, page: number = 0, size: number = 10) {
    const url = `${constantesApiStore.obtenerProductos}/buscar?nombre=${nombre}&page=${page}&size=${size}`;
    return this.http.get<PageResponse<Product>>(url);
  }

  crearProducto(producto: Product) {
    const url = `${constantesApiStore.obtenerProductos}`;
    return this.http.post<Product>(url, producto);
  }

  editarProducto(producto: Product, id: number) {
    const url = `${constantesApiStore.obtenerProductos}/${id}`;
    return this.http.put<Product>(url, producto);
  }

  eliminarProducto(id: number) {
    const url = `${constantesApiStore.obtenerProductos}/${id}`;
    return this.http.delete<any>(url);
  }

  obtenerXCategorias(categoria: string, page: number, size: number) {
    const url = `${constantesApiStore.obtenerXCategoria}${categoria}?page=${page}&size=${size}`;
    return this.http.get<PageResponse<Product>>(url);
  }

  agregarImagenesProducto(id: number, imagenes: File[]) {
    const url = `${constantesApiStore.obtenerProductos}/${id}/imagenes`;
    const formData = new FormData();
    imagenes.forEach((img) => formData.append('file', img));
    return this.http.post<File>(url, formData);
  }

  agregarImagenProducto(id: number, img: File) {
    const url = `${constantesApiStore.obtenerProductos}/${id}/imagen`;
    const formData = new FormData();
    formData.append('file', img);
    return this.http.post<Product>(url, formData);
  }

  eliminarImagenProducto(id: number, nameImg: string) {
    const url = `${constantesApiStore.obtenerProductos}/${id}/imagen?nombreImagen=${nameImg}`;
    return this.http.delete<any>(url);
  }

  obtenerCategorias() {
    const url = `${constantesApiStore.obtenerProductos}/categorias`;
    return this.http.get<string[]>(url);
  }

  obtenerColores(){
    const url = `${constantesApiStore.obtenerProductos}/colores`;
    return this.http.get<string[]>(url);
  }
}
