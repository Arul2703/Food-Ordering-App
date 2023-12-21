import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { OrderDetails } from '../models/order-details';
import { InvoiceDetails } from '../models/invoice-details';
import { environment } from 'src/environments/environment';
import { LogService } from './log.service';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = environment.orderApiUrl; 
  private orderHistoryEndpoint = environment.apiUrls.orderHistory;

  constructor(private http: HttpClient,private logService :LogService) {}

  getOrderHistory(userId: number): Observable<InvoiceDetails[]> {
    const url = `${this.apiUrl}${this.orderHistoryEndpoint}?userId=${userId}`;
    return this.http.get<InvoiceDetails[]>(url).pipe(
      tap(() => {
        this.logService.logInfo(environment.messages.getOrderHistorySuccess);
      }),
      catchError((error) => {
        this.logService.logErrorWithDetails(environment.messages.getOrderHistoryError, error);
        return throwError(environment.messages.getOrderHistoryError);
      })
    );
  }
}
