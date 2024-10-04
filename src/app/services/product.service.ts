import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type Product = {
  _id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  startAt: Date;
  endAt: Date;
  currentBidPrice: number;  
  bidTime?: number;       
  bidPriceMax?: number; 
};

export type ProductResponse = {
  message: string;
  data: Product[];
};

export type ProductDetail = {
  message: string;
  data: Product;
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/products';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllProduct(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.apiUrl);
  }

  getProductDetail(_id: string | number) {
    return this.http.get<ProductDetail>(`${this.apiUrl}/${_id}`);
  }

  deleteProduct(_id: string | number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${_id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createProduct(data: Product): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  editProduct(_id: string | number, data: Product){
    const updatedData = {
      ...data,
      startAt: data.startAt ? new Date(data.startAt).toISOString() : undefined,
      endAt: data.endAt ? new Date(data.endAt).toISOString() : undefined,
    };
    return this.http.patch(`${this.apiUrl}/${_id}`, updatedData,{
      headers: this.getAuthHeaders(),
    });
  }
}
