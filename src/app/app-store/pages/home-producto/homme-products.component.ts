import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { Button } from 'primeng/button';
import { ProductService } from '../../../@core/servicios/product.service';
import { Product } from '../../../@core/interfaces/product.interface';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DetalleProductoComponent } from '../detalle-producto/detalle-producto.component';
import { CarritoProductoComponent } from "../carrito-producto/carrito-producto.component";
import { CarritoService } from '../../../@core/servicios/carrito.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../../@core/servicios/messageService';
@Component({
  selector: 'app-homme-products',
  imports: [ProductCardComponent, PaginatorModule, CommonModule],
  templateUrl: './homme-products.component.html',
  styleUrl: './homme-products.component.css',
})
export class HommeProductsComponent implements OnInit{

  private productService = inject(ProductService);
  private router = inject(Router);
  private carritoService = inject(CarritoService);

  allProducts = signal<Product[]>([]);
  first = signal(0);
  rows = signal(6);
  productSeleccionado = signal<Product|null>(null)
  pagedProducts = computed(()=>
    this.allProducts().slice(this.first(), this.first()+this.rows())
  );

  ngOnInit(): void {
    this.listProducct();
  }

  O_SelectProduct(product: Product){
    this.productSeleccionado.set(product);
    this.router.navigate(['/product',product.id]);
  }

  O_AddToCar(product: Product){
    this.carritoService.agregarProducto(product)
  }
  listProducct(){
    this.productService.getProducts().subscribe({
      next: (data) => this.allProducts.set(data),
      error:(err)=> console.error('error al cargar la pagina',err)
    });
  }
  onPageChange(event: PaginatorState){
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 6);
    this.scrollTop()
  }

  scrollTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }
}
