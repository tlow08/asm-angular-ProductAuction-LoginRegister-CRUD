import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
export type User = {
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl ='http://localhost:8000/api/auth';
  constructor(private http: HttpClient){}

  registerUSer(data :User): Observable<User>{
    return this.http.post<User>(`${this.apiUrl}/register`,data);
  }
  loginUser(data: User): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token); 
        }
      })
    );
  }
  getToken(): string | null {
    // const token = localStorage.getItem('token');
    // console.log('Retrieved Token:', token);
    // return token;
    return localStorage.getItem('token')
  }

  storeToken(accessToken: string): void {
    localStorage.setItem('token', accessToken); 
  }
  
  getUser(): User | null {
    const token = localStorage.getItem('token');
    if (token) {
      return { email: 'decoded-email', password: '' };
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
