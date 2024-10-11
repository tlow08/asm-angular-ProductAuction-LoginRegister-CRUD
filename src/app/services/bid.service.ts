import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BidService {
  private apiUrl = 'http://localhost:8000/api/bids';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  public placeBid(productId: string, bidAmount: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/place-bid`,
      { productId, bidAmount },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  public getBidsForProduct(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/bid-list/${productId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  public saveWinner(productId: string, winner: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-winner/${productId}`, { winnerId: winner._id }, {
      headers: this.getAuthHeaders(),
    });
  }
  
}
