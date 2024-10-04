import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type Category={
  _id?: string,
  title: string,
  description: string
}
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8000/api/categories'; // Adjust the URL based on your API

  constructor(private http: HttpClient) {}
  getCategories(): Observable<{ success: boolean; data: Category[]; message: string }> {
    return this.http.get<{ success: boolean; data: Category[]; message: string }>(this.apiUrl);
  }
}
