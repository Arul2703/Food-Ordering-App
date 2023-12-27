import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { InvoiceDetails } from '../models/invoice-details';
import { OrderDetails } from '../models/order-details';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { LogService } from '../services/log.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: InvoiceDetails[] = [];
  
  userId = 1; 
  selectedInvoice: InvoiceDetails | null = null;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private authService : AuthService,
    private logService : LogService ) 
    {}

  ngOnInit(): void {
    this.getOrderHistory();
  }

  getOrderHistory(): void {
    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser?.userId;
    this.orderService.getOrderHistory(userId!).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (data) => {
        this.orderHistory = data;
      },
      (error) => {
        this.logService.logErrorWithDetails(environment.messages.orderHistoryFailure, error);
      }
    );
  }

  showOrderDetails(invoice: InvoiceDetails): void {
    this.selectedInvoice = invoice;
  }

  calculateTotalAmount(orderDetails: OrderDetails[]): number {
    let totalAmount = 0;
  
    orderDetails.forEach((order) => {
      totalAmount += order.foodItemPrice * order.foodItemQty;
    });
  
    return totalAmount;
  }
  
  toggleOrderDetails(invoice: InvoiceDetails): void {
    if (this.selectedInvoice && this.selectedInvoice === invoice) {
      console.log('toogle');
      // If the selected invoice is already shown, collapse it
      this.selectedInvoice = null;
    } else {
      // If a different invoice is clicked, show its details
      this.selectedInvoice = invoice;
    }
  }

  getBase64Image(base64String: string): string {
    return environment.userProfileFields.base64Prefix + base64String;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
