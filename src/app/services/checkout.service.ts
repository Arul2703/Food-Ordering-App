import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CheckoutModel } from '../models/checkout-model';
import { AuthService } from './auth.service';
import { OrderSummaryService } from './order-summary.service';
import { PaymentResponseModel } from '../models/payment-reponse-model';
import { environment } from 'src/environments/environment';
import { LogService } from './log.service';
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = environment.orderApiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private logService : LogService,
    private orderSummaryService: OrderSummaryService 
  ) {}

  checkout(checkoutFormValue: CheckoutModel, cartItems: any[]): Observable<any> {
    const url = `${this.baseUrl}${environment.apiUrls.checkout}`;
    const headers = this.getAuthHeaders();

    const payload = {
      checkout: { ...checkoutFormValue },
      cart: cartItems
    };
    
    return this.http.post(url, payload, { headers }).pipe(
      catchError(error => {
        const errorMessage = environment.messages.checkoutError;
        this.logService.logErrorWithDetails(errorMessage, error);
        return throwError(errorMessage);
      })
    );
  }

  makePayment(paymentResponse: any): Observable<any> {
    const url = `${this.baseUrl}${environment.apiUrls.payment}`;
  
    return this.http.post<PaymentResponseModel>(url, paymentResponse).pipe(
      catchError(error => {
        const errorMessage = environment.messages.paymentError;
        this.logService.logErrorWithDetails(errorMessage, error);
        return throwError(errorMessage);
      }),
      tap((data: PaymentResponseModel) => {
        const message = data.message;
        const orderDetails = data.orderDetails;
  
        this.orderSummaryService.setOrderSummary(orderDetails);
        this.orderSummaryService.setMessage(message);
      })
    );
  }
  
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set(environment.authHeaders.authorization, `${environment.authHeaders.bearerToken} ${token}`);
  }
}
