import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient)

  getProducts(){
    return this.http.get<Product[]>("/data/product.json")
  }

  getProductById(id: number){
    return this.getProducts().pipe(
      map((products)=> products.find(p=>p.id===id))
    )
  }
}
